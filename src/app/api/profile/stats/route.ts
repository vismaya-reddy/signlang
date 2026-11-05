import { NextRequest, NextResponse } from 'next/server';
import { getUserProgress, getLeaderboard, getCurrentUser } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const userId =
      request.headers.get('x-user-id') ||
      request.cookies.get('user_id')?.value ||
      (await getCurrentUser())?.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const progressData = await getUserProgress(userId);
    const progress = Array.isArray(progressData) ? progressData[0] : progressData;
    const leaderboard = await getLeaderboard(100);
    const position = leaderboard.findIndex((entry: any) => entry.id === userId) + 1;

    return NextResponse.json({
      success: true,
      stats: {
        xp: progress?.total_xp || 0,
        level: Math.floor((progress?.total_xp || 0) / 1000) + 1,
        streak: progress?.current_streak || 0,
        lessons_completed: progress?.lessons_completed || 0,
        accuracy: progress?.average_accuracy || 0,
        leaderboard_position: position || 0,
      },
      user: {
        full_name: progress?.user_name,
        email: progress?.user_email,
      },
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
