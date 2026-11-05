import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit')) || 10;
    const timeframe = searchParams.get('timeframe') || 'all-time'; // all-time, weekly, monthly

    const leaderboard = await getLeaderboard(limit);

    // TODO: Implement timeframe filtering
    // if (timeframe === 'weekly') { filter for last 7 days }
    // if (timeframe === 'monthly') { filter for last 30 days }

    return NextResponse.json({
      success: true,
      leaderboard: leaderboard.map((entry: any, idx: number) => ({
        rank: idx + 1,
        userId: entry.id,
        name: entry.full_name || 'Anonymous',
        xp: entry.total_xp || 0,
        level: Math.floor((entry.total_xp || 0) / 1000) + 1,
        streak: entry.current_streak || 0,
        lessonsCompleted: entry.lessons_completed || 0,
      })),
      timeframe,
      total: leaderboard.length,
    });
  } catch (error: any) {
    console.error('Get leaderboard error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
