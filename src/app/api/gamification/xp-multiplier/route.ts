import { NextRequest, NextResponse } from 'next/server';

/**
 * XP Multiplier System
 * - Streak-based multipliers (up to 1.5x)
 * - Daily bonus (1.25x after 3rd lesson of day)
 * - Difficulty-based multipliers (1.2x for hard lessons)
 */

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const streak = Number(searchParams.get('streak')) || 0;
    const lessonsToday = Number(searchParams.get('lessonsToday')) || 0;
    const difficulty = searchParams.get('difficulty') || 'normal';

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let multiplier = 1.0;

    // Streak multiplier (up to 1.5x at 7+ day streak)
    if (streak >= 7) multiplier *= 1.5;
    else if (streak >= 5) multiplier *= 1.3;
    else if (streak >= 3) multiplier *= 1.2;
    else if (streak >= 1) multiplier *= 1.1;

    // Daily bonus (1.25x after 3rd lesson of day)
    if (lessonsToday >= 3) multiplier *= 1.25;

    // Difficulty multiplier
    if (difficulty === 'hard') multiplier *= 1.2;
    else if (difficulty === 'easy') multiplier *= 0.8;

    return NextResponse.json({
      success: true,
      multiplier: Math.min(multiplier, 3.0), // Cap at 3x
      breakdown: {
        streak: streak >= 1 ? Math.min(1 + streak * 0.1, 1.5) : 1,
        dailyBonus: lessonsToday >= 3 ? 1.25 : 1,
        difficulty: difficulty === 'hard' ? 1.2 : difficulty === 'easy' ? 0.8 : 1,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to calculate multiplier' },
      { status: 500 }
    );
  }
}
