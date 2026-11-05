import { NextRequest, NextResponse } from 'next/server';
import { getUserProgress } from '@/lib/supabase';

/**
 * Badge Checking System
 * Automatically checks and awards badges based on user progress
 */

const BADGES = {
  firstStep: { name: 'First Step', condition: (xp: number) => xp > 0, points: 100 },
  weekWarrior: { name: 'Week Warrior', condition: (streak: number) => streak >= 7, points: 500 },
  centuryClub: { name: 'Century Club', condition: (xp: number) => xp >= 100, points: 150 },
  levelClimber5: { name: 'Level Climber', condition: (level: number) => level >= 5, points: 300 },
  perfectPractice: { name: 'Perfect Practice', condition: (accuracy: number) => accuracy >= 95, points: 300 },
  speedDemon: { name: 'Speed Demon', condition: (lessons: number) => lessons >= 5, points: 500 },
};

export async function POST(request: NextRequest) {
  try {
    const userId =
      request.headers.get('x-user-id') ||
      request.cookies.get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const progress = await getUserProgress(userId);

    if (!progress) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const newBadges: string[] = [];
    const progressData: any = Array.isArray(progress) ? progress[0] : progress;
    const xp = progressData?.total_xp || 0;
    const level = Math.floor(xp / 1000) + 1;
    const streak = progressData?.current_streak || 0;
    const accuracy = progressData?.average_accuracy || 0;
    const lessonsToday = progressData?.lessons_today || 0;

    // Check each badge condition
    if (BADGES.firstStep.condition(xp)) {
      newBadges.push('First Step');
    }

    if (BADGES.weekWarrior.condition(streak)) {
      newBadges.push('Week Warrior');
    }

    if (BADGES.centuryClub.condition(xp)) {
      newBadges.push('Century Club');
    }

    if (BADGES.levelClimber5.condition(level)) {
      newBadges.push('Level Climber');
    }

    if (BADGES.perfectPractice.condition(accuracy)) {
      newBadges.push('Perfect Practice');
    }

    if (BADGES.speedDemon.condition(lessonsToday)) {
      newBadges.push('Speed Demon');
    }

    return NextResponse.json({
      success: true,
      newBadges,
      unlockedCount: newBadges.length,
      totalBadges: Object.keys(BADGES).length,
    });
  } catch (error: any) {
    console.error('Badge check error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check badges' },
      { status: 500 }
    );
  }
}
