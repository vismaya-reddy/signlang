'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Volume2,
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2,
  BookOpen,
  X,
  Dumbbell,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { ISL_VOCABULARY, ISLVocabWord } from '@/lib/isl-data';

export default function VocabularyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWord, setSelectedWord] = useState<ISLVocabWord | null>(ISL_VOCABULARY[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Extract categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    ISL_VOCABULARY.forEach((w) => set.add(w.category));
    return ['all', ...Array.from(set)];
  }, []);

  // Filter words
  const filteredWords = useMemo(() => {
    return ISL_VOCABULARY.filter((word) => {
      const label = word.word || word.english || '';
      const hindi = word.hindiTranslation || word.hindi || '';
      const desc = word.description || '';

      const matchesSearch =
        label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (selectedCategory !== 'all' && word.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      return true;
    });
  }, [searchQuery, selectedCategory]);

  const playPronunciation = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsPlayingAudio(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C1A] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Breadcrumbs & Title */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-200">SignVerse</Link>
            <span>/</span>
            <span className="text-sky-400 font-medium">Indian Sign Language (ISL)</span>
            <span>/</span>
            <span className="text-slate-200">Core Vocabulary</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span>ISL Vocabulary Lexicon</span>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-sky-950/80 border border-sky-700/60 text-sky-300">
                  {ISL_VOCABULARY.length} Signs
                </span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
                Explore essential words and conversational phrases codified under Indian Sign Language standards. Filter by topic, inspect bilateral gestures, and learn everyday communication.
              </p>
            </div>

            <Link
              href="/practice"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 font-semibold text-xs text-white shadow-md shadow-indigo-600/25 transition-all self-start md:self-auto"
            >
              <Dumbbell className="w-4 h-4" />
              <span>Practice Vocabulary Quiz</span>
            </Link>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sign word or Hindi translation..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content: Word Cards Grid & Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Words Grid (7 columns) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredWords.map((word) => {
                const isSelected = selectedWord?.id === word.id;
                return (
                  <motion.div
                    key={word.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedWord(word)}
                    className={`cursor-pointer p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/25 shadow-lg'
                        : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">{word.word || word.english}</h3>
                        <p className="text-xs font-medium text-sky-400">{word.hindiTranslation || word.hindi}</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {word.category}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {word.description}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{word.difficulty} · {word.twoHanded ? '2-Handed' : '1-Handed'}</span>
                      <span className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                        View Details <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredWords.length === 0 && (
              <div className="py-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800 text-slate-400 space-y-2">
                <BookOpen className="w-8 h-8 mx-auto text-slate-500" />
                <p className="text-sm">No signs found for "{searchQuery}".</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  Reset search filters
                </button>
              </div>
            )}
          </div>

          {/* Selected Word Detail View (5 columns) */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            {selectedWord ? (
              <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-2xl p-6 space-y-5 backdrop-blur-xl">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-white">{selectedWord.word || selectedWord.english}</h2>
                      <span className="text-lg font-semibold text-sky-400">
                        {selectedWord.hindiTranslation || selectedWord.hindi}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span className="capitalize">{selectedWord.category}</span>
                      <span>·</span>
                      <span className="capitalize">{selectedWord.difficulty}</span>
                      <span>·</span>
                      <span>{selectedWord.twoHanded ? 'Two-handed sign' : 'Bilateral sign'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => playPronunciation(selectedWord.word || selectedWord.english)}
                    className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-sky-400 hover:text-white"
                    title="Audio pronunciation"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                  </button>
                </div>

                {/* Hand Position Description */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">
                    Hand Positioning & Movement
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedWord.handPosition || selectedWord.handMovement}
                  </p>
                </div>

                {/* Step-by-Step Instructions */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Movement Steps
                  </span>
                  <div className="space-y-2">
                    {(selectedWord.stepInstructions || selectedWord.steps || []).map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60"
                      >
                        <span className="w-5 h-5 rounded-full bg-sky-950 text-sky-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cultural / Context Note */}
                <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/30 text-xs text-indigo-200 space-y-1">
                  <span className="font-semibold text-indigo-300">Context & Usage:</span>
                  <p className="text-slate-300 leading-relaxed">{selectedWord.description}</p>
                </div>

                {/* Practice Quick Action */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Standard: {selectedWord.sourceReference || selectedWord.attribution || 'ISLRTC Official'}
                  </span>
                  <Link
                    href={`/practice?word=${encodeURIComponent(selectedWord.word || selectedWord.english)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs text-white shadow-sm transition-colors"
                  >
                    <span>Practice this Sign</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
