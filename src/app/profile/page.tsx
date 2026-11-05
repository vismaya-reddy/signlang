'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProtectedLayout } from '@/components/protected-layout';
import { Navbar } from '@/components/navbar';
import { useAuth } from '@/hooks/use-auth';
import {
  Zap,
  ArrowLeft,
  Mail,
  User,
  Calendar,
  Trophy,
  Flame,
  BookOpen,
  Target,
  Clock,
  Edit2,
  LogOut,
} from 'lucide-react';

interface ProgressStats {
  totalLessonsCompleted: number;
  averageAccuracy: number;
  totalAttempts: number;
}

export default function ProfilePage() {
  const { user, profile, logout } = useAuth();
  const [stats, setStats] = useState<ProgressStats>({
    totalLessonsCompleted: 0,
    averageAccuracy: 0,
    totalAttempts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch('/api/progress/fetch');
        
        if (!response.ok) {
          throw new Error('Failed to fetch progress');
        }

        const data = await response.json();
        setStats(data.stats);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching progress:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user && profile) {
      fetchProgress();
    }
  }, [user, profile]);

  const handleLogout = async () => {
    await logout();
  };

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

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
        <Navbar />

        {/* Main content */}
        <main className="max-w-4xl mx-auto px-6 py-8 space-y-8 flex-1 w-full">
          {/* Profile Header */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <div className="flex items-start justify-between">
                  <div className="space-y-4 flex-1">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                      {profile?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <h2 className="text-3xl font-display font-bold">{profile?.name || 'User'}</h2>
                      <div className="flex items-center gap-2 text-muted-foreground mt-2">
                        <Mail className="w-4 h-4" />
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              variants={containerVariants}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {/* Level */}
              <motion.div variants={itemVariants}>
                <Card className="p-4 text-center">
                  <div className="text-3xl font-display font-bold text-primary mb-1">
                    {profile?.level || 1}
                  </div>
                  <p className="text-sm text-muted-foreground">Level</p>
                </Card>
              </motion.div>

              {/* XP */}
              <motion.div variants={itemVariants}>
                <Card className="p-4 text-center">
                  <div className="text-3xl font-display font-bold text-accent mb-1">
                    {profile?.xp || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Total XP</p>
                </Card>
              </motion.div>

              {/* Streak */}
              <motion.div variants={itemVariants}>
                <Card className="p-4 text-center">
                  <div className="text-3xl font-display font-bold text-secondary mb-1">
                    <Flame className="w-8 h-8 text-secondary mx-auto mb-1" />
                    {profile?.current_streak || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </Card>
              </motion.div>

              {/* Longest Streak */}
              <motion.div variants={itemVariants}>
                <Card className="p-4 text-center">
                  <div className="text-3xl font-display font-bold text-emerald-500 mb-1">
                    <Trophy className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                    {profile?.longest_streak || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Best Streak</p>
                </Card>
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Progress Stats */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-display font-bold">Learning Progress</h3>

            <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-4">
              {/* Lessons Completed */}
              <motion.div variants={itemVariants}>
                <Card className="p-6 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Lessons Completed</p>
                      <p className="text-3xl font-display font-bold">{stats.totalLessonsCompleted}</p>
                    </div>
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-xs text-muted-foreground">Keep practicing to complete more lessons</div>
                </Card>
              </motion.div>

              {/* Average Accuracy */}
              <motion.div variants={itemVariants}>
                <Card className="p-6 hover:border-accent/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Average Accuracy</p>
                      <p className="text-3xl font-display font-bold">{stats.averageAccuracy}%</p>
                    </div>
                    <Target className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-xs text-muted-foreground">Improve with more practice</div>
                </Card>
              </motion.div>

              {/* Total Attempts */}
              <motion.div variants={itemVariants}>
                <Card className="p-6 hover:border-secondary/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Attempts</p>
                      <p className="text-3xl font-display font-bold">{stats.totalAttempts}</p>
                    </div>
                    <Clock className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="text-xs text-muted-foreground">Track your dedication</div>
                </Card>
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Account Information */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-display font-bold">Account Information</h3>

            <motion.div variants={itemVariants}>
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{profile?.name || 'Not set'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user?.email || 'Not set'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">
                        {profile?.created_at
                          ? new Date(profile.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'Recently'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.section>

          {/* Danger Zone */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-display font-bold text-destructive">Account Settings</h3>

            <motion.div variants={itemVariants}>
              <Card className="p-6 border-destructive/20 bg-destructive/5">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-destructive mb-2">Logout</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sign out from your current session and return to the login page.
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.section>
        </main>
      </div>
    </ProtectedLayout>
  );
}
