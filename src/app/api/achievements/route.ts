import { getAchievements, awardAchievement } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    const achievements = await getAchievements(userId);

    return NextResponse.json({
      success: true,
      achievements,
    });
  } catch (error: any) {
    console.error('Get achievements error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, achievementId } = await request.json();

    if (!userId || !achievementId) {
      return NextResponse.json(
        { error: 'Missing userId or achievementId' },
        { status: 400 }
      );
    }

    const achievement = await awardAchievement(userId, achievementId);

    return NextResponse.json({
      success: true,
      achievement,
    });
  } catch (error: any) {
    console.error('Award achievement error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to award achievement' },
      { status: 500 }
    );
  }
}
