'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Volume2,
  Sparkles,
  ArrowRight,
  BookOpen,
  X,
  Dumbbell,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { HandSign3D } from '@/components/3d/HandSign3D';
import { ProtectedLayout } from '@/components/protected-layout';
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
    <ProtectedLayout>
      <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header Breadcrumb & Title */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <Link href="/dashboard" className="hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-secondary font-medium">Indian Sign Language (ISL)</span>
              <span>/</span>
              <span className="text-foreground">Vocabulary Corpus</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-foreground flex items-center gap-3">
                  <span>ISL Vocabulary Lexicon</span>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary">
                    {ISL_VOCABULARY.length} Signs Codified
                  </span>
                </h1>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
                  Explore essential words and conversational phrases codified under Indian Sign Language standards. Filter by topic, inspect bilateral gestures, and learn everyday communication.
                </p>
              </div>

              <Link
                href="/practice"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 font-semibold text-xs text-primary-foreground shadow-sm transition-all self-start md:self-auto"
              >
                <Dumbbell className="w-4 h-4" />
                <span>Practice Vocabulary Quiz</span>
              </Link>
            </div>
          </div>

          {/* Filter Controls & Search */}
          <div className="p-4 rounded-2xl bg-card border border-border shadow-2xs flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sign word or Hindi translation..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                      : 'bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted'
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
                          ? 'bg-primary/10 border-primary ring-2 ring-primary/30 shadow-md'
                          : 'bg-card border-border hover:border-primary/40 hover:bg-muted/40'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-foreground tracking-tight">{word.word || word.english}</h3>
                          <p className="text-xs font-semibold text-secondary">{word.hindiTranslation || word.hindi}</p>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                          {word.category}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {word.description}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{word.difficulty} &bull; {word.twoHanded ? '2-Handed' : '1-Handed'}</span>
                        <span className="text-primary font-medium flex items-center gap-1">
                          View 3D <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {filteredWords.length === 0 && (
                <div className="py-12 text-center rounded-2xl bg-card border border-border text-muted-foreground space-y-2">
                  <BookOpen className="w-8 h-8 mx-auto text-muted-foreground" />
                  <p className="text-sm">No signs found for &quot;{searchQuery}&quot;.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    Reset search filters
                  </button>
                </div>
              )}
            </div>

            {/* Selected Word Detail View (5 columns) */}
            <div className="lg:col-span-5 sticky top-24 space-y-4">
              {selectedWord ? (
                <div className="rounded-2xl bg-card border border-border shadow-md p-6 space-y-5">
                  {/* Header */}
                  <div className="flex items-start justify-between border-b border-border pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-foreground">{selectedWord.word || selectedWord.english}</h2>
                        <span className="text-lg font-semibold text-secondary">
                          {selectedWord.hindiTranslation || selectedWord.hindi}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="capitalize">{selectedWord.category}</span>
                        <span>&bull;</span>
                        <span className="capitalize">{selectedWord.difficulty}</span>
                        <span>&bull;</span>
                        <span>{selectedWord.twoHanded ? 'Two-handed sign' : 'Bilateral sign'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => playPronunciation(selectedWord.word || selectedWord.english)}
                      className="p-2 rounded-lg bg-muted border border-border text-primary hover:bg-muted/80 transition-colors"
                      title="Audio pronunciation"
                    >
                      <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                    </button>
                  </div>

                  {/* 3D Model Visualization for Selected Word */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium text-foreground flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                        3D Anatomical Articulation
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Drag to rotate 360°
                      </span>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-border bg-muted/40">
                      <HandSign3D
                        letter={
                          (() => {
                            const raw = (selectedWord.word || selectedWord.english || '').toUpperCase();
                            if (raw.includes('NAMASTE')) return 'NAMASTE';
                            if (raw.includes('THANK')) return 'THANK_YOU';
                            if (raw.includes('PLEASE')) return 'PLEASE';
                            if (raw.includes('WATER')) return 'WATER';
                            if (raw.includes('HELP')) return 'HELP';
                            if (raw.includes('YES')) return 'YES';
                            if (raw.includes('NO')) return 'NO';
                            if (raw.includes('LOVE')) return 'LOVE';
                            return raw[0] || 'A';
                          })()
                        }
                        className="h-56"
                      />
                    </div>
                  </div>

                  {/* Hand Position Description */}
                  <div className="p-4 rounded-xl bg-background border border-border space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-semibold">
                      Hand Positioning & Movement
                    </span>
                    <p className="text-xs text-foreground leading-relaxed">
                      {selectedWord.handPosition || selectedWord.handMovement}
                    </p>
                  </div>

                  {/* Step-by-Step Instructions */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                      Movement Steps
                    </span>
                    <div className="space-y-2">
                      {(selectedWord.stepInstructions || selectedWord.steps || []).map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 text-xs text-foreground bg-background p-2.5 rounded-lg border border-border"
                        >
                          <span className="w-5 h-5 rounded-full bg-primary/15 text-primary font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cultural / Context Note */}
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-foreground space-y-1">
                    <span className="font-semibold text-primary">Context & Usage:</span>
                    <p className="text-muted-foreground leading-relaxed">{selectedWord.description}</p>
                  </div>

                  {/* Practice Quick Action */}
                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      Standard: {selectedWord.sourceReference || selectedWord.attribution || 'ISLRTC Official'}
                    </span>
                    <Link
                      href={`/practice?word=${encodeURIComponent(selectedWord.word || selectedWord.english)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 font-semibold text-xs text-primary-foreground shadow-sm transition-all"
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
    </ProtectedLayout>
  );
}
