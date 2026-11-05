import { getCurrentUser, getUserProfile, getUserProgress } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token =
      request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');
    const userIdCookie = request.cookies.get('user_id')?.value;

    // Get current user
    const user = await getCurrentUser(token, userIdCookie);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user profile
    const profile = await getUserProfile(user.id);

    // Get user progress on all lessons
    const progress = await getUserProgress(user.id);

    // Calculate stats
    const totalLessonsCompleted = progress.filter((p) => p.completed).length;
    const averageAccuracy =
      progress.length > 0
        ? Math.round(progress.reduce((sum, p) => sum + (p.accuracy_score || 0), 0) / progress.length)
        : 0;

    return NextResponse.json({
      success: true,
      profile,
      progress,
      stats: {
        totalLessonsCompleted,
        averageAccuracy,
        totalAttempts: progress.reduce((sum, p) => sum + (p.attempts || 0), 0),
      },
    });
  } catch (error: any) {
    console.error('Fetch progress error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
