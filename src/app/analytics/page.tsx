'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  PieChart,
  Download,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('week');

  // Mock analytics data
  const analytics = {
    overview: {
      totalLessonsCompleted: 24,
      averageAccuracy: 82,
      totalXpEarned: 2450,
      currentStreak: 7,
      improvementTrend: 'up',
    },
    progressByModule: [
      { name: 'Alphabets', completed: 26, total: 26, accuracy: 95 },
      { name: 'Numbers', completed: 9, total: 15, accuracy: 88 },
      { name: 'Basic Words', completed: 12, total: 30, accuracy: 75 },
      { name: 'Sentence Formation', completed: 0, total: 20, accuracy: 0 },
    ],
    weakAreas: [
      { area: 'Finger positioning', accuracy: 65, attempts: 8 },
      { area: 'Hand movement fluidity', accuracy: 72, attempts: 12 },
      { area: 'Speed consistency', accuracy: 78, attempts: 5 },
    ],
    dailyActivity: [
      { date: 'Mon', xpEarned: 150, lessonsCompleted: 2 },
      { date: 'Tue', xpEarned: 200, lessonsCompleted: 3 },
      { date: 'Wed', xpEarned: 100, lessonsCompleted: 1 },
      { date: 'Thu', xpEarned: 250, lessonsCompleted: 4 },
      { date: 'Fri', xpEarned: 300, lessonsCompleted: 5 },
      { date: 'Sat', xpEarned: 200, lessonsCompleted: 3 },
      { date: 'Sun', xpEarned: 250, lessonsCompleted: 4 },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-display font-bold">Learning Analytics</h1>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex gap-2"
        >
          {['week', 'month', 'allTime'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={
                timeRange === range
                  ? 'bg-gradient-to-r from-primary to-accent'
                  : ''
              }
            >
              {range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : 'All Time'}
            </Button>
          ))}
        </motion.div>

        {/* Key Metrics */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Lessons Completed</p>
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-display font-bold">{analytics.overview.totalLessonsCompleted}</p>
                <div className="flex items-center gap-1 text-xs text-emerald-500">
                  <TrendingUp className="w-3 h-3" />
                  +2 this week
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                  <LineChart className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-3xl font-display font-bold">{analytics.overview.averageAccuracy}%</p>
                <div className="flex items-center gap-1 text-xs text-emerald-500">
                  <TrendingUp className="w-3 h-3" />
                  +5% from last week
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Total XP</p>
                  <PieChart className="w-5 h-5 text-accent" />
                </div>
                <p className="text-3xl font-display font-bold">{analytics.overview.totalXpEarned}</p>
                <div className="flex items-center gap-1 text-xs text-emerald-500">
                  <TrendingUp className="w-3 h-3" />
                  +450 this week
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <span className="text-2xl">🔥</span>
                </div>
                <p className="text-3xl font-display font-bold">{analytics.overview.currentStreak}</p>
                <p className="text-xs text-muted-foreground">days in a row</p>
              </div>
            </Card>
          </motion.div>
        </motion.section>

        {/* Progress by Module */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-display font-bold">Progress by Module</h2>

          <motion.div variants={containerVariants} className="space-y-3">
            {analytics.progressByModule.map((module, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="p-4 bg-card/50 border-border/50">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{module.name}</h3>
                      <span className="text-sm font-medium text-primary">
                        {module.accuracy}% accuracy
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {module.completed}/{module.total} lessons completed
                        </span>
                        <span>{Math.round((module.completed / module.total) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-full rounded-full transition-all ${
                            module.accuracy >= 90
                              ? 'bg-emerald-500'
                              : 'bg-gradient-to-r from-primary to-accent'
                          }`}
                          style={{ width: `${(module.completed / module.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Weak Areas */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-display font-bold">Areas for Improvement</h2>

          <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-4">
            {analytics.weakAreas.map((area, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
                  <div className="space-y-3">
                    <h3 className="font-semibold">{area.area}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Accuracy</span>
                        <span className="font-medium text-yellow-600">{area.accuracy}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-full rounded-full bg-yellow-500 transition-all"
                          style={{ width: `${area.accuracy}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {area.attempts} practice attempts
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Daily Activity */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-display font-bold">Weekly Activity</h2>

          <Card className="p-6 bg-card/50 border-border/50">
            <div className="space-y-4">
              {analytics.dailyActivity.map((day, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="w-12 text-sm font-medium text-muted-foreground">{day.date}</div>
                  <div className="flex-1 mx-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded h-6">
                        <div
                          className="h-full rounded bg-gradient-to-r from-primary to-accent transition-all"
                          style={{ width: `${(day.xpEarned / 300) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-8 text-right">{day.xpEarned} XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.section>
      </main>
    </div>
  );
}
