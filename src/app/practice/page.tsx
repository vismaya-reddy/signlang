'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProtectedLayout } from '@/components/protected-layout';
import { useLessons, type FilterType } from '@/hooks/use-lessons';
import {
  ArrowLeft,
  BookOpen,
  AlertCircle,
  Loader,
  LogOut,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { LessonMediaDisplay } from '@/components/lesson-media-display';
import { ISLQuizModule } from '@/components/isl-quiz-module';
import { Navbar } from '@/components/navbar';
import { Sparkles, Layers, Award, GraduationCap } from 'lucide-react';

export default function PracticePage() {
  const { user, logout } = useAuth();
  const { lessons, filteredLessons, loading, error, activeFilter, setActiveFilter, counts } =
    useLessons();

  // Handle filter button clicks
  const handleFilterClick = useCallback((filter: FilterType) => {
    console.log(`🔘 Filter button clicked: ${filter}`);
    setActiveFilter(filter);
  }, [setActiveFilter]);

  const [selectedLesson, setSelectedLesson] = useState<typeof lessons[0] | null>(null);
  const [practiceTab, setPracticeTab] = useState<'quiz' | 'catalog'>('quiz');

  const handleStartPractice = (lessonId: string, title: string) => {
    console.log(`▶️ Start practice clicked: ${title} (${lessonId})`);
    // Find the lesson and show details
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      setSelectedLesson(lesson);
    }
  };

  const handleCloseModal = () => {
    setSelectedLesson(null);
  };

  // Skeleton loading component
  const LessonSkeleton = () => (
    <Card className="h-full bg-muted animate-pulse overflow-hidden">
      <div className="aspect-square bg-muted-foreground/20" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
        <div className="h-9 bg-muted-foreground/20 rounded" />
      </div>
    </Card>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  console.log('📊 Current state:', {
    activeFilter,
    totalLessons: lessons.length,
    filteredCount: filteredLessons.length,
    counts,
    loading,
    error,
  });

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
        <Navbar />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Page Header */}
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-display font-bold">SignVerse Practice Center</h1>
                  <p className="text-muted-foreground mt-1">
                    Test your Indian Sign Language recognition, earn XP, and master gestures
                  </p>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-2 p-1 bg-muted/60 rounded-xl border border-border self-start md:self-auto">
                <Button
                  size="sm"
                  variant={practiceTab === 'quiz' ? 'default' : 'ghost'}
                  onClick={() => setPracticeTab('quiz')}
                  className={practiceTab === 'quiz' ? 'bg-indigo-600 text-white' : ''}
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  ISL Quiz & Challenges
                </Button>
                <Button
                  size="sm"
                  variant={practiceTab === 'catalog' ? 'default' : 'ghost'}
                  onClick={() => setPracticeTab('catalog')}
                  className={practiceTab === 'catalog' ? 'bg-indigo-600 text-white' : ''}
                >
                  <Layers className="w-4 h-4 mr-1.5" />
                  Lesson Catalog
                </Button>
              </div>
            </div>

            {/* Quick links banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <Link
                href="/alphabet"
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-950 flex items-center justify-center text-indigo-400 font-bold text-sm">
                    A–Z
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300">
                      ISL Alphabet Master
                    </h3>
                    <p className="text-xs text-slate-400">26 Letters with 3D Anatomical Models</p>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 rotate-180 text-slate-500 group-hover:text-indigo-400" />
              </Link>

              <Link
                href="/vocabulary"
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/50 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-950 flex items-center justify-center text-sky-400 font-bold text-sm">
                    ISL
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-sky-300">
                      Core Vocabulary Lexicon
                    </h3>
                    <p className="text-xs text-slate-400">Greetings, Family, Daily & Emergency</p>
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 rotate-180 text-slate-500 group-hover:text-sky-400" />
              </Link>
            </div>

            {/* If Quiz Tab is active, render ISLQuizModule and skip filter buttons */}
            {practiceTab === 'quiz' ? (
              <ISLQuizModule />
            ) : (
              /* Filter Buttons for Lesson Catalog */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-3"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => handleFilterClick('all')}
                    className={`px-6 py-2 font-medium transition-all duration-300 ${
                      activeFilter === 'all'
                        ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    All Lessons
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20">
                      {counts.all}
                    </span>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => handleFilterClick('alphabet')}
                    className={`px-6 py-2 font-medium transition-all duration-300 ${
                      activeFilter === 'alphabet'
                        ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    🔤 Alphabets
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20">
                      {counts.alphabet}
                    </span>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => handleFilterClick('number')}
                    className={`px-6 py-2 font-medium transition-all duration-300 ${
                      activeFilter === 'number'
                        ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    🔢 Numbers
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20">
                      {counts.number}
                    </span>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => handleFilterClick('word')}
                    className={`px-6 py-2 font-medium transition-all duration-300 ${
                      activeFilter === 'word'
                        ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    📝 Words
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20">
                      {counts.word}
                    </span>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </motion.section>

          {/* Error State */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <div>
                <p className="font-semibold text-destructive">Failed to load lessons</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </motion.div>
          )}

          {practiceTab === 'catalog' && (
            <>
              {/* Loading State */}
              {loading ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {[...Array(10)].map((_, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <LessonSkeleton />
                </motion.div>
              ))}
            </motion.div>
          ) : filteredLessons.length > 0 ? (
            // Lessons Grid with Category Grouping
            <div className="space-y-12">
              {/* When viewing all lessons, group by category */}
              {activeFilter === 'all' ? (
                <>
                  {/* Alphabets Section */}
                  {counts.alphabet > 0 && (
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="mb-6">
                        <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                          <span className="text-3xl">🔤</span>
                          Alphabets
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Learn sign language alphabets (A-Z)
                        </p>
                      </div>
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                      >
                        {filteredLessons
                          .filter(l => l.type === 'alphabet')
                          .map((lesson) => (
                            <motion.div key={lesson.id} variants={itemVariants}>
                              <Card className="h-full hover:shadow-lg transition-shadow duration-300 group cursor-pointer overflow-hidden flex flex-col">
                                {/* Image Container */}
                                <div className="relative w-full aspect-square bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                                  {lesson.media_url ? (
                                    <Image
                                      src={lesson.media_url}
                                      alt={lesson.title}
                                      fill
                                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                      priority={false}
                                      loading="lazy"
                                      onError={(e) => {
                                        console.error('❌ Image load failed:', lesson.media_url);
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                      <span className="text-4xl font-bold text-muted-foreground">
                                        {lesson.title}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Title and Button */}
                                <div className="p-3 flex-1 flex flex-col justify-between">
                                  <h3 className="text-lg font-display font-bold text-center">
                                    {lesson.title}
                                  </h3>

                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartPractice(lesson.id, lesson.title);
                                    }}
                                    className="w-full mt-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                                    size="sm"
                                  >
                                    <Zap className="w-3 h-3 mr-1" />
                                    Learn
                                  </Button>
                                </div>
                              </Card>
                            </motion.div>
                          ))}
                      </motion.div>
                    </motion.section>
                  )}

                  {/* Numbers Section */}
                  {counts.number > 0 && (
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="mb-6">
                        <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                          <span className="text-3xl">🔢</span>
                          Numbers
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Learn sign language numbers (0-9)
                        </p>
                      </div>
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                      >
                        {filteredLessons
                          .filter(l => l.type === 'number')
                          .map((lesson) => (
                            <motion.div key={lesson.id} variants={itemVariants}>
                              <Card className="h-full hover:shadow-lg transition-shadow duration-300 group cursor-pointer overflow-hidden flex flex-col">
                                {/* Image Container */}
                                <div className="relative w-full aspect-square bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                                  {lesson.media_url ? (
                                    <Image
                                      src={lesson.media_url}
                                      alt={lesson.title}
                                      fill
                                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                      priority={false}
                                      loading="lazy"
                                      onError={(e) => {
                                        console.error('❌ Image load failed:', lesson.media_url);
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                      <span className="text-4xl font-bold text-muted-foreground">
                                        {lesson.title}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Title and Button */}
                                <div className="p-3 flex-1 flex flex-col justify-between">
                                  <h3 className="text-lg font-display font-bold text-center">
                                    {lesson.title}
                                  </h3>

                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartPractice(lesson.id, lesson.title);
                                    }}
                                    className="w-full mt-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                                    size="sm"
                                  >
                                    <Zap className="w-3 h-3 mr-1" />
                                    Learn
                                  </Button>
                                </div>
                              </Card>
                            </motion.div>
                          ))}
                      </motion.div>
                    </motion.section>
                  )}

                  {/* Words Section */}
                  {counts.word > 0 && (
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="mb-6">
                        <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                          <span className="text-3xl">📝</span>
                          Words
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Learn common sign language words and phrases
                        </p>
                      </div>
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                      >
                        {filteredLessons
                          .filter(l => l.type === 'word')
                          .map((lesson) => (
                            <motion.div key={lesson.id} variants={itemVariants}>
                              <Card className="h-full hover:shadow-lg transition-shadow duration-300 group cursor-pointer overflow-hidden flex flex-col">
                                {/* Image Container */}
                                <div className="relative w-full aspect-square bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                                  {lesson.media_url ? (
                                    <Image
                                      src={lesson.media_url}
                                      alt={lesson.title}
                                      fill
                                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                      priority={false}
                                      loading="lazy"
                                      onError={(e) => {
                                        console.error('❌ Image load failed:', lesson.media_url);
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                      <span className="text-4xl font-bold text-muted-foreground">
                                        {lesson.title}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Title and Button */}
                                <div className="p-3 flex-1 flex flex-col justify-between">
                                  <h3 className="text-lg font-display font-bold text-center">
                                    {lesson.title}
                                  </h3>

                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartPractice(lesson.id, lesson.title);
                                    }}
                                    className="w-full mt-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                                    size="sm"
                                  >
                                    <Zap className="w-3 h-3 mr-1" />
                                    Learn
                                  </Button>
                                </div>
                              </Card>
                            </motion.div>
                          ))}
                      </motion.div>
                    </motion.section>
                  )}
                </>
              ) : (
                /* Single category view */
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                >
                  {filteredLessons.map((lesson) => (
                    <motion.div key={lesson.id} variants={itemVariants}>
                      <Card className="h-full hover:shadow-lg transition-shadow duration-300 group cursor-pointer overflow-hidden flex flex-col">
                        {/* Image Container */}
                        <div className="relative w-full aspect-square bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                          {lesson.media_url ? (
                            <Image
                              src={lesson.media_url}
                              alt={lesson.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                              priority={false}
                              loading="lazy"
                              onError={(e) => {
                                console.error('❌ Image load failed:', lesson.media_url);
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <span className="text-4xl font-bold text-muted-foreground">
                                {lesson.title}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Title and Button */}
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <h3 className="text-lg font-display font-bold text-center">
                            {lesson.title}
                          </h3>

                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartPractice(lesson.id, lesson.title);
                            }}
                            className="w-full mt-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                            size="sm"
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            Learn
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          ) : (
            // Empty State
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="inline-block p-4 bg-muted rounded-full mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No lessons available</h3>
              <p className="text-muted-foreground mb-6">
                {activeFilter === 'all'
                  ? 'No lessons found. Check back soon!'
                  : `No ${activeFilter} lessons available right now.`}
              </p>
              {activeFilter !== 'all' && (
                <Button
                  onClick={() => handleFilterClick('all')}
                  variant="outline"
                >
                  View all lessons
                </Button>
              )}
            </motion.div>
          )}
        </>
      )}
    </main>

        {/* Lesson Detail Modal */}
        {selectedLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold">Learn: {selectedLesson.title}</h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-6">
                {/* Image Display */}
                <div className="relative w-full aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl overflow-hidden">
                  {selectedLesson.media_url ? (
                    <Image
                      src={selectedLesson.media_url}
                      alt={selectedLesson.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 500px"
                      priority={true}
                      onError={(e) => {
                        console.error('❌ Modal image load failed:', selectedLesson.media_url);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <span className="text-6xl font-bold text-muted-foreground">
                        {selectedLesson.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Lesson Info */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground uppercase">
                      Category
                    </label>
                    <p className="text-lg capitalize mt-1">
                      {selectedLesson.type === 'alphabet' && '🔤 Alphabet'}
                      {selectedLesson.type === 'number' && '🔢 Number'}
                      {selectedLesson.type === 'word' && '📝 Word'}
                      {!['alphabet', 'number', 'word'].includes(selectedLesson.type) && selectedLesson.type}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-muted-foreground uppercase">
                      Lesson ID
                    </label>
                    <p className="text-sm font-mono text-muted-foreground mt-1 truncate">
                      {selectedLesson.id}
                    </p>
                  </div>

                  {selectedLesson.created_at && (
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground uppercase">
                        Added
                      </label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(selectedLesson.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      console.log(`🚀 Starting practice for: ${selectedLesson.title}`);
                      // TODO: Navigate to practice page for this lesson
                      handleCloseModal();
                    }}
                    className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 py-6 text-lg"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Start Practice
                  </Button>

                  <Button
                    onClick={handleCloseModal}
                    variant="outline"
                    className="flex-1 py-6 text-lg"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </ProtectedLayout>
  );
}
