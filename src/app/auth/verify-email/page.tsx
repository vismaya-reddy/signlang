'use client';

import Link from 'next/link';
import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, ArrowRight, CheckCircle2, Clock, Mail, AlertCircle } from 'lucide-react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
    setIsLoading(false);
  }, [searchParams]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    if (!email) {
      setError('Email address is required');
      return;
    }

    setResendLoading(true);
    setError('');
    setResendSuccess(false);

    try {
      // In a real implementation, this would call a resend verification email endpoint
      // const response = await fetch('/api/auth/resend-verification', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      // For now, simulate the process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setResendSuccess(true);
      setCountdown(60);

      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  const handleContinueToLogin = () => {
    router.push(`/login?email=${encodeURIComponent(email)}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background/95">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
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
          <div className="space-y-8">
            {/* Icon */}
            <div className="flex justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <Mail className="w-8 h-8 text-primary" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="space-y-4 text-center">
              <h1 className="text-3xl font-display font-bold">Verify Your Email</h1>
              <p className="text-muted-foreground">
                We've sent a verification link to <span className="font-semibold text-foreground">{email}</span>
              </p>
            </div>

            {/* Steps */}
            <Card className="p-6 bg-muted/30 border-border/50">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Check your email</p>
                    <p className="text-sm text-muted-foreground">Look for our verification email</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Click the link</p>
                    <p className="text-sm text-muted-foreground">Click the verification link in the email</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Start learning</p>
                    <p className="text-sm text-muted-foreground">Your account will be ready to use</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex gap-2"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Success */}
            {resendSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm flex gap-2"
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Verification email sent! Check your inbox.</span>
              </motion.div>
            )}

            {/* Resend Button */}
            <Button
              onClick={handleResendEmail}
              disabled={resendLoading || countdown > 0}
              variant="outline"
              className="w-full"
            >
              {countdown > 0 ? (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Resend in {countdown}s
                </>
              ) : (
                <>
                  {resendLoading ? 'Sending...' : 'Didn\'t receive? Resend email'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>

            {/* Continue Button */}
            <Button
              onClick={handleContinueToLogin}
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              Back to Login
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            {/* Help */}
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>Having trouble? Check your spam folder or</p>
              <Link href="/support" className="text-primary hover:underline font-medium">
                contact support
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background/95">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
          />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
