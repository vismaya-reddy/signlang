'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, CheckCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080C1A] via-slate-950 to-[#0B1021] flex flex-col justify-between text-slate-100">
      {/* Header */}
      <div className="p-6 border-b border-slate-800/60">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-sky-400 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white">SignVerse</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
            ISL
          </span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6"
        >
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>

          {!submitted ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white tracking-tight">Reset Your Password</h1>
                <p className="text-xs text-slate-400">
                  Enter your registered SignVerse email address and we will send you secure recovery instructions.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Account Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-9 bg-slate-950 border-slate-800 text-sm"
                    />
                  </div>
                </div>

                {error && <p className="text-xs text-red-400">{error}</p>}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs"
                >
                  {loading ? 'Sending Instructions...' : 'Send Recovery Link'}
                </Button>
              </form>
            </div>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Check Your Inbox</h2>
                <p className="text-xs text-slate-400">
                  We sent password reset instructions to <span className="text-indigo-300 font-medium">{email}</span>. Follow the link to choose a new password.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-block px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                Return to Login
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      <div className="p-6 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} SignVerse.
      </div>
    </div>
  );
}
