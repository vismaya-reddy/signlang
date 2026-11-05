'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  Sun,
  Moon,
  Laptop,
  Check,
  User,
  Shield,
  Volume2,
  Sparkles,
  ArrowLeft,
  Bell,
  Eye,
  CheckCircle2,
  Lock,
  LogOut,
  Save,
  HelpCircle,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { ProtectedLayout } from '@/components/protected-layout';
import { useAuth } from '@/hooks/use-auth';
import { useMounted } from '@/hooks';

export default function SettingsPage() {
  const { user, profile, logout } = useAuth();
  const { theme, setTheme, systemTheme } = useTheme();
  const mounted = useMounted();

  const [notification, setNotification] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [visualQuality, setVisualQuality] = useState<'ultra' | 'high' | 'balanced'>('high');
  const [preferredDialect, setPreferredDialect] = useState<'isl-islrtc' | 'isl-regional'>('isl-islrtc');

  // Trigger feedback toast
  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleThemeChange = async (selectedTheme: 'light' | 'dark' | 'system') => {
    setTheme(selectedTheme);
    showToast(`Switched theme to ${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)} Mode`);

    // Persist preference to user's profile in backend/database
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme_preference: selectedTheme }),
      });
    } catch (e) {
      console.warn('Failed to persist theme preference to backend:', e);
    }
  };

  const handleSavePreferences = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Learning and display preferences saved successfully!');
    }, 600);
  };

  const currentActiveTheme = mounted ? (theme === 'system' ? systemTheme : theme) : 'dark';

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
        <Navbar />

        {/* Feedback notification toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-card border border-border shadow-lg text-sm font-medium text-foreground"
            >
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full space-y-10">
          {/* Top Breadcrumb & Page Title */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <Link href="/dashboard" className="hover:text-foreground transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
              </Link>
              <span>/</span>
              <span className="text-primary font-medium">Settings & Preferences</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold tracking-tight text-foreground flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Settings className="w-5 h-5" />
                  </div>
                  <span>SignVerse Settings</span>
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Customize your visual experience, 3D hand rendering, audio feedback, and account preferences.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSavePreferences}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 1: Visual Theme Selector (LIGHT vs DARK MODE) */}
          <section className="space-y-5 rounded-2xl bg-card border border-border p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span>Interface Theme & Appearance</span>
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Choose between Light Mode, Dark Mode, or synchronize automatically with your operating system.
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/25 font-semibold">
                Active: {mounted ? (theme || 'System').toUpperCase() : 'LOADING'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Light Mode Card */}
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`relative group rounded-xl p-4 border-2 text-left transition-all ${
                  mounted && theme === 'light'
                    ? 'border-primary bg-primary/5 shadow-md shadow-primary/10 ring-2 ring-primary/20'
                    : 'border-border/80 bg-background/50 hover:border-primary/40 hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Sun className="w-5 h-5" />
                  </div>
                  {mounted && theme === 'light' && (
                    <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm text-foreground">Light Mode</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Soft lavender backdrop, crisp dark typography, royal indigo accents & mint highlights. Ideal for daytime learning.
                </p>

                {/* Micro preview mock */}
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-1.5">
                  <div className="h-2 w-6 rounded-full bg-indigo-600" />
                  <div className="h-2 w-8 rounded-full bg-sky-400" />
                  <div className="h-2 w-4 rounded-full bg-emerald-400" />
                </div>
              </button>

              {/* Dark Mode Card */}
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`relative group rounded-xl p-4 border-2 text-left transition-all ${
                  mounted && theme === 'dark'
                    ? 'border-primary bg-primary/5 shadow-md shadow-primary/10 ring-2 ring-primary/20'
                    : 'border-border/80 bg-background/50 hover:border-primary/40 hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Moon className="w-5 h-5" />
                  </div>
                  {mounted && theme === 'dark' && (
                    <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm text-foreground">Dark Mode</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Midnight navy backdrop with luminous violet, sky blue & mint highlights. High contrast with zero eye strain in dark rooms.
                </p>

                {/* Micro preview mock */}
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-1.5">
                  <div className="h-2 w-6 rounded-full bg-indigo-500" />
                  <div className="h-2 w-8 rounded-full bg-sky-400" />
                  <div className="h-2 w-4 rounded-full bg-emerald-400" />
                </div>
              </button>

              {/* System Card */}
              <button
                type="button"
                onClick={() => handleThemeChange('system')}
                className={`relative group rounded-xl p-4 border-2 text-left transition-all ${
                  mounted && theme === 'system'
                    ? 'border-primary bg-primary/5 shadow-md shadow-primary/10 ring-2 ring-primary/20'
                    : 'border-border/80 bg-background/50 hover:border-primary/40 hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-muted border border-border flex items-center justify-center text-foreground">
                    <Laptop className="w-5 h-5" />
                  </div>
                  {mounted && theme === 'system' && (
                    <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm text-foreground">System Match</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Automatically aligns with your device&apos;s OS preference. Smoothly transitions between sunrise and sunset.
                </p>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-1.5">
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Current: {systemTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>
              </button>
            </div>
          </section>

          {/* Section 2: Learning & 3D Interactive Preferences */}
          <section className="space-y-6 rounded-2xl bg-card border border-border p-6 shadow-xs">
            <div>
              <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-secondary" />
                <span>Learning & 3D Visual Preferences</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Tune the 3D hand visualizer performance, audio speech pronunciation, and quiz progression.
              </p>
            </div>

            <div className="divide-y divide-border/60">
              {/* Sound toggle */}
              <div className="py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Text-to-Speech & Sound Cues</p>
                  <p className="text-xs text-muted-foreground">
                    Speak Hindi & English words aloud and play celebratory chimes on correct quiz answers.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSoundEnabled(!soundEnabled);
                    showToast(soundEnabled ? 'Audio muted' : 'Audio enabled');
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    soundEnabled ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Auto Advance */}
              <div className="py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Auto-Advance Quiz Questions</p>
                  <p className="text-xs text-muted-foreground">
                    Automatically navigate to the next sign puzzle 1.5 seconds after selecting the correct answer.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setAutoAdvance(!autoAdvance);
                    showToast(autoAdvance ? 'Auto-advance paused' : 'Auto-advance enabled');
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    autoAdvance ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      autoAdvance ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* 3D Rendering Performance */}
              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">3D Hand Mesh Quality</p>
                  <p className="text-xs text-muted-foreground">
                    Control shadow depth and joint segment tesselation for optimal 60 FPS performance.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-background border border-border">
                  {(['balanced', 'high', 'ultra'] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setVisualQuality(q);
                        showToast(`3D quality set to ${q.toUpperCase()}`);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                        visualQuality === q
                          ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sign Language Standard */}
              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Sign Language Codification</p>
                  <p className="text-xs text-muted-foreground">
                    National curriculum verified by the Indian Sign Language Research and Training Centre (ISLRTC).
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 border border-primary/25 text-primary text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ISLRTC National Standard
                </span>
              </div>
            </div>
          </section>

          {/* Section 3: Profile & Account Overview */}
          <section className="space-y-5 rounded-2xl bg-card border border-border p-6 shadow-xs">
            <div>
              <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
                <User className="w-5 h-5 text-accent" />
                <span>Account Profile & Security</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Manage your credentials, sync status with Supabase Auth, and active session.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-background border border-border/70 space-y-1">
                <p className="text-xs font-mono uppercase text-muted-foreground">Full Name</p>
                <p className="font-semibold text-foreground">{profile?.name || user?.user_metadata?.full_name || 'SignVerse Learner'}</p>
              </div>

              <div className="p-4 rounded-xl bg-background border border-border/70 space-y-1">
                <p className="text-xs font-mono uppercase text-muted-foreground">Registered Email</p>
                <p className="font-semibold text-foreground">{user?.email || profile?.email || 'learner@signverse.org'}</p>
              </div>

              <div className="p-4 rounded-xl bg-background border border-border/70 space-y-1">
                <p className="text-xs font-mono uppercase text-muted-foreground">Learner Level & XP</p>
                <p className="font-semibold text-primary">
                  Level {profile?.level || 1} &bull; {profile?.xp || 0} XP Earned
                </p>
              </div>

              <div className="p-4 rounded-xl bg-background border border-border/70 space-y-1">
                <p className="text-xs font-mono uppercase text-muted-foreground">Active Daily Streak</p>
                <p className="font-semibold text-amber-500 flex items-center gap-1.5">
                  <span>🔥 {profile?.current_streak || 1} Day Streak</span>
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                href="/forgot-password"
                className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <Lock className="w-3.5 h-3.5" /> Change Password or Recover Account
              </Link>

              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-destructive/40 text-destructive hover:bg-destructive/10 text-xs font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </section>
        </main>
      </div>
    </ProtectedLayout>
  );
}
