import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Analytics API - Student performance and progress tracking
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'overview'; // overview, progress, performance, weak-areas

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    const analytics: any = {};

    if (type === 'overview' || type === 'all') {
      // Get user overview stats
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      const { data: xpLog } = await supabase
        .from('daily_xp_log')
        .select('*')
        .eq('user_id', userId);

      analytics.overview = {
        level: user?.level || 1,
        xp: user?.xp || 0,
        streak: user?.current_streak || 0,
        longestStreak: user?.longest_streak || 0,
        lessonsCompleted: progressData?.filter(p => p.completed).length || 0,
        totalLessons: progressData?.length || 0,
        accuracy: user?.average_accuracy || 0,
        xpThisWeek: xpLog?.filter(log => {
          const date = new Date(log.date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return date >= weekAgo;
        }).reduce((sum, log) => sum + log.xp_earned, 0) || 0,
      };
    }

    if (type === 'progress' || type === 'all') {
      // Get progress by module
      const { data: modulesData } = await supabase
        .from('modules')
        .select('*')
        .order('order_index', { ascending: true });

      const progressList = [];

      for (const mod of modulesData || []) {
        const { data: lessons } = await supabase
          .from('lessons')
          .select('id')
          .eq('module_id', mod.id);

        const { data: completedLessons } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('completed', true)
          .in('lesson_id', lessons?.map(l => l.id) || []);

        progressList.push({
          moduleId: mod.id,
          moduleName: mod.title,
          totalLessons: lessons?.length || 0,
          completedLessons: completedLessons?.length || 0,
          percentage: lessons?.length ? Math.round((completedLessons?.length || 0) / lessons.length * 100) : 0,
        });
      }

      analytics.progress = progressList;
    }

    if (type === 'performance' || type === 'all') {
      // Get performance metrics
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      const accuracies = progressData?.filter(p => p.accuracy_score).map(p => p.accuracy_score) || [];
      const avgAccuracy = accuracies.length ? accuracies.reduce((a, b) => a + b, 0) / accuracies.length : 0;

      analytics.performance = {
        averageAccuracy: Math.round(avgAccuracy),
        totalAttempts: progressData?.reduce((sum, p) => sum + (p.attempts || 0), 0) || 0,
        lessonsCompleted: progressData?.filter(p => p.completed).length || 0,
        improvementTrend: 'up', // TODO: Calculate based on historical data
      };
    }

    if (type === 'weak-areas' || type === 'all') {
      // Get areas that need improvement
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*, lessons(id, title, module_id)')
        .eq('user_id', userId)
        .lt('accuracy_score', 70) // Accuracy below 70%
        .order('accuracy_score', { ascending: true })
        .limit(5);

      analytics.weakAreas = progressData?.map(p => ({
        lessonId: p.lesson_id,
        lessonName: p.lessons?.title,
        accuracy: p.accuracy_score,
        attempts: p.attempts,
      })) || [];
    }

    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
