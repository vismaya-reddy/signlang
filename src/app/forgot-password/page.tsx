'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, CheckCircle2, Sparkles, AlertCircle, RotateCw } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError('Could not process password reset request.');
      }
    } catch {
      setError('Network failure connecting to authentication service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/20 selection:text-primary">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-border/80 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">SignVerse</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/25 font-semibold">
            ISL
          </span>
        </Link>
        <div className="border border-border/80 rounded-lg p-0.5 bg-card">
          <ThemeSwitcher />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-3xl bg-card border border-border shadow-md space-y-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>

          {!submitted ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">Reset Your Password</h1>
                <p className="text-xs text-muted-foreground">
                  Enter your registered SignVerse email address and we will send you secure recovery instructions.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Account Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 font-semibold text-xs text-primary-foreground shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <RotateCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Send Recovery Link</span>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center mx-auto text-accent">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-foreground">Recovery Link Dispatched</h2>
                <p className="text-xs text-muted-foreground">
                  We have dispatched recovery instructions to <strong className="text-foreground">{email}</strong>. Please check your inbox.
                </p>
              </div>
              <Link
                href="/"
                className="inline-block px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm transition-all"
              >
                Return to Sign In
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      <footer className="p-4 text-center text-xs text-muted-foreground border-t border-border/80">
        SignVerse &bull; Secure Authentication Recovery
      </footer>
    </div>
  );
}
