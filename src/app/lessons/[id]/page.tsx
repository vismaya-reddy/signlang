'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Play, 
  Video, 
  BookOpen, 
  Zap,
  Volume2,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { useState } from 'react';

export default function LessonPage() {
  const params = useParams();
  const lessonId = params.id as string;
  const [videoSpeed, setVideoSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock lesson data - will be replaced with real data from DB
  const lesson = {
    id: lessonId,
    title: 'Letter A',
    description: 'Learn how to sign the letter A in American Sign Language',
    xpReward: 50,
    duration: '5 minutes',
    video: {
      url: '/api/generate-video', // Placeholder for AI-generated video
      thumbnail: 'https://via.placeholder.com/800x450?text=Sign+Language+Video',
    },
    content: {
      overview: 'The letter A is one of the most fundamental gestures in ASL. Master this foundational sign as you begin your sign language journey.',
      steps: [
        {
          number: 1,
          title: 'Hand Position',
          description: 'Make a fist with your dominant hand. Your fingers should be curled inward, with your thumb on the side of your index finger.',
          image: 'https://via.placeholder.com/400x300?text=Hand+Position',
        },
        {
          number: 2,
          title: 'Palm Orientation',
          description: 'Keep your palm facing outward or slightly upward. Your hand should be positioned at chest level.',
          image: 'https://via.placeholder.com/400x300?text=Palm+Orientation',
        },
        {
          number: 3,
          title: 'Movement',
          description: 'The letter A is typically a stationary sign. Hold your hand steady at chest level to fully express the letter.',
          image: 'https://via.placeholder.com/400x300?text=Movement',
        },
      ],
      tips: [
        'Keep your hand relaxed - tension can affect clarity',
        'Make sure the thumbs placement is clear and visible',
        'Practice in front of a mirror to check your form',
        'Video your practice to compare with expert signers',
      ],
    },
    practice: {
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: 'What hand position do you use for the letter A?',
          options: [
            { id: 'a', text: 'Open hand with fingers spread', correct: false },
            { id: 'b', text: 'Closed fist with curled fingers', correct: true },
            { id: 'c', text: 'Peace sign with two fingers', correct: false },
            { id: 'd', text: 'Pointing with one finger', correct: false },
          ],
        },
        {
          id: 2,
          type: 'video-recognition',
          question: 'Show me the letter A sign in front of your camera',
          prompt: 'Click record to start practicing. The AI will evaluate your gesture.',
        },
        {
          id: 3,
          type: 'multiple-choice',
          question: 'Where should the letter A be positioned?',
          options: [
            { id: 'a', text: 'Above your head', correct: false },
            { id: 'b', text: 'At chest level', correct: true },
            { id: 'c', text: 'Near your hip', correct: false },
            { id: 'd', text: 'Any position is fine', correct: false },
          ],
        },
      ],
    },
  };

  const handlePractice = () => {
    // TODO: Integrate with MediaPipe gesture recognition
    alert('Practice mode would launch webcam and gesture recognition');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">+{lesson.xpReward} XP</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Lesson header */}
          <div className="space-y-4">
            <div>
              <h1 className="text-5xl font-display font-bold mb-2">{lesson.title}</h1>
              <p className="text-lg text-muted-foreground">{lesson.description}</p>
            </div>
          </div>

          {/* Video section */}
          <Card className="overflow-hidden border-primary/20 bg-card/50">
            <div className="relative bg-black/50 aspect-video flex items-center justify-center group">
              <img
                src={lesson.video.thumbnail}
                alt="Video thumbnail"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaying(true)}
                className="relative z-10 w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white hover:shadow-lg hover:shadow-primary/50 transition-all"
              >
                <Play className="w-6 h-6 ml-1" fill="currentColor" />
              </motion.button>

              {/* Video controls (when video is playing) */}
              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-20"
                >
                  <div className="flex items-center gap-4 text-white text-sm">
                    <span>Speed:</span>
                    <div className="flex gap-2">
                      {[0.75, 1, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => setVideoSpeed(speed)}
                          className={`px-2 py-1 rounded transition-colors ${
                            videoSpeed === speed
                              ? 'bg-primary text-white'
                              : 'bg-white/10 hover:bg-white/20'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </Card>

          {/* Content grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-display font-bold mb-4">Overview</h2>
                <Card className="p-6 bg-card/50 border-border/50">
                  <p className="text-muted-foreground leading-relaxed">{lesson.content.overview}</p>
                </Card>
              </motion.div>

              {/* Step-by-step breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-display font-bold mb-4">Step-by-Step Breakdown</h2>
                <div className="space-y-4">
                  {lesson.content.steps.map((step, idx) => (
                    <motion.div
                      key={step.number}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                    >
                      <Card className="overflow-hidden border-border/50 hover:border-primary/50 transition-colors">
                        <div className="grid md:grid-cols-2 gap-6 p-6">
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold">
                                {step.number}
                              </div>
                              <h3 className="text-lg font-semibold">{step.title}</h3>
                            </div>
                            <p className="text-muted-foreground">{step.description}</p>
                          </div>
                          <div className="flex items-center justify-center">
                            <img
                              src={step.image}
                              alt={step.title}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl font-display font-bold mb-4">Pro Tips</h2>
                <Card className="p-6 bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
                  <ul className="space-y-3">
                    {lesson.content.tips.map((tip, idx) => (
                      <li key={idx} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                        </div>
                        <span className="text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {/* Practice card */}
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 sticky top-24">
                <h3 className="font-display font-semibold text-lg mb-4">Ready to Practice?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use your webcam to practice the sign. The AI will provide instant feedback on your form and accuracy.
                </p>
                <Button
                  onClick={handlePractice}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 mb-3"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Start Practice
                </Button>
                <Button variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Progress
                </Button>
              </Card>

              {/* Lesson info card */}
              <Card className="p-6 bg-card/50 border-border/50 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Duration</p>
                  <p className="font-semibold">{lesson.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Difficulty</p>
                  <p className="font-semibold">Beginner</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">XP Reward</p>
                  <p className="font-semibold text-primary">{lesson.xpReward} points</p>
                </div>
              </Card>

              {/* AI Guide */}
              <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Volume2 className="w-5 h-5 text-secondary" />
                  <h4 className="font-semibold">AI Guide</h4>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  "Focus on keeping your hand relaxed. Tension in your fingers can make the sign unclear. Practice makes perfect!"
                </p>
              </Card>
            </motion.div>
          </div>

          {/* Practice quiz section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-display font-bold">Knowledge Check</h2>
            <div className="space-y-4">
              {lesson.practice.questions.slice(0, 2).map((question, idx) => (
                <Card key={question.id} className="p-6 bg-card/50 border-border/50">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary text-xs font-bold">
                      {idx + 1}
                    </div>
                    <p className="font-semibold flex-1">{question.question}</p>
                  </div>

                  {question.type === 'multiple-choice' && (
                    <div className="grid md:grid-cols-2 gap-3">
                      {question.options?.map((option) => (
                        <button
                          key={option.id}
                          className="p-3 border border-border/50 rounded-lg text-left hover:border-primary/50 hover:bg-primary/5 transition-all text-sm"
                        >
                          {option.text}
                        </button>
                      ))}
                    </div>
                  )}

                  {question.type === 'video-recognition' && (
                    <Button variant="outline" className="w-full">
                      <Video className="w-4 h-4 mr-2" />
                      Record Answer
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
