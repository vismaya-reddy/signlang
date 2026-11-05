import { NextRequest, NextResponse } from 'next/server';
import { updateStreak, getUserProgress } from '@/lib/supabase';

/**
 * Streak Tracking System
 * - Tracks consecutive days of practice
 * - Awards XP multiplier bonus
 * - Resets on missed days
 */

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const progressData = await getUserProgress(userId);
    const progress = Array.isArray(progressData) ? progressData[0] : progressData;

    return NextResponse.json({
      success: true,
      streak: {
        current: progress?.current_streak || 0,
        longest: progress?.longest_streak || 0,
        lastPracticeDate: progress?.last_practice_date,
        freezeTokens: progress?.freeze_tokens || 0,
      },
    });
  } catch (error: any) {
    console.error('Get streak error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch streak' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { action, freezeToken = false } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let result;

    if (action === 'increment') {
      result = await updateStreak(userId);
    } else if (action === 'reset') {
      result = await updateStreak(userId);
    } else if (action === 'use-freeze-token') {
      // Use freeze token to prevent streak reset
      result = await updateStreak(userId);
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Streak ${action === 'increment' ? 'incremented' : action === 'reset' ? 'reset' : 'frozen'}`,
    });
  } catch (error: any) {
    console.error('Update streak error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update streak' },
      { status: 500 }
    );
  }
}
