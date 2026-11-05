import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Lesson {
  id: string;
  title: string;
  type: string; // 'alphabet', 'number', 'word', etc.
  media_url: string | null;
  created_at: string;
}

export type FilterType = 'all' | 'alphabet' | 'number' | 'word';

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Fetching lessons from Supabase...');

        const { data, error: supabaseError } = await supabase
          .from('lessons')
          .select('id, title, type, media_url, created_at')
          .order('title', { ascending: true });

        if (supabaseError) {
          console.error('❌ Supabase Error:', supabaseError);
          throw new Error(`Failed to fetch lessons: ${supabaseError.message}`);
        }

        if (!data) {
          console.warn('⚠️ No lessons data returned');
          setLessons([]);
          return;
        }

        console.log(`✅ Successfully fetched ${data.length} lessons:`, data);

        // Normalize type field to lowercase for consistent filtering
        const normalizedLessons = (data as Lesson[]).map(lesson => ({
          ...lesson,
          type: lesson.type?.toLowerCase() || 'unknown'
        }));

        setLessons(normalizedLessons);
        setError(null);
      } catch (err: any) {
        console.error('❌ Error fetching lessons:', err);
        const errorMessage = err.message || 'Failed to fetch lessons from Supabase';
        setError(errorMessage);
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  // Filter lessons based on active filter
  const filteredLessons = activeFilter === 'all'
    ? lessons
    : lessons.filter(lesson => lesson.type === activeFilter);

  // Get counts for each filter
  const counts = {
    all: lessons.length,
    alphabet: lessons.filter(l => l.type === 'alphabet').length,
    number: lessons.filter(l => l.type === 'number').length,
    word: lessons.filter(l => l.type === 'word').length,
  };

  return {
    lessons,
    filteredLessons,
    loading,
    error,
    activeFilter,
    setActiveFilter,
    counts,
  };
}
