'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Shield,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Upload,
  BookOpen,
  Layers,
  HelpCircle,
  Search,
  Filter,
  Save,
  X,
  FileVideo,
  Image as ImageIcon,
  AlertTriangle,
  Lock,
  Unlock,
  CheckCircle2,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { ProtectedLayout } from '@/components/protected-layout';
import { ISL_ALPHABET, ISL_VOCABULARY, ISL_QUIZ_QUESTIONS } from '@/lib/isl-data';

export default function AdminPage() {
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(true);
  const [activeTab, setActiveTab] = useState<'alphabet' | 'vocab' | 'quizzes' | 'media'>('alphabet');
  const [searchQuery, setSearchQuery] = useState('');

  // Editable in-memory copies for immediate interactivity
  const [letters, setLetters] = useState<any[]>([...ISL_ALPHABET]);
  const [vocabList, setVocabList] = useState<any[]>([...ISL_VOCABULARY]);
  const [quizzes, setQuizzes] = useState<any[]>([...ISL_QUIZ_QUESTIONS]);

  // Modal states
  const [editingLetter, setEditingLetter] = useState<any>(null);
  const [newVocabModal, setNewVocabModal] = useState(false);
  const [newWordData, setNewWordData] = useState({
    word: '',
    hindiTranslation: '',
    category: 'Daily & Home',
    difficulty: 'beginner',
    twoHanded: true,
    handPosition: '',
    stepInstructions: '',
    description: '',
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Delete handlers
  const handleDeleteVocab = (id: string) => {
    setVocabList((prev) => prev.filter((item) => item.id !== id));
    showToast('Vocabulary sign removed successfully.');
  };

  const handleDeleteQuiz = (id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
    showToast('Quiz question deleted.');
  };

  // Add vocab handler
  const handleCreateVocab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWordData.word) return;

    const newEntry = {
      id: `custom_${Date.now()}`,
      word: newWordData.word.trim(),
      hindiTranslation: newWordData.hindiTranslation.trim() || 'संकेत',
      category: newWordData.category,
      difficulty: newWordData.difficulty as any,
      twoHanded: newWordData.twoHanded,
      handPosition: newWordData.handPosition || 'Standard ISL configuration.',
      stepInstructions: newWordData.stepInstructions
        ? newWordData.stepInstructions.split('\n')
        : ['Execute hand movement facing viewer.'],
      description: newWordData.description || 'Community verified ISL sign.',
      sourceReference: 'SignVerse Admin verified',
    };

    setVocabList((prev) => [newEntry, ...prev]);
    setNewVocabModal(false);
    setNewWordData({
      word: '',
      hindiTranslation: '',
      category: 'Daily & Home',
      difficulty: 'beginner',
      twoHanded: true,
      handPosition: '',
      stepInstructions: '',
      description: '',
    });
    showToast(`Added sign "${newEntry.word}" to curriculum.`);
  };

  // Save letter edits
  const handleSaveLetter = () => {
    if (!editingLetter) return;
    setLetters((prev) =>
      prev.map((l) => (l.letter === editingLetter.letter ? editingLetter : l))
    );
    setEditingLetter(null);
    showToast(`Updated guidance for Letter ${editingLetter.letter}.`);
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
        <Navbar />

        {/* Toast Notification */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground text-xs font-semibold shadow-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            <span>{notification}</span>
          </div>
        )}

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                <span>/</span>
                <span className="text-secondary font-medium">Administration</span>
                <span>/</span>
                <span className="text-foreground">Content Management System</span>
              </div>
              <h1 className="text-3xl font-display font-extrabold tracking-tight text-foreground flex items-center gap-3">
                <Shield className="w-7 h-7 text-primary" />
                <span>SignVerse Curriculum Hub</span>
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Curate, review, and maintain verified Indian Sign Language (ISLRTC) materials. Manage alphabet specifications, custom vocabulary, media references, and evaluation quizzes.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAdminUnlocked(!isAdminUnlocked)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  isAdminUnlocked
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-500/10 border-amber-500/25 text-amber-700 dark:text-amber-300'
                }`}
              >
                {isAdminUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{isAdminUnlocked ? 'Admin Mode (Active)' : 'Locked'}</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl border border-border">
              {(
                [
                  { id: 'alphabet', label: 'ISL Alphabets (26)', icon: BookOpen },
                  { id: 'vocab', label: `Vocabulary (${vocabList.length})`, icon: Layers },
                  { id: 'quizzes', label: `Quizzes (${quizzes.length})`, icon: HelpCircle },
                  { id: 'media', label: 'Media & Uploads', icon: Upload },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-card text-foreground font-semibold shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {activeTab === 'vocab' && (
              <button
                onClick={() => setNewVocabModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 font-semibold text-xs text-primary-foreground shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Sign Word</span>
              </button>
            )}
          </div>

          {/* TAB 1: ALPHABET MANAGEMENT */}
          {activeTab === 'alphabet' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-card border border-border text-xs text-muted-foreground flex items-center justify-between shadow-2xs">
                <span>All 26 standard letters verified in alignment with ISLRTC guidelines. Click &quot;Edit&quot; to refine anatomical guidance or tips.</span>
                <span className="font-mono text-primary font-semibold">Total: 26 Signs</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {letters.map((letter) => (
                  <div
                    key={letter.letter}
                    className="p-4 rounded-xl bg-card border border-border shadow-2xs flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl font-bold text-primary">
                          {letter.letter}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-foreground">
                            Letter {letter.letter} ({letter.hindiEquivalent})
                          </h3>
                          <p className="text-[11px] text-muted-foreground capitalize">
                            {letter.handType} &bull; {letter.movementType}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setEditingLetter({ ...letter })}
                        className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit letter details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <p className="line-clamp-2">
                        <strong className="text-foreground">Dominant:</strong> {letter.dominantHand}
                      </p>
                      {letter.contactPoint && (
                        <p className="text-secondary text-[11px] font-medium">Contact: {letter.contactPoint}</p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border text-[10px] text-muted-foreground flex items-center justify-between">
                      <span>{letter.sourceReference}</span>
                      <span className="text-accent font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: VOCABULARY MANAGEMENT */}
          {activeTab === 'vocab' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vocabList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-card border border-border shadow-2xs flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-foreground">{item.word}</h3>
                          <span className="text-xs text-secondary font-medium">
                            ({item.hindiTranslation})
                          </span>
                        </div>
                        <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                          {item.category} &bull; {item.difficulty}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteVocab(item.id)}
                        className="p-1.5 rounded-lg bg-muted text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete sign"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">{item.handPosition}</p>

                    <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{item.sourceReference}</span>
                      <span>{item.twoHanded ? '2-Handed' : '1-Handed'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: QUIZZES MANAGEMENT */}
          {activeTab === 'quizzes' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzes.map((quiz, qIdx) => (
                  <div
                    key={quiz.id}
                    className="p-4 rounded-xl bg-card border border-border shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/25 font-semibold">
                        Q{qIdx + 1} &bull; {quiz.category.toUpperCase()} &bull; +{quiz.points} XP
                      </span>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="font-semibold text-sm text-foreground">{quiz.question}</h3>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {quiz.options.map((opt: string, oIdx: number) => {
                        const isCorrect = oIdx === quiz.correctAnswer || opt === quiz.correctAnswer;
                        return (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-lg border text-xs ${
                              isCorrect
                                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-300 font-semibold'
                                : 'bg-background border-border text-muted-foreground'
                            }`}
                          >
                            {opt} {isCorrect && '✓'}
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-[11px] text-muted-foreground italic">{quiz.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA & UPLOAD WORKFLOW */}
          {activeTab === 'media' && (
            <div className="p-8 rounded-2xl bg-card border border-border shadow-xs space-y-6 max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
                <Upload className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">Upload Educational ISL Media</h2>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Upload verified high-resolution videos or diagrams for SignVerse. Media files are automatically encoded and stored under secure signed URLs.
                </p>
              </div>

              <div className="p-6 border-2 border-dashed border-border rounded-xl bg-background hover:border-primary/50 transition-colors cursor-pointer">
                <div className="space-y-3">
                  <FileVideo className="w-10 h-10 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Drag and drop sign demonstration clip (MP4, WebM)
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">Up to 60 FPS, max 50MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Demo media uploaded and queued for verification.')}
                    className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-xs font-semibold text-primary-foreground shadow-sm transition-all"
                  >
                    Select File from Computer
                  </button>
                </div>
              </div>

              <div className="text-left text-xs text-muted-foreground p-4 rounded-xl bg-background border border-border space-y-1">
                <span className="font-semibold text-foreground">Quality Guidelines:</span>
                <p>&bull; Plain monochrome neutral background.</p>
                <p>&bull; Signer&apos;s face and hands completely in frame.</p>
                <p>&bull; Follow official ISLRTC Indian Sign Language dictionary motions.</p>
              </div>
            </div>
          )}
        </main>

        {/* EDIT LETTER MODAL */}
        {editingLetter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-lg font-bold text-foreground">
                  Edit Letter {editingLetter.letter} ({editingLetter.hindiEquivalent})
                </h2>
                <button
                  onClick={() => setEditingLetter(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Dominant Hand Position</label>
                  <textarea
                    value={editingLetter.dominantHand}
                    onChange={(e) =>
                      setEditingLetter({ ...editingLetter, dominantHand: e.target.value })
                    }
                    rows={2}
                    className="w-full p-2.5 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Non-Dominant Hand Position</label>
                  <textarea
                    value={editingLetter.nonDominantHand}
                    onChange={(e) =>
                      setEditingLetter({ ...editingLetter, nonDominantHand: e.target.value })
                    }
                    rows={2}
                    className="w-full p-2.5 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Contact Point / Location</label>
                  <input
                    type="text"
                    value={editingLetter.contactPoint || ''}
                    onChange={(e) =>
                      setEditingLetter({ ...editingLetter, contactPoint: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Pro Tip</label>
                  <input
                    type="text"
                    value={editingLetter.tips || ''}
                    onChange={(e) =>
                      setEditingLetter({ ...editingLetter, tips: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingLetter(null)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveLetter}
                  className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CREATE VOCAB MODAL */}
        {newVocabModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-lg font-bold text-foreground">Add New Sign Word</h2>
                <button
                  onClick={() => setNewVocabModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateVocab} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground mb-1 font-medium">English Word</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Namaste, Water"
                      value={newWordData.word}
                      onChange={(e) => setNewWordData({ ...newWordData, word: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 font-medium">Hindi Translation</label>
                    <input
                      type="text"
                      placeholder="e.g. नमस्ते, पानी"
                      value={newWordData.hindiTranslation}
                      onChange={(e) =>
                        setNewWordData({ ...newWordData, hindiTranslation: e.target.value })
                      }
                      className="w-full p-2.5 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground mb-1 font-medium">Category</label>
                    <select
                      value={newWordData.category}
                      onChange={(e) => setNewWordData({ ...newWordData, category: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="Daily & Home">Daily & Home</option>
                      <option value="Greetings">Greetings</option>
                      <option value="Family">Family</option>
                      <option value="Emergency & Health">Emergency & Health</option>
                      <option value="Questions & Time">Questions & Time</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1 font-medium">Difficulty</label>
                    <select
                      value={newWordData.difficulty}
                      onChange={(e) => setNewWordData({ ...newWordData, difficulty: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Hand Positioning & Motion</label>
                  <textarea
                    value={newWordData.handPosition}
                    onChange={(e) =>
                      setNewWordData({ ...newWordData, handPosition: e.target.value })
                    }
                    placeholder="Describe palm orientation and finger articulation..."
                    rows={2}
                    className="w-full p-2.5 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Context / Description</label>
                  <input
                    type="text"
                    value={newWordData.description}
                    onChange={(e) =>
                      setNewWordData({ ...newWordData, description: e.target.value })
                    }
                    placeholder="Context of usage in daily communication"
                    className="w-full p-2.5 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setNewVocabModal(false)}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm"
                  >
                    Add Word to Lexicon
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
