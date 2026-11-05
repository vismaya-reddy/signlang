'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Volume2,
  ChevronRight,
  ChevronLeft,
  X,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Layers,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { HandSign3D } from '@/components/3d/HandSign3D';
import { ISL_ALPHABET, ISLAlphabetSign } from '@/lib/isl-data';

export default function AlphabetPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'vowels' | 'consonants' | 'two-handed' | 'one-handed'>('all');
  const [selectedLetter, setSelectedLetter] = useState<ISLAlphabetSign | null>(ISL_ALPHABET[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Filtered letters list
  const filteredLetters = useMemo(() => {
    return ISL_ALPHABET.filter((item) => {
      const hindi = item.hindiEquivalent || item.hindiChar || '';
      const stepsList = item.stepByStep || item.steps || [];
      const isVowelSign = item.isVowel ?? item.tags?.includes('Vowel');
      const isTwoHand = item.handType ? item.handType === 'two-handed' : item.isTwoHanded;

      const matchesSearch =
        item.letter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stepsList.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterType === 'vowels') return isVowelSign;
      if (filterType === 'consonants') return !isVowelSign;
      if (filterType === 'two-handed') return isTwoHand;
      if (filterType === 'one-handed') return !isTwoHand;
      return true;
    });
  }, [searchQuery, filterType]);

  const currentIndex = selectedLetter
    ? ISL_ALPHABET.findIndex((l) => l.letter === selectedLetter.letter)
    : -1;

  const handleNextLetter = () => {
    if (currentIndex >= 0 && currentIndex < ISL_ALPHABET.length - 1) {
      setSelectedLetter(ISL_ALPHABET[currentIndex + 1]);
    }
  };

  const handlePrevLetter = () => {
    if (currentIndex > 0) {
      setSelectedLetter(ISL_ALPHABET[currentIndex - 1]);
    }
  };

  const playPronunciation = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsPlayingAudio(true);
      const utterance = new SpeechSynthesisUtterance(`Letter ${text}`);
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
        {/* Header Breadcrumb & Title */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-200">SignVerse</Link>
            <span>/</span>
            <span className="text-sky-400 font-medium">Indian Sign Language (ISL)</span>
            <span>/</span>
            <span className="text-slate-200">Alphabet Curriculum</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span>ISL Alphabet Master</span>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300">
                  ISLRTC Standard
                </span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
                Master all 26 letters of Indian Sign Language. Unlike ASL, ISL uses a unique two-handed vowel contact system and bilateral coordination.
              </p>
            </div>

            <Link
              href="/practice"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 font-semibold text-xs text-white shadow-md shadow-indigo-600/25 transition-all self-start md:self-auto"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Take Alphabet Quiz (+150 XP)</span>
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
              placeholder="Search letter (e.g. A, M, क)..."
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

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {(
              [
                { id: 'all', label: 'All Letters (26)' },
                { id: 'vowels', label: 'Vowels A,E,I,O,U' },
                { id: 'two-handed', label: 'Two-Handed' },
                { id: 'one-handed', label: 'One-Handed' },
              ] as const
            ).map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterType(filter.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterType === filter.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Layout: Main Grid (Left) + Detail & 3D Viewer (Right on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Alphabet Grid (7 columns on Desktop) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filteredLetters.map((item) => {
                const isSelected = selectedLetter?.letter === item.letter;
                return (
                  <motion.button
                    key={item.letter}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedLetter(item)}
                    className={`relative p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-950/50'
                        : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl font-black font-display text-white tracking-tight">
                        {item.letter}
                      </span>
                      <span className="text-sm font-semibold text-sky-400 font-sans">
                        {item.hindiEquivalent || item.hindiChar}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          item.tags?.includes('Vowel') || item.isVowel
                            ? 'bg-purple-900/40 text-purple-300 border border-purple-800/40'
                            : 'bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        {item.tags?.includes('Vowel') || item.isVowel
                          ? 'Vowel'
                          : item.isTwoHanded
                            ? '2-Hand'
                            : '1-Hand'}
                      </span>

                      <span className="text-[10px] font-mono text-slate-500">
                        {item.movementType || (item.isTwoHanded ? 'Bilateral' : 'Unilateral')}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {filteredLetters.length === 0 && (
              <div className="py-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800 text-slate-400 space-y-2">
                <HelpCircle className="w-8 h-8 mx-auto text-slate-500" />
                <p className="text-sm">No letters match your query "{searchQuery}".</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                  }}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Letter Detail & Interactive 3D Viewer (5 columns on Desktop) */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            {selectedLetter ? (
              <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-2xl p-6 space-y-6 backdrop-blur-xl">
                {/* Header with Navigation */}
                <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-indigo-600/30">
                      {selectedLetter.letter}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                          Letter {selectedLetter.letter}
                        </h2>
                        <span className="text-lg font-semibold text-sky-400">
                          {selectedLetter.hindiEquivalent || selectedLetter.hindiChar}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="capitalize">
                          {selectedLetter.handType || (selectedLetter.isTwoHanded ? 'Two-handed' : 'One-handed')}
                        </span>
                        <span>·</span>
                        <span className="capitalize">
                          {selectedLetter.movementType || 'Bilateral'} motion
                        </span>
                        {(selectedLetter.isVowel || selectedLetter.tags?.includes('Vowel')) && (
                          <>
                            <span>·</span>
                            <span className="text-purple-400 font-medium">ISL Vowel Digit</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevLetter}
                      disabled={currentIndex <= 0}
                      className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700"
                      title="Previous letter"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextLetter}
                      disabled={currentIndex >= ISL_ALPHABET.length - 1}
                      className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700"
                      title="Next letter"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 3D Hand Visualizer */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-medium text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Interactive 3D Articulated Model
                    </span>
                    <button
                      onClick={() => playPronunciation(selectedLetter.letter)}
                      className="flex items-center gap-1 text-sky-400 hover:text-sky-300"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                      <span>Hear Name</span>
                    </button>
                  </div>
                  <HandSign3D currentSign={selectedLetter.letter} className="h-64" />
                </div>

                {/* Hand Position Specifications */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">
                      Dominant Hand
                    </span>
                    <p className="text-slate-200 font-medium leading-relaxed">
                      {selectedLetter.dominantHand}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400">
                      Non-Dominant Hand
                    </span>
                    <p className="text-slate-200 font-medium leading-relaxed">
                      {selectedLetter.nonDominantHand}
                    </p>
                  </div>
                </div>

                {/* Contact Point info */}
                {selectedLetter.contactPoint && (
                  <div className="px-3.5 py-2.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs flex items-center gap-2.5 text-indigo-200">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    <span>
                      <strong className="text-white">Contact Location:</strong>{' '}
                      {selectedLetter.contactPoint}
                    </span>
                  </div>
                )}

                {/* Step-by-Step Instructions */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Step-by-Step Execution
                  </h3>
                  <div className="space-y-2">
                    {(selectedLetter.stepByStep || selectedLetter.steps || []).map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-900/60 text-indigo-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips & Common Mistakes */}
                <div className="space-y-2 pt-2 border-t border-slate-800/60 text-xs">
                  {selectedLetter.tips && (
                    <div className="flex items-start gap-2 text-emerald-300 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/40">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-emerald-200">Pro Tip:</strong>{' '}
                        {selectedLetter.tips}
                      </span>
                    </div>
                  )}

                  {selectedLetter.commonMistakes && (
                    <div className="flex items-start gap-2 text-amber-300 bg-amber-950/20 p-2.5 rounded-lg border border-amber-900/40">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-amber-200">Common Mistake:</strong>{' '}
                        {selectedLetter.commonMistakes}
                      </span>
                    </div>
                  )}
                </div>

                {/* Verified Source Attribution */}
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800/50 flex items-center justify-between">
                  <span>Source: {selectedLetter.sourceReference || 'ISLRTC Official Corpus'}</span>
                  <Link
                    href={`/practice?letter=${selectedLetter.letter}`}
                    className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium"
                  >
                    <span>Practice this sign</span>
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
