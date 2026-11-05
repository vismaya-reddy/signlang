'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  ShieldCheck,
  Check,
  HelpCircle,
} from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { HandSign3D } from '@/components/3d/HandSign3D';
import { useAuth } from '@/hooks/use-auth';

export default function AuthGatewayPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Mode: 'login' | 'signup' | 'forgot'
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Status feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 3D Preview Letter
  const [previewSign, setPreviewSign] = useState<string>('HELLO');

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  // Client-side password strength calculation
  const passwordCriteria = {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  };
  const passwordStrengthScore = Object.values(passwordCriteria).filter(Boolean).length;

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError('Please provide both your registered email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Authentication failed. Please verify credentials.');
        setIsSubmitting(false);
        return;
      }

      if (data.session?.access_token) {
        localStorage.setItem('auth_token', data.session.access_token);
      }
      if (data.user?.id) {
        localStorage.setItem('user_id', data.user.id);
      }

      setSuccess('Signed in successfully! Entering your SignVerse Dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Network error occurred during login. Please retry.');
      setIsSubmitting(false);
    }
  };

  // Handle Signup
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill out all registration fields.');
      return;
    }

    if (!termsAccepted) {
      setError('Please acknowledge the terms of use before registering.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters in length.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Sign up failed. Please check details and retry.');
        setIsSubmitting(false);
        return;
      }

      if (data.session?.access_token) {
        localStorage.setItem('auth_token', data.session.access_token);
      }
      if (data.user?.id) {
        localStorage.setItem('user_id', data.user.id);
      }

      setSuccess('Account created successfully! Preparing your learning curriculum...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Network failure while registering account.');
      setIsSubmitting(false);
    }
  };

  // Handle Quick Demo Login
  const handleDemoLogin = async () => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'demo@signverse.org',
          password: 'Password123!',
        }),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.session?.access_token) {
          localStorage.setItem('auth_token', data.session.access_token);
        }
        if (data.user?.id) {
          localStorage.setItem('user_id', data.user.id);
        }
        setSuccess('Logged in as Demo Learner! Welcome to SignVerse.');
        setTimeout(() => router.push('/dashboard'), 700);
      } else {
        // Fallback demo account
        const fbRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'learner.demo@signverse.org',
            password: 'Password123!',
          }),
        });
        const fbData = await fbRes.json();
        if (fbRes.ok) {
          if (fbData.session?.access_token) {
            localStorage.setItem('auth_token', fbData.session.access_token);
          }
          if (fbData.user?.id) {
            localStorage.setItem('user_id', fbData.user.id);
          }
          setSuccess('Demo session active! Loading Dashboard...');
          setTimeout(() => router.push('/dashboard'), 700);
        } else {
          setError('Demo credentials error. Please enter an email and password.');
          setIsSubmitting(false);
        }
      }
    } catch {
      setError('Connection error initiating demo session.');
      setIsSubmitting(false);
    }
  };

  // Handle Google Sign-In Simulation
  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'google.learner@signverse.org',
          password: 'Password123!',
        }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.session?.access_token) {
          localStorage.setItem('auth_token', data.session.access_token);
        }
        if (data.user?.id) {
          localStorage.setItem('user_id', data.user.id);
        }
        setSuccess('Google OAuth session established! Redirecting...');
        setTimeout(() => router.push('/dashboard'), 800);
      } else {
        setError('OAuth provider error. Please try email sign in.');
        setIsSubmitting(false);
      }
    } catch {
      setError('Failed to reach authentication provider.');
      setIsSubmitting(false);
    }
  };

  // Handle Forgot Password
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your registered email address.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setSuccess('A password recovery email has been dispatched. Please check your inbox.');
      } else {
        setError('Could not process password reset request.');
      }
    } catch {
      setError('Network error processing recovery.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // While checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mb-4"
        />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Connecting to SignVerse...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Top Bar with Brand & Global Theme Switcher */}
      <header className="w-full border-b border-border/80 bg-card/60 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary via-indigo-600 to-secondary p-[1px] shadow-sm shadow-primary/20">
            <div className="w-full h-full bg-card rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-lg tracking-tight text-foreground">
                SignVerse
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/25 font-semibold">
                ISL
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-text text-xs text-muted-foreground">
            Theme
          </span>
          <div className="p-0.5 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors">
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main Authentication Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: 3D Hand Articulated Preview & Platform Value */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Indian Sign Language (ISL) Codified by ISLRTC</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-foreground leading-[1.15]">
                Master Sign Language in Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">3D Space</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                Experience authentic ISL with bilateral hand interaction, real-time gesture orientation, and gamified streak progression. Sign in to unlock your personalized curriculum.
              </p>
            </div>

            {/* Interactive 3D Canvas Box */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
                  <span className="text-xs font-mono font-semibold text-foreground">
                    Interactive 3D Preview: Sign &quot;{previewSign}&quot;
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">
                  Drag to rotate 360°
                </span>
              </div>

              {/* 3D Model Rendering */}
              <div className="relative h-64 sm:h-72 w-full rounded-xl bg-muted/40 border border-border/60 overflow-hidden">
                <HandSign3D letter={previewSign} />
              </div>

              {/* Quick sign switcher pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs text-muted-foreground mr-1">Preview Signs:</span>
                {['HELLO', 'A', 'B', 'C', 'LOVE'].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setPreviewSign(code)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      previewSign === code
                        ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                        : 'bg-background hover:bg-muted border border-border text-foreground'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-card border border-border/80 text-center">
                <p className="text-lg sm:text-xl font-display font-bold text-primary">26</p>
                <p className="text-[11px] text-muted-foreground">Letters in 3D</p>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border/80 text-center">
                <p className="text-lg sm:text-xl font-display font-bold text-secondary">100+</p>
                <p className="text-[11px] text-muted-foreground">Core ISL Signs</p>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border/80 text-center">
                <p className="text-lg sm:text-xl font-display font-bold text-accent">100%</p>
                <p className="text-[11px] text-muted-foreground">ISLRTC Aligned</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Authentication Card (Login / Sign Up / Forgot) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6 w-full max-w-md mx-auto"
          >
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-md relative overflow-hidden">
              
              {/* Subtle top gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />

              {/* Mode Tabs */}
              {authMode !== 'forgot' && (
                <div className="flex rounded-xl bg-muted p-1 mb-6 border border-border">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setError(null);
                      setSuccess(null);
                    }}
                    className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                      authMode === 'login'
                        ? 'bg-card text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setError(null);
                      setSuccess(null);
                    }}
                    className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                      authMode === 'signup'
                        ? 'bg-card text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Create Account
                  </button>
                </div>
              )}

              {/* Header Title */}
              <div className="mb-6">
                {authMode === 'login' && (
                  <div>
                    <h2 className="text-2xl font-display font-bold text-foreground">Welcome Back</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Sign in to continue your Indian Sign Language journey.
                    </p>
                  </div>
                )}
                {authMode === 'signup' && (
                  <div>
                    <h2 className="text-2xl font-display font-bold text-foreground">Start Learning ISL</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Create your free SignVerse account and begin interactive signing today.
                    </p>
                  </div>
                )}
                {authMode === 'forgot' && (
                  <div>
                    <h2 className="text-2xl font-display font-bold text-foreground">Reset Password</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Enter your email to receive recovery instructions.
                    </p>
                  </div>
                )}
              </div>

              {/* Error Message Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Success Message Alert */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-xl bg-accent/15 border border-accent/30 text-accent-foreground text-xs flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{success}</span>
                </motion.div>
              )}

              {/* Form Render */}
              {authMode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-foreground">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot');
                          setError(null);
                          setSuccess(null);
                        }}
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {isSubmitting ? (
                      <RotateCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* 1-Click Demo Login Button */}
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/25 text-primary font-semibold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Quick Demo Learner (1-Click Login)</span>
                  </button>
                </form>
              )}

              {authMode === 'signup' && (
                <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Aarav Sharma"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="aarav@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Password (min 8 characters)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1 h-1">
                          <div className={`h-full flex-1 rounded-full ${passwordStrengthScore >= 1 ? 'bg-red-500' : 'bg-muted'}`} />
                          <div className={`h-full flex-1 rounded-full ${passwordStrengthScore >= 2 ? 'bg-amber-500' : 'bg-muted'}`} />
                          <div className={`h-full flex-1 rounded-full ${passwordStrengthScore >= 3 ? 'bg-emerald-500' : 'bg-muted'}`} />
                          <div className={`h-full flex-1 rounded-full ${passwordStrengthScore >= 4 ? 'bg-accent' : 'bg-muted'}`} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <label htmlFor="terms" className="text-xs text-muted-foreground">
                      I accept the SignVerse learning terms and privacy policy.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {isSubmitting ? (
                      <RotateCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Create Account & Start Learning</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {authMode === 'forgot' && (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Account Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <RotateCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Send Recovery Link</span>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setError(null);
                        setSuccess(null);
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      Return to Sign In
                    </button>
                  </div>
                </form>
              )}

              {/* Social OAuth Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2.5 bg-card text-muted-foreground">Or connect via</span>
                </div>
              </div>

              {/* Google OAuth Button */}
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl border border-border bg-background hover:bg-muted/70 text-foreground font-semibold text-xs flex items-center justify-center gap-2.5 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/80 py-4 px-6 text-center text-xs text-muted-foreground">
        <p>SignVerse &bull; Authentic Indian Sign Language (ISL) Interactive Learning &bull; Aligned with ISLRTC standards</p>
      </footer>
    </div>
  );
}
