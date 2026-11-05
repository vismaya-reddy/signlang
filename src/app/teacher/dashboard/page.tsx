'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  Users,
  BarChart3,
  Plus,
  BookOpen,
  TrendingUp,
  Settings,
} from 'lucide-react';
import { useState } from 'react';

const mockStudents = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', level: 3, xp: 1200, lessonsCompleted: 8 },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', level: 5, xp: 2450, lessonsCompleted: 15 },
  { id: '3', name: 'Carol White', email: 'carol@example.com', level: 2, xp: 850, lessonsCompleted: 5 },
  { id: '4', name: 'David Lee', email: 'david@example.com', level: 4, xp: 1900, lessonsCompleted: 12 },
];

export default function TeacherDashboard() {
  const [students] = useState(mockStudents);

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
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-display font-bold">Teacher Dashboard</h1>
          <Button size="sm" variant="outline">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Overview Cards */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-4 gap-4"
        >
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-display font-bold">{students.length}</p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Avg Level</p>
                <p className="text-3xl font-display font-bold">
                  {(students.reduce((sum, s) => sum + s.level, 0) / students.length).toFixed(1)}
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Lessons Assigned</p>
                <p className="text-3xl font-display font-bold">47</p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Class Avg Accuracy</p>
                <p className="text-3xl font-display font-bold">82%</p>
              </div>
            </Card>
          </motion.div>
        </motion.section>

        {/* Student Management */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold">Student Management</h2>
            <Button className="bg-gradient-to-r from-primary to-accent">
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>

          <Card className="overflow-hidden bg-card/50 border-border/50">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border/50">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold">Name</th>
                    <th className="text-left px-6 py-3 font-semibold">Email</th>
                    <th className="text-center px-6 py-3 font-semibold">Level</th>
                    <th className="text-center px-6 py-3 font-semibold">XP</th>
                    <th className="text-center px-6 py-3 font-semibold">Lessons</th>
                    <th className="text-right px-6 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{student.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{student.email}</td>
                      <td className="px-6 py-4 text-center font-semibold text-primary">{student.level}</td>
                      <td className="px-6 py-4 text-center">{student.xp}</td>
                      <td className="px-6 py-4 text-center">{student.lessonsCompleted}</td>
                      <td className="px-6 py-4 text-right">
                        <Button size="sm" variant="ghost">
                          View Progress
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-4"
        >
          <motion.div variants={itemVariants}>
            <Card className="p-6 hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold">Create Lesson</h3>
              </div>
              <p className="text-sm text-muted-foreground">Add new lessons to your curriculum</p>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6 hover:border-secondary/50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold">View Analytics</h3>
              </div>
              <p className="text-sm text-muted-foreground">Track class performance and trends</p>
            </Card>
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}
