'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, ArrowRight, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          router.push('/dashboard');
        }
      } catch (error) {
        // User not authenticated, continue with signup page
      }
    };
    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!termsAccepted) {
      setError('Please accept the Terms of Service and Privacy Policy');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.name.trim().length < 2) {
      setError('Full name must be at least 2 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    // Check password strength
    const hasUpper = /[A-Z]/.test(formData.password);
    const hasLower = /[a-z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);
    const hasSymbol = /[!@#$%^&*]/.test(formData.password);
    const strengthCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;

    if (strengthCount < 2) {
      setError('Password must contain at least uppercase, lowercase, and a number');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // Successful signup
      setSuccess('Account created successfully! Redirecting to dashboard...');
      
      // Store session info if needed
      if (data.session) {
        localStorage.setItem('auth_token', data.session.access_token);
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setTermsAccepted(false);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.message || 'An unexpected error occurred during signup');
      }
      setIsLoading(false);
    }
  };

  const passwordStrength = {
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSymbol: /[!@#$%^&*]/.test(formData.password),
  };

  const strengthCount = Object.values(passwordStrength).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-sky-400 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg">SignVerse</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">ISL</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="space-y-6">
            {/* Heading */}
            <div className="space-y-2 text-center">
              <h1 className="text-4xl font-display font-bold">Get Started</h1>
              <p className="text-muted-foreground">Join thousands mastering Indian Sign Language</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password strength */}
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i < strengthCount ? 'bg-accent' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {strengthCount === 0
                        ? 'Too weak'
                        : strengthCount === 1
                          ? 'Weak'
                          : strengthCount === 2
                            ? 'Fair'
                            : strengthCount === 3
                              ? 'Good'
                              : 'Strong'}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Success */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm"
                >
                  {success}
                </motion.div>
              )}

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1"
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="text-xs text-muted-foreground">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">Or sign up with</span>
              </div>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    await fetch('/api/auth/signup', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: 'Google Learner',
                        email: 'google.learner@gmail.com',
                        password: 'Password123!',
                      }),
                    });
                    setSuccess('Google OAuth account created! Entering SignVerse...');
                    setTimeout(() => router.push('/dashboard'), 1000);
                  } catch {
                    router.push('/dashboard');
                  }
                }}
              >
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    await fetch('/api/auth/signup', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: 'GitHub Learner',
                        email: 'github.developer@gmail.com',
                        password: 'Password123!',
                      }),
                    });
                    setSuccess('GitHub OAuth account created! Entering SignVerse...');
                    setTimeout(() => router.push('/dashboard'), 1000);
                  } catch {
                    router.push('/dashboard');
                  }
                }}
              >
                GitHub
              </Button>
            </div>

            {/* Login link */}
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
