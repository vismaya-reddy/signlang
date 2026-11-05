'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
}
