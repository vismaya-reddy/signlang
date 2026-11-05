'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Zap,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
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
        }
      } catch {
        // Guest mode fallback
      }
    };
    checkAuth();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Alphabet A–Z', href: '/alphabet', icon: BookOpen },
    { name: 'Vocabulary', href: '/vocabulary', icon: Layers },
    { name: 'Practice & Quizzes', href: '/practice', icon: Dumbbell },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Admin Hub', href: '/admin', icon: ShieldAlert },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/login';
    } catch {
      window.location.href = '/login';
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B1021]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg'
          : 'bg-[#0B1021]/60 backdrop-blur-sm border-b border-slate-800/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Zone: Brand Identity */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-[1px] shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
            <div className="w-full h-full bg-[#0B1021] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-sky-300 transition-colors">
                SignVerse
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-sky-950/80 text-sky-400 border border-sky-800/50">
                ISL
              </span>
            </div>
          </div>
        </Link>

        {/* Center Zone: Main Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Zone: Profile / Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-xs font-semibold text-white">
                  {(user.name || user.email || 'U')[0].toUpperCase()}
                </div>
                <span className="text-xs font-medium text-slate-200 max-w-[120px] truncate">
                  {user.name || user.email.split('@')[0]}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-900/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-xs font-semibold text-white shadow-sm shadow-indigo-500/25 transition-all"
              >
                Start Learning
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0B1021] border-b border-slate-800 px-4 pt-2 pb-6 space-y-3"
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
                        ? 'bg-indigo-600/20 text-indigo-300'
                        : 'text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
              {user ? (
                <div className="flex items-center justify-between">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm text-slate-200"
                  >
                    <User className="w-4 h-4 text-sky-400" />
                    <span>Profile ({user.name || user.email})</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-red-400 hover:underline flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center rounded-lg border border-slate-700 text-sm font-medium text-slate-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-sm"
                  >
                    Get Started
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
