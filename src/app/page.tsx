'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Layers,
  Dumbbell,
  Award,
  Users,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Eye,
  Zap,
  Globe2,
  HelpCircle,
  Play,
  RotateCw,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { HeroCanvas3D } from '@/components/3d/HeroCanvas3D';
import { HandSign3D } from '@/components/3d/HandSign3D';
import heroVisual from '@/assets/images/hero_sign_language_3d_1793897521552.jpg';
import classroomVisual from '@/assets/images/isl_community_learning_1793897522362.jpg';
import trackingVisual from '@/assets/images/interactive_gesture_preview_1793897522911.jpg';

export default function Home() {
  const [activeSignDemo, setActiveSignDemo] = useState<string>('A');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const signButtons = [
    { code: 'A', label: 'Vowel A (Thumb Touch)' },
    { code: 'B', label: 'Letter B (Two Loops)' },
    { code: 'C', label: 'Letter C (Curved Arc)' },
    { code: 'D', label: 'Letter D (Index Touch)' },
    { code: 'E', label: 'Vowel E (Index Tip)' },
    { code: 'HELLO', label: 'Greeting (Namaste / Wave)' },
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Authentic Indian Sign Language (ISL)',
      desc: 'Accurately codified following ISLRTC standards. Master the unique two-handed bilateral movements and the 5-finger vowel contact system.',
      tag: 'ISLRTC Standard',
    },
    {
      icon: Eye,
      title: 'Interactive 3D Articulated Anatomy',
      desc: 'Inspect finger bends, palm orientations, and contact points from any angle in full 3D space with zero camera occlusion.',
      tag: 'Three.js Spatial Engine',
    },
    {
      icon: Dumbbell,
      title: 'Adaptive Quizzes & Biometric Feedback',
      desc: 'Test your recognition with instant feedback, streak multipliers, and leveled XP progression directly synced to your profile.',
      tag: 'Gamified Mastery',
    },
    {
      icon: Layers,
      title: 'Comprehensive Curated Lexicon',
      desc: 'From essential greetings to emergency health signs and numbered values, organized with step-by-step hand posture breakdowns.',
      tag: '100+ Core Signs',
    },
  ];

  const stats = [
    { value: '26', label: 'ISL Letters A–Z with 3D Models' },
    { value: '100+', label: 'Verified Vocabulary Signs' },
    { value: '98.6%', label: 'Anatomical Precision' },
    { value: '100%', label: 'ISLRTC Standard Aligned' },
  ];

  const faqs = [
    {
      q: 'Why does SignVerse focus primarily on Indian Sign Language (ISL)?',
      a: 'India is home to over 18 million Deaf and hard-of-hearing individuals. Unlike American Sign Language (ASL) which is predominantly one-handed, ISL utilizes a rich, two-handed alphabet and distinct cultural gestures codified by ISLRTC. SignVerse is tailored to make authentic ISL accessible worldwide.',
    },
    {
      q: 'How does the 3D hand visualizer help me learn better?',
      a: 'Flat 2D photos often fail to convey depth, thumb placement, or knuckle bends. Our interactive 3D engine lets you spin the hand 360°, inspect top and side views, and clearly observe where the dominant index touches the non-dominant hand for vowels.',
    },
    {
      q: 'Do I need a VR headset or special camera?',
      a: 'Not at all. SignVerse runs entirely inside your modern web browser on desktop, tablet, and mobile. The 3D models and quiz challenges are optimized for smooth 60 FPS performance without heavy hardware.',
    },
    {
      q: 'Can I track my progress and earn certificates?',
      a: 'Yes! Every quiz answered, letter mastered, and daily practice streak awards XP to your SignVerse profile. Track your mastery level, unlock achievement badges, and climb the learner leaderboard.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#080C1A] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
        {/* 3D Ambient Kinetic Constellation Canvas */}
        <HeroCanvas3D />

        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-sky-500/20 rounded-full blur-[128px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Attribution pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span className="text-xs font-mono font-medium text-slate-300">
                Official Indian Sign Language (ISL) Standard
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-[1.1]">
              Master Sign Language in{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-teal-300 bg-clip-text text-transparent">
                True 3D Space
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              SignVerse bridges silent worlds. Explore authentic ISL with articulated 3D hand models, step-by-step bilateral mechanics, interactive quizzes, and real-time XP tracking.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/alphabet"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 flex items-center gap-2 group transition-all"
              >
                <span>Explore ISL Alphabet A–Z</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/practice"
                className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm backdrop-blur-sm flex items-center gap-2 transition-colors"
              >
                <Dumbbell className="w-4 h-4 text-sky-400" />
                <span>Take Practice Challenge</span>
              </Link>

              <Link
                href="/vocabulary"
                className="px-4 py-3.5 text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>View Vocabulary Lexicon</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Trust highlights */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>ISLRTC Codified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Two-Handed Bilateral Signs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>No Hardware Required</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual: 3D Render & Interactive Teaser */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-900/40 p-2 backdrop-blur-xl group">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950">
                <Image
                  src={heroVisual}
                  alt="SignVerse 3D Indian Sign Language Experience"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080C1A] via-transparent to-transparent opacity-80" />

                {/* Floating badge inside image */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400">
                      Real-time Spatial Kinematics
                    </span>
                    <h3 className="text-sm font-bold text-white">ISL Vowel A: Index to Thumb Contact</h3>
                  </div>
                  <Link
                    href="/alphabet"
                    className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-y border-slate-800/80 bg-slate-900/40 py-10 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black font-display text-white">
                {item.value}
              </div>
              <p className="text-xs sm:text-sm text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE 3D SANDBOX TRYOUT */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-semibold uppercase text-indigo-400 tracking-wider">
            Live 3D Inspection Sandbox
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Rotate, Inspect & Practice Any Sign
          </h2>
          <p className="text-sm text-slate-400">
            Click on any sample gesture below to command the 3D model. Observe thumb contacts, finger curl angles, and splay in real-time.
          </p>
        </div>

        {/* Demo Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {signButtons.map((btn) => (
            <button
              key={btn.code}
              onClick={() => setActiveSignDemo(btn.code)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeSignDemo === btn.code
                  ? 'bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Interactive 3D Canvas Box */}
        <div className="max-w-3xl mx-auto rounded-3xl p-2 bg-gradient-to-b from-indigo-500/20 to-sky-500/10 border border-slate-800 shadow-2xl">
          <HandSign3D currentSign={activeSignDemo} className="h-[420px]" />
        </div>

        <div className="text-center">
          <Link
            href="/alphabet"
            className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300"
          >
            <span>See all 26 letters with bilateral step instructions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-semibold uppercase text-sky-400 tracking-wider">
            Engineered for Accessibility & Clarity
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why SignVerse Stands Apart
          </h2>
          <p className="text-sm text-slate-400">
            Standard video lessons cannot be rotated or viewed from anatomical angles. SignVerse brings true spatial 3D learning and instant feedback together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all space-y-4 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{feat.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* BIOMETRIC TRACKING & CLASSROOM SHOWCASE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono font-semibold uppercase text-indigo-400 tracking-wider">
              Community & Inclusive Education
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Designed with & for Indian Schools, Universities, and Deaf Communities
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Sign language is a constitutional right to communication. We collaborate with deaf educators across India to ensure every regional sign nuance, handshape, and facial expression aligns with authentic linguistic culture.
            </p>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span>Standardized ISLRTC (Indian Sign Language Research & Training Centre) reference corpus.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span>Bilingual English & Hindi equivalents for every sign word and letter.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span>Admin CMS for educators to add custom regional vocabulary and review media submissions.</span>
              </div>
            </div>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs text-white shadow-md shadow-indigo-600/30 transition-colors"
            >
              <span>Create Free Student Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              <Image
                src={classroomVisual}
                alt="Indian Sign Language classroom education"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-xs text-white font-medium">
                Classroom Inclusive Learning
              </div>
            </div>

            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              <Image
                src={trackingVisual}
                alt="Biometric joint tracking diagram"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-xs text-white font-medium">
                21 Landmark Joint Kinematics
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-semibold uppercase text-sky-400 tracking-wider">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-semibold text-sm sm:text-base text-white flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-90 text-indigo-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/80 via-indigo-950 to-slate-900 border border-indigo-700/60 p-8 sm:p-14 text-center space-y-6 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Speak with Your Hands?
            </h2>
            <p className="text-sm sm:text-base text-indigo-200 leading-relaxed">
              Join thousands of learners mastering Indian Sign Language today. No credit card required.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="px-6 py-3.5 rounded-xl bg-white text-indigo-950 hover:bg-slate-100 font-bold text-sm shadow-xl transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="/alphabet"
                className="px-6 py-3.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-900 text-white border border-indigo-700 font-semibold text-sm transition-colors"
              >
                Explore A–Z Curriculum
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                SV
              </div>
              <span className="font-bold text-base text-white">SignVerse</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                ISL
              </span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              SignVerse is an open educational platform engineered to accelerate Indian Sign Language (ISL) literacy through spatial 3D computing and gamified feedback.
            </p>
            <p className="text-[11px] text-slate-600">
              Attribution: Sign language conventions codified from official ISLRTC educational resources.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-slate-300">Curriculum</span>
            <ul className="space-y-1.5">
              <li><Link href="/alphabet" className="hover:text-slate-300">ISL Alphabet A–Z</Link></li>
              <li><Link href="/vocabulary" className="hover:text-slate-300">Core Vocabulary</Link></li>
              <li><Link href="/practice" className="hover:text-slate-300">Quizzes & Challenges</Link></li>
              <li><Link href="/modules/1" className="hover:text-slate-300">Guided Lessons</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-slate-300">Platform</span>
            <ul className="space-y-1.5">
              <li><Link href="/dashboard" className="hover:text-slate-300">Student Dashboard</Link></li>
              <li><Link href="/admin" className="hover:text-slate-300">Admin CMS</Link></li>
              <li><Link href="/chat" className="hover:text-slate-300">AI Tutor Guide</Link></li>
              <li><Link href="/profile" className="hover:text-slate-300">User Profile</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-slate-300">Account</span>
            <ul className="space-y-1.5">
              <li><Link href="/login" className="hover:text-slate-300">Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-slate-300">Create Account</Link></li>
              <li><Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600">
          <span>© {new Date().getFullYear()} SignVerse. All rights reserved.</span>
          <span>Crafted with Three.js, React & Tailwind CSS.</span>
        </div>
      </footer>
    </div>
  );
}
