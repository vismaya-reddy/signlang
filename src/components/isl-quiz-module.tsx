'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Award,
  Flame,
  ArrowRight,
  RotateCcw,
  Zap,
  BookOpen,
} from 'lucide-react';
import { ISL_QUIZ_QUESTIONS, ISLQuizQuestion } from '@/lib/isl-data';
import { HandSign3D } from '@/components/3d/HandSign3D';

export function ISLQuizModule() {
  const [questions] = useState<ISLQuizQuestion[]>([...ISL_QUIZ_QUESTIONS]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isSavingXP, setIsSavingXP] = useState(false);

  const currentQ = questions[currentIndex];

  const isOptionCorrect = (idx: number, optText: string) => {
    return (
      idx === currentQ.correctAnswer ||
      optText === currentQ.correctAnswer ||
      String(idx) === String(currentQ.correctAnswer)
    );
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = isOptionCorrect(index, currentQ.options[index]);
    const basePoints = currentQ.points || 50;
    if (isCorrect) {
      const bonusXP = basePoints + streak * 10;
      setScore((prev) => prev + 1);
      setEarnedXP((prev) => prev + bonusXP);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
      // Persist XP reward to backend
      try {
        setIsSavingXP(true);
        await fetch('/api/progress/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            xp: earnedXP,
            lessonId: `isl_quiz_${Date.now()}`,
          }),
        });
      } catch (e) {
        console.warn('Progress save fallback');
      } finally {
        setIsSavingXP(false);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setEarnedXP(0);
    setStreak(0);
    setQuizCompleted(false);
  };

  // If letter is tested, show matching 3D preview
  const previewLetterMatch = currentQ?.question.match(/letter\s+([A-Z])/i);
  const letterCode = previewLetterMatch ? previewLetterMatch[1].toUpperCase() : 'A';

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-md space-y-6">
      {/* Top Status Bar: Progress, XP, Streak */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/25">
            ISL Mastery Challenge
          </span>
          <span className="text-xs text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 text-amber-500 font-semibold">
            <Flame className="w-4 h-4 fill-amber-500/20" />
            <span>{streak} Streak</span>
          </div>
          <div className="flex items-center gap-1.5 text-secondary font-semibold">
            <Zap className="w-4 h-4 fill-secondary/20" />
            <span>+{earnedXP} XP</span>
          </div>
        </div>
      </div>

      {!quizCompleted ? (
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Title & Meta */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="capitalize">{currentQ.category}</span>
              <span>&bull;</span>
              <span className="capitalize">{currentQ.difficulty}</span>
              <span>&bull;</span>
              <span className="text-primary font-semibold">+{currentQ.points} Base XP</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Optional 3D Visualizer clue for letter questions */}
          {previewLetterMatch && (
            <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span>Visual Reference (Letter {letterCode})</span>
                <span className="text-[10px] text-muted-foreground">Rotate to inspect anatomical pose</span>
              </div>
              <HandSign3D letter={letterCode} showControls={false} className="h-44" />
            </div>
          )}

          {/* Answer Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = isOptionCorrect(idx, option);

              let btnStyle = 'bg-background border-border hover:border-primary/50 text-foreground';
              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500 font-semibold';
                } else if (isSelected) {
                  btnStyle = 'bg-destructive/15 border-destructive text-destructive ring-1 ring-destructive';
                } else {
                  btnStyle = 'bg-background/40 border-border/40 text-muted-foreground opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`p-4 rounded-xl border text-left font-medium text-sm transition-all duration-200 flex items-start justify-between gap-3 ${btnStyle}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-muted border border-border text-xs font-mono flex items-center justify-center shrink-0 text-foreground font-semibold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </div>

                  {isAnswered && (
                    <div className="shrink-0">
                      {isCorrectAnswer ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-destructive" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-1.5 ${
                  selectedOption === currentQ.correctAnswer
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {selectedOption === currentQ.correctAnswer ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Correct! +{currentQ.points + (streak - 1) * 10} XP awarded</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Not quite right</span>
                    </>
                  )}
                </div>
                <p className="text-foreground leading-relaxed pl-6">{currentQ.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Action */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground">
              ISLRTC verified Indian Sign Language curriculum
            </span>

            {isAnswered && (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 font-semibold text-xs text-primary-foreground shadow-sm flex items-center gap-2 transition-all"
              >
                <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Challenge'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Finished Summary */
        <div className="py-8 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center mx-auto text-primary-foreground shadow-sm">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-display font-extrabold text-foreground">Challenge Completed!</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You scored <span className="font-bold text-foreground">{score}</span> out of{' '}
              <span className="font-bold text-foreground">{questions.length}</span> correct on official ISL curriculum questions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto text-left">
            <div className="p-4 rounded-xl bg-background border border-border">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Total XP Gained</span>
              <p className="text-2xl font-bold text-secondary mt-1">+{earnedXP} XP</p>
            </div>
            <div className="p-4 rounded-xl bg-background border border-border">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Accuracy Rate</span>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {Math.round((score / questions.length) * 100)}%
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background border border-border col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Max Streak</span>
              <p className="text-2xl font-bold text-amber-500 mt-1">{streak} in a row</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold flex items-center gap-2 border border-border transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Challenge</span>
            </button>
            <Link
              href="/alphabet"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm flex items-center gap-2 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore A–Z Alphabet</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
export default ISLQuizModule;
