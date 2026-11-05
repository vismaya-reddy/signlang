'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  Layers,
  Dumbbell,
  LayoutDashboard,
  ShieldAlert,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Check auth status
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data?.user) setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    checkAuth();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Alphabet A–Z', href: '/alphabet', icon: BookOpen },
    { name: 'Vocabulary', href: '/vocabulary', icon: Layers },
    { name: 'Practice & Quizzes', href: '/practice', icon: Dumbbell },
    { name: 'Admin Hub', href: '/admin', icon: ShieldAlert },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      setUser(null);
      router.push('/');
    } catch {
      router.push('/');
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-background/85 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-background/70 backdrop-blur-sm border-b border-border/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Zone: Brand Identity */}
        <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary via-indigo-600 to-secondary p-[1px] shadow-sm shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
            <div className="w-full h-full bg-card rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
                SignVerse
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/25 font-semibold">
                ISL
              </span>
            </div>
          </div>
        </Link>

        {/* Center Zone: Main Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary/15 text-primary border border-primary/30 font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Zone: Controls & Profile / Auth */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Theme switcher toggle */}
          <div className="p-0.5 rounded-lg border border-border/80 bg-card hover:bg-muted/60 transition-colors">
            <ThemeSwitcher />
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/settings"
                title="Application Settings & Themes"
                className={`p-2 rounded-lg border transition-colors ${
                  pathname === '/settings'
                    ? 'bg-primary/15 border-primary/30 text-primary'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/70'
                }`}
              >
                <Settings className="w-4 h-4" />
              </Link>

              <Link
                href="/profile"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-card border border-border hover:border-primary/40 transition-colors shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs font-semibold text-primary-foreground shadow-2xs">
                  {(user.name || user.email || 'U')[0].toUpperCase()}
                </div>
                <span className="text-xs font-medium text-foreground max-w-[110px] truncate">
                  {user.name || user.email?.split('@')[0]}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                title="Sign out of SignVerse"
                className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-xs font-semibold text-primary-foreground shadow-xs transition-all"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="border border-border/80 rounded-lg p-0.5 bg-card">
            <ThemeSwitcher />
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-b border-border px-4 pt-2 pb-6 space-y-3"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-primary/15 text-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  pathname === '/settings'
                    ? 'bg-primary/15 text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings & Themes</span>
              </Link>
            </div>

            <div className="pt-3 border-t border-border flex flex-col gap-2">
              {user ? (
                <div className="flex items-center justify-between">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm text-foreground font-medium"
                  >
                    <User className="w-4 h-4 text-primary" />
                    <span>Profile ({user.name || user.email})</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-destructive hover:underline flex items-center gap-1 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-xs"
                  >
                    Sign In to SignVerse
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
export default Navbar;
