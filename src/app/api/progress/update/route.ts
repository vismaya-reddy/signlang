import { updateUserProgress, addXP, updateStreak } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, lessonId, completed, accuracyScore } = await request.json();

    if (!userId || !lessonId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update progress
    const progress = await updateUserProgress(userId, lessonId, completed, accuracyScore);

    // If completed, award XP and update streak
    if (completed) {
      const xpReward = 50;
      await addXP(userId, xpReward, lessonId);
      await updateStreak(userId);
    }

    return NextResponse.json({
      success: true,
      progress,
    });
  } catch (error: any) {
    console.error('Update progress error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update progress' },
      { status: 500 }
    );
  }
}
