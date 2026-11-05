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
  HelpCircle,
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

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctAnswer;
    if (isCorrect) {
      const bonusXP = currentQ.points + streak * 10;
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
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Top Status Bar: Progress, XP, Streak */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800">
            ISL Mastery Challenge
          </span>
          <span className="text-xs text-slate-400">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Flame className="w-4 h-4 fill-amber-500/20" />
            <span>{streak} Streak</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Zap className="w-4 h-4 fill-cyan-500/20" />
            <span>+{earnedXP} XP</span>
          </div>
        </div>
      </div>

      {!quizCompleted ? (
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Title & Meta */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="capitalize">{currentQ.category}</span>
              <span>·</span>
              <span className="capitalize">{currentQ.difficulty}</span>
              <span>·</span>
              <span className="text-indigo-400 font-semibold">+{currentQ.points} Base XP</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Optional 3D Visualizer clue for letter questions */}
          {previewLetterMatch && (
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Visual Reference (Letter {letterCode})</span>
                <span className="text-[10px] text-slate-500">Rotate to inspect anatomical pose</span>
              </div>
              <HandSign3D currentSign={letterCode} showControls={false} className="h-44" />
            </div>
          )}

          {/* Answer Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQ.correctAnswer;

              let btnStyle = 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950 text-slate-200';
              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                } else if (isSelected) {
                  btnStyle = 'bg-red-950/50 border-red-500 text-red-200 ring-1 ring-red-500';
                } else {
                  btnStyle = 'bg-slate-950/30 border-slate-900 text-slate-600 opacity-50';
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
                    <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-mono flex items-center justify-center shrink-0 text-slate-300">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </div>

                  {isAnswered && (
                    <div className="shrink-0">
                      {isCorrectAnswer ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-red-400" />
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
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                    : 'bg-amber-950/30 border-amber-800/60 text-amber-300'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {selectedOption === currentQ.correctAnswer ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Correct! +{currentQ.points + (streak - 1) * 10} XP awarded</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-amber-400" />
                      <span>Not quite right</span>
                    </>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed pl-6">{currentQ.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Action */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <span className="text-xs text-slate-500">
              Indian Sign Language Research & Training Centre (ISLRTC) verified
            </span>

            {isAnswered && (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs text-white shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-colors"
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
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center mx-auto text-white shadow-xl shadow-indigo-500/30">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white">Challenge Completed!</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              You scored <span className="font-bold text-white">{score}</span> out of{' '}
              <span className="font-bold text-white">{questions.length}</span> correct on official ISL curriculum questions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Total XP Gained</span>
              <p className="text-2xl font-bold text-cyan-400 mt-1">+{earnedXP} XP</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Accuracy Rate</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">
                {Math.round((score / questions.length) * 100)}%
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Max Streak</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">{streak} in a row</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Challenge</span>
            </button>
            <Link
              href="/alphabet"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-2"
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
