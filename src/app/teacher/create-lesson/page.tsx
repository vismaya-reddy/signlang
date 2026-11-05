'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  Upload,
  Wand2,
  Save,
  Plus,
  X,
} from 'lucide-react';

export default function CreateLessonPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    module: '',
    duration: 5,
    xpReward: 50,
    difficulty: 'beginner',
  });

  const [steps, setSteps] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    // TODO: Call AI video generation API
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const handleSaveLesson = async () => {
    // TODO: Save lesson to database with Supabase
    alert('Lesson saved! TODO: Integrate with Supabase');
  };

  const addStep = () => {
    setSteps([
      ...steps,
      {
        id: Date.now(),
        title: '',
        description: '',
        image: null,
      },
    ]);
  };

  const removeStep = (id: number) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const updateStep = (id: number, field: string, value: any) => {
    setSteps(steps.map(s => (s.id === id ? { ...s, [field]: value } : s)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/teacher/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-display font-bold">Create New Lesson</h1>
          <Button
            onClick={handleSaveLesson}
            className="bg-gradient-to-r from-primary to-accent"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Lesson
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Basic Information */}
          <Card className="p-6 bg-card/50 border-border/50">
            <h2 className="text-xl font-display font-bold mb-6">Lesson Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Lesson Title *</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Letter A - Beginner"
                  className="text-lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what students will learn in this lesson..."
                  className="w-full p-3 rounded-lg border border-border/50 bg-background/50 text-sm h-24 resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Module *</label>
                  <select
                    name="module"
                    value={formData.module}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg border border-border/50 bg-background/50 text-sm"
                  >
                    <option value="">Select a module...</option>
                    <option value="alphabets">Alphabets</option>
                    <option value="numbers">Numbers</option>
                    <option value="words">Basic Words</option>
                    <option value="sentences">Sentence Formation</option>
                    <option value="conversations">Daily Conversations</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty *</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg border border-border/50 bg-background/50 text-sm"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
                  <Input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="1"
                    max="60"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">XP Reward</label>
                  <Input
                    type="number"
                    name="xpReward"
                    value={formData.xpReward}
                    onChange={handleChange}
                    min="10"
                    step="10"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* AI Video Generation */}
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <h2 className="text-xl font-display font-bold mb-4">Generate AI Video</h2>
            <p className="text-muted-foreground mb-4">
              Generate sign language demonstration video using AI. The video will show the correct gesture with multiple angles.
            </p>
            <Button
              onClick={handleGenerateAI}
              disabled={!formData.title || isGenerating}
              className="w-full bg-gradient-to-r from-primary to-accent"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Generating Video...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate AI Video
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              TODO: Integrate with video generation API (Runway ML, Synthesia, or custom model)
            </p>
          </Card>

          {/* Step-by-Step Breakdown */}
          <Card className="p-6 bg-card/50 border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold">Step-by-Step Breakdown</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={addStep}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </div>

            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div key={step.id} className="p-4 border border-border/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Step {idx + 1}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStep(step.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <Input
                    placeholder="Step title"
                    value={step.title}
                    onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                  />

                  <textarea
                    placeholder="Step description"
                    value={step.description}
                    onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                    className="w-full p-2 rounded-lg border border-border/50 bg-background/50 text-sm h-20 resize-none"
                  />

                  <div className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Upload instructional image</p>
                  </div>
                </div>
              ))}

              {steps.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No steps added yet. Click "Add Step" to create the first step.
                </p>
              )}
            </div>
          </Card>

          {/* Practice Exercises */}
          <Card className="p-6 bg-card/50 border-border/50">
            <h2 className="text-xl font-display font-bold mb-4">Practice Exercises</h2>
            <p className="text-muted-foreground mb-4">
              Add quiz questions and practice exercises for this lesson.
            </p>
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Exercise
            </Button>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
