import { NextRequest, NextResponse } from 'next/server';
import { updateUserProgress, addXP } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { lessonId, accuracy, timeSpent } = await request.json();

    if (!userId || !lessonId || accuracy === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate XP based on accuracy
    let xpEarned = 50; // Base XP for lesson completion
    
    if (accuracy >= 95) xpEarned += 50; // Perfect score bonus
    else if (accuracy >= 80) xpEarned += 25; // Great score bonus
    else if (accuracy >= 60) xpEarned += 10; // Good score bonus

    // Award XP
    await addXP(userId, xpEarned, lessonId);

    // Return success response with XP earned
    return NextResponse.json({
      success: true,
      data: {
        xpEarned,
        newLevel: Math.floor((xpEarned + 50) / 1000) + 1,
        newStreak: 1,
        totalXP: xpEarned + 50,
        message: 'Lesson completed successfully!',
      },
    });
  } catch (error: any) {
    console.error('Complete lesson error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete lesson' },
      { status: 500 }
    );
  }
}
