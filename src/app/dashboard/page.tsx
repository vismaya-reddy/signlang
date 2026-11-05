'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProtectedLayout } from '@/components/protected-layout';
import { Navbar } from '@/components/navbar';
import { useAuth } from '@/hooks/use-auth';
import {
  Zap,
  Flame,
  BookOpen,
  Award,
  ArrowRight,
  Play,
  Lock,
  CheckCircle2,
  Users,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, profile, logout } = useAuth();

  // Use real user data from profile, fallback to defaults
  const userStats = {
    name: profile?.name || user?.user_metadata?.full_name || 'User',
    xp: profile?.xp || 0,
    level: profile?.level || 1,
    streak: profile?.current_streak || 0,
    lessonsCompleted: profile?.total_lessons_completed || 0,
    accuracy: 87, // Will be calculated from progress data
  };

  const modules = [
    {
      id: 1,
      title: 'ISL Alphabets (A-Z)',
      description: 'Master the 26 Indian Sign Language letters & vowels',
      progress: 100,
      lessons: 26,
      icon: '🔤',
      locked: false,
      href: '/alphabet',
    },
    {
      id: 2,
      title: 'Core ISL Vocabulary',
      description: 'Greetings, family, daily items & emotion signs',
      progress: 65,
      lessons: 24,
      icon: '📝',
      locked: false,
      href: '/vocabulary',
    },
    {
      id: 3,
      title: 'ISL Practice & Quizzes',
      description: 'Interactive sign recognition & streak challenges',
      progress: 40,
      lessons: 30,
      icon: '⚡',
      locked: false,
      href: '/practice',
    },
    {
      id: 4,
      title: 'Numbers & Counting (0-100)',
      description: 'Single-hand and two-hand numerical values',
      progress: 25,
      lessons: 15,
      icon: '🔢',
      locked: false,
      href: '/practice',
    },
    {
      id: 5,
      title: 'Conversational Dialogues',
      description: 'Real-world interactions & classroom signing',
      progress: 0,
      lessons: 25,
      icon: '💬',
      locked: true,
      href: '#',
    },
  ];

  const achievements = [
    { icon: '🎯', title: 'First Step', description: 'Complete your first lesson' },
    { icon: '🔥', title: '7-Day Streak', description: 'Practice 7 days in a row' },
    { icon: '⭐', title: 'Century Club', description: 'Earn 100 XP' },
    { icon: '🏆', title: 'Level 5', description: 'Reach level 5' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
        <Navbar />

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* Stats Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-4 gap-4"
        >
          {/* XP Card */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total XP</p>
                  <p className="text-3xl font-display font-bold">{userStats.xp}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <Zap className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Level Card */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:border-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="text-3xl font-display font-bold">{userStats.level}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                  <Award className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Streak Card */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover:border-secondary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                  <p className="text-3xl font-display font-bold">{userStats.streak}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary">
                  <Flame className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Accuracy Card */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                  <p className="text-3xl font-display font-bold">{userStats.accuracy}%</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.section>

        {/* Continue Learning */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold">Continue Learning</h2>
            <Link href="/practice">
              <Button variant="ghost" size="sm">
                View All Lessons
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-primary/20 hover:border-primary/50 transition-all group cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔤</span>
                    <h3 className="font-display font-semibold text-lg">Alphabets: Lesson 15</h3>
                  </div>
                  <p className="text-muted-foreground">Master letters M, N, O - Continuing where you left off</p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary to-accent h-full rounded-full w-[85%]" />
                  </div>
                  <p className="text-xs text-muted-foreground">85% Complete</p>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 ml-4"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Continue
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.section>

        {/* Learning Modules */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-display font-bold">Learning Modules</h2>

          <motion.div variants={containerVariants} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => (
              <motion.div key={module.id} variants={itemVariants}>
                <Link href={module.locked ? '#' : (module.href || `/modules/${module.id}`)}>
                  <Card
                    className={`p-6 transition-all group hover:shadow-lg ${
                      module.locked
                        ? 'opacity-60 cursor-not-allowed'
                        : 'hover:border-primary/50 cursor-pointer'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="text-3xl">{module.icon}</div>
                          <h3 className="font-display font-semibold text-lg">{module.title}</h3>
                          <p className="text-sm text-muted-foreground">{module.description}</p>
                        </div>
                        {module.locked && <Lock className="w-5 h-5 text-muted-foreground" />}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{module.lessons} lessons</span>
                          <span className="font-medium text-primary">{module.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-full rounded-full transition-all ${
                              module.progress === 100
                                ? 'bg-emerald-500'
                                : 'bg-gradient-to-r from-primary to-accent'
                            }`}
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start pl-0"
                        disabled={module.locked}
                      >
                        {module.progress === 100 ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                            Completed
                          </>
                        ) : module.progress > 0 ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Continue
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Achievements */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-display font-bold">Achievements</h2>

          <motion.div variants={containerVariants} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="p-6 text-center hover:border-primary/50 transition-colors group">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{achievement.icon}</div>
                  <h3 className="font-display font-semibold mb-1">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-4 pb-8"
        >
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:border-primary/50 transition-colors group cursor-pointer">
              <MessageSquare className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-display font-semibold mb-2">AI Chat</h3>
              <p className="text-sm text-muted-foreground mb-4">Ask questions and practice conversations</p>
              <Link href="/chat">
                <Button variant="ghost" size="sm" className="pl-0">
                  Start Chat <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover:border-secondary/50 transition-colors group cursor-pointer">
              <Users className="w-8 h-8 text-secondary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-display font-semibold mb-2">Community</h3>
              <p className="text-sm text-muted-foreground mb-4">Connect with other learners</p>
              <Link href="/community">
                <Button variant="ghost" size="sm" className="pl-0">
                  Join Now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:border-accent/50 transition-colors group cursor-pointer">
              <BookOpen className="w-8 h-8 text-accent mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-display font-semibold mb-2">Vocabulary Lexicon</h3>
              <p className="text-sm text-muted-foreground mb-4">Explore 100+ verified ISL words & phrases</p>
              <Link href="/vocabulary">
                <Button variant="ghost" size="sm" className="pl-0">
                  Explore Signs <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </Card>
          </motion.div>
        </motion.section>
      </main>
    </div>
    </ProtectedLayout>
  );
}
