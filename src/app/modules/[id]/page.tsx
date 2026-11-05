'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Play, Lock, CheckCircle2, Clock } from 'lucide-react';

const modulesData: Record<string, any> = {
  '1': {
    title: 'Alphabets (A-Z)',
    description: 'Master the ASL alphabet letters',
    icon: '🔤',
    lessons: Array.from({ length: 26 }, (_, i) => ({
      id: i + 1,
      title: String.fromCharCode(65 + i),
      description: `Learn the letter ${String.fromCharCode(65 + i)}`,
      duration: '3-5 min',
      completed: i < 15,
      locked: false,
    })),
  },
  '2': {
    title: 'Numbers (0-100)',
    description: 'Learn to sign numbers',
    icon: '🔢',
    lessons: [
      { id: 1, title: '0-10', description: 'Basic single digits', duration: '5 min', completed: true, locked: false },
      { id: 2, title: '11-20', description: 'Teen numbers', duration: '5 min', completed: true, locked: false },
      { id: 3, title: '21-50', description: 'Multi-digit numbers', duration: '6 min', completed: false, locked: false },
      ...Array.from({ length: 12 }, (_, i) => ({
        id: i + 4,
        title: `Lesson ${i + 4}`,
        description: 'Number practice',
        duration: '5 min',
        completed: false,
        locked: i > 5,
      })),
    ],
  },
  '3': {
    title: 'Basic Words',
    description: 'Common everyday words',
    icon: '📝',
    lessons: [
      { id: 1, title: 'Greetings', description: 'Hello, goodbye, etc.', duration: '6 min', completed: true, locked: false },
      { id: 2, title: 'Food Items', description: 'Common foods', duration: '7 min', completed: false, locked: false },
      { id: 3, title: 'People', description: 'Family members', duration: '6 min', completed: false, locked: false },
      ...Array.from({ length: 27 }, (_, i) => ({
        id: i + 4,
        title: `Lesson ${i + 4}`,
        description: 'Word practice',
        duration: '5 min',
        completed: false,
        locked: i > 8,
      })),
    ],
  },
};

export default function ModulePage() {
  const params = useParams();
  const moduleId = params.id as string;
  const moduleData = modulesData[moduleId];

  if (!moduleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Module not found</h1>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = moduleData.lessons.filter((l: any) => l.completed).length;
  const totalCount = moduleData.lessons.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

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
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Module header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">{moduleData.icon}</span>
            <div className="flex-1">
              <h1 className="text-4xl font-display font-bold">{moduleData.title}</h1>
              <p className="text-muted-foreground mt-1">{moduleData.description}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {completedCount} of {totalCount} lessons completed
              </span>
              <span className="text-sm font-medium text-primary">{progressPercent}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-primary to-accent h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Lessons grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {moduleData.lessons.map((lesson: any, idx: number) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
            >
              <Link href={lesson.locked ? '#' : `/lessons/${lesson.id}`}>
                <Card
                  className={`p-6 transition-all group hover:shadow-lg ${
                    lesson.locked
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:border-primary/50 cursor-pointer'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-lg">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground">{lesson.description}</p>
                      </div>
                      {lesson.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      ) : lesson.locked ? (
                        <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      ) : null}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.duration}
                      </div>
                      {!lesson.locked && (
                        <div className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-3 h-3" />
                          Start
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
