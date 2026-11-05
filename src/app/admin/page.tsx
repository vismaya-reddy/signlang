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
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
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
    showToast(`Added sign for "${newEntry.word}" to curriculum.`);
  };

  // Save letter edits
  const handleSaveLetter = () => {
    if (!editingLetter) return;
    setLetters((prev) =>
      prev.map((l) => (l.letter === editingLetter.letter ? editingLetter : l))
    );
    setEditingLetter(null);
    showToast(`Updated ISL specifications for Letter ${editingLetter.letter}.`);
  };

  return (
    <div className="min-h-screen bg-[#080C1A] text-slate-100 flex flex-col">
      <Navbar />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-indigo-400">
          <CheckCircle className="w-4 h-4 text-emerald-300" />
          <span>{notification}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Link href="/" className="hover:text-slate-200">SignVerse</Link>
              <span>/</span>
              <span className="text-indigo-400 font-medium">Administration</span>
              <span>/</span>
              <span className="text-slate-200">Content Management System</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Shield className="w-7 h-7 text-indigo-400" />
              <span>SignVerse Content Management</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Curate, review, and maintain verified Indian Sign Language (ISLRTC) materials. Manage alphabet specifications, custom vocabulary, media references, and evaluation quizzes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminUnlocked(!isAdminUnlocked)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isAdminUnlocked
                  ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-700/60 text-amber-300'
              }`}
            >
              {isAdminUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isAdminUnlocked ? 'Admin Mode (Active)' : 'Locked'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
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
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
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
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs text-white shadow-md shadow-indigo-600/25"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Sign Word</span>
            </button>
          )}
        </div>

        {/* TAB 1: ALPHABET MANAGEMENT */}
        {activeTab === 'alphabet' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <span>All 26 standard letters verified in alignment with ISLRTC guidelines. Click "Edit" to refine anatomical guidance or tips.</span>
              <span className="font-mono text-indigo-400">Total: 26 Signs</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {letters.map((letter) => (
                <div
                  key={letter.letter}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-xl font-bold text-white">
                        {letter.letter}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">
                          Letter {letter.letter} ({letter.hindiEquivalent})
                        </h3>
                        <p className="text-[11px] text-slate-400 capitalize">
                          {letter.handType} · {letter.movementType}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setEditingLetter({ ...letter })}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                      title="Edit letter details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1">
                    <p className="line-clamp-2">
                      <strong className="text-slate-300">Dominant:</strong> {letter.dominantHand}
                    </p>
                    {letter.contactPoint && (
                      <p className="text-sky-400 text-[11px]">Contact: {letter.contactPoint}</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>{letter.sourceReference}</span>
                    <span className="text-emerald-400 flex items-center gap-1">
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
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-white">{item.word}</h3>
                        <span className="text-xs text-sky-400 font-medium">
                          ({item.hindiTranslation})
                        </span>
                      </div>
                      <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.category} · {item.difficulty}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteVocab(item.id)}
                      className="p-1.5 rounded-lg bg-slate-800/80 text-red-400 hover:bg-red-950/60 hover:text-red-200 transition-colors"
                      title="Delete sign"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{item.handPosition}</p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
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
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                      Q{qIdx + 1} · {quiz.category.toUpperCase()} · +{quiz.points} XP
                    </span>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-semibold text-sm text-white">{quiz.question}</h3>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {quiz.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-2 rounded-lg border text-xs ${
                          oIdx === quiz.correctAnswer
                            ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        {opt} {oIdx === quiz.correctAnswer && '✓'}
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 italic">{quiz.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MEDIA & UPLOAD WORKFLOW */}
        {activeTab === 'media' && (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6 max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-700 flex items-center justify-center mx-auto text-indigo-400">
              <Upload className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Upload Educational ISL Media</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Upload verified high-resolution videos or diagrams for SignVerse. Media files are automatically encoded and stored under secure signed URLs.
              </p>
            </div>

            <div className="p-6 border-2 border-dashed border-slate-700 rounded-xl bg-slate-950/50 hover:border-indigo-500 transition-colors cursor-pointer">
              <div className="space-y-3">
                <FileVideo className="w-10 h-10 mx-auto text-slate-500" />
                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    Drag and drop sign demonstration clip (MP4, WebM)
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Up to 60 FPS, max 50MB</p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Demo media uploaded and queued for verification.')}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm"
                >
                  Select File from Computer
                </button>
              </div>
            </div>

            <div className="text-left text-xs text-slate-400 p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-semibold text-indigo-300">Quality Guidelines:</span>
              <p>• Plain monochrome neutral background (navy or grey).</p>
              <p>• Signer's face and hands completely in frame.</p>
              <p>• Follow official ISLRTC Indian Sign Language dictionary motions.</p>
            </div>
          </div>
        )}
      </main>

      {/* EDIT LETTER MODAL */}
      {editingLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white">
                Edit Letter {editingLetter.letter} ({editingLetter.hindiEquivalent})
              </h2>
              <button
                onClick={() => setEditingLetter(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Dominant Hand Position</label>
                <textarea
                  value={editingLetter.dominantHand}
                  onChange={(e) =>
                    setEditingLetter({ ...editingLetter, dominantHand: e.target.value })
                  }
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Non-Dominant Hand Position</label>
                <textarea
                  value={editingLetter.nonDominantHand}
                  onChange={(e) =>
                    setEditingLetter({ ...editingLetter, nonDominantHand: e.target.value })
                  }
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Contact Point / Location</label>
                <input
                  type="text"
                  value={editingLetter.contactPoint || ''}
                  onChange={(e) =>
                    setEditingLetter({ ...editingLetter, contactPoint: e.target.value })
                  }
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Pro Tip</label>
                <input
                  type="text"
                  value={editingLetter.tips || ''}
                  onChange={(e) =>
                    setEditingLetter({ ...editingLetter, tips: e.target.value })
                  }
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setEditingLetter(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLetter}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-xs font-semibold text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW VOCAB MODAL */}
      {newVocabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreateVocab}
            className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white">Add New Vocabulary Sign</h2>
              <button
                type="button"
                onClick={() => setNewVocabModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">English Word *</label>
                  <input
                    type="text"
                    required
                    value={newWordData.word}
                    onChange={(e) => setNewWordData({ ...newWordData, word: e.target.value })}
                    placeholder="e.g. Teacher, Water"
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Hindi Translation</label>
                  <input
                    type="text"
                    value={newWordData.hindiTranslation}
                    onChange={(e) =>
                      setNewWordData({ ...newWordData, hindiTranslation: e.target.value })
                    }
                    placeholder="e.g. शिक्षक"
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newWordData.category}
                    onChange={(e) =>
                      setNewWordData({ ...newWordData, category: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                  >
                    <option value="Greetings & Manners">Greetings & Manners</option>
                    <option value="Family & Relations">Family & Relations</option>
                    <option value="Daily Life & Home">Daily Life & Home</option>
                    <option value="Emotions & Feelings">Emotions & Feelings</option>
                    <option value="Numbers 1–10">Numbers 1–10</option>
                    <option value="Emergency & Health">Emergency & Health</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Hand Coordination</label>
                  <select
                    value={newWordData.twoHanded ? 'two' : 'one'}
                    onChange={(e) =>
                      setNewWordData({ ...newWordData, twoHanded: e.target.value === 'two' })
                    }
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                  >
                    <option value="two">Two-Handed (Bilateral)</option>
                    <option value="one">One-Handed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Hand Positioning & Shape</label>
                <textarea
                  rows={2}
                  value={newWordData.handPosition}
                  onChange={(e) =>
                    setNewWordData({ ...newWordData, handPosition: e.target.value })
                  }
                  placeholder="Describe initial orientation of hands..."
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Movement Steps (One per line)</label>
                <textarea
                  rows={2}
                  value={newWordData.stepInstructions}
                  onChange={(e) =>
                    setNewWordData({ ...newWordData, stepInstructions: e.target.value })
                  }
                  placeholder="Step 1: Raise hands to chest level&#10;Step 2: Move outwards..."
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setNewVocabModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-xs font-semibold text-white"
              >
                Add Word Sign
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
