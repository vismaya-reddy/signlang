import { NextRequest, NextResponse } from 'next/server';
import { supabase, awardAchievement, getAchievements } from '@/lib/supabase';

/**
 * Badges/Achievements System API - Production Ready
 * 
 * Manages badge unlocking, tracking, and progression
 * 
 * Badge Definitions:
 * 1. First Step - Complete first lesson
 * 2. Week Warrior - Maintain 7-day streak
 * 3. Century Club - Earn 100 XP
 * 4. Level Climber - Reach levels 5, 10, 20
 * 5. Perfect Practice - 95%+ accuracy in lesson
 * 6. Speed Demon - Complete 5 lessons in 1 day
 * 7. Consistent Learner - Complete lessons 30 days
 * 8. Expert Signer - Reach level 20
 */

interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'accuracy' | 'streak' | 'xp' | 'level' | 'lessons' | 'days';
    value: number;
  };
  xpReward: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

const badges: BadgeDefinition[] = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Complete your first lesson',
    icon: '🎯',
    requirement: { type: 'lessons', value: 1 },
    xpReward: 100,
    rarity: 'common',
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    requirement: { type: 'streak', value: 7 },
    xpReward: 500,
    rarity: 'uncommon',
  },
  {
    id: 'century_club',
    name: 'Century Club',
    description: 'Earn 100 XP total',
    icon: '💯',
    requirement: { type: 'xp', value: 100 },
    xpReward: 50,
    rarity: 'common',
  },
  {
    id: 'level_5',
    name: 'Level Climber I',
    description: 'Reach level 5',
    icon: '📈',
    requirement: { type: 'level', value: 5 },
    xpReward: 250,
    rarity: 'uncommon',
  },
  {
    id: 'level_10',
    name: 'Level Climber II',
    description: 'Reach level 10',
    icon: '📊',
    requirement: { type: 'level', value: 10 },
    xpReward: 500,
    rarity: 'rare',
  },
  {
    id: 'perfect_practice',
    name: 'Perfect Practice',
    description: 'Achieve 95%+ accuracy in a lesson',
    icon: '⭐',
    requirement: { type: 'accuracy', value: 95 },
    xpReward: 200,
    rarity: 'uncommon',
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete 5 lessons in one day',
    icon: '⚡',
    requirement: { type: 'lessons', value: 5 },
    xpReward: 300,
    rarity: 'rare',
  },
  {
    id: 'consistent_learner',
    name: 'Consistent Learner',
    description: 'Complete lessons for 30 consecutive days',
    icon: '📚',
    requirement: { type: 'days', value: 30 },
    xpReward: 1000,
    rarity: 'legendary',
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const action = searchParams.get('action') || 'list';

    if (action === 'list') {
      return NextResponse.json({
        success: true,
        badges,
      });
    }

    if (action === 'user' && userId) {
      const userBadges = await getAchievements(userId);
      return NextResponse.json({
        success: true,
        badges: userBadges,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Get badges error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch badges' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, badgeId, triggerData } = await request.json();

    if (!userId || !badgeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const badge = badges.find(b => b.id === badgeId);
    if (!badge) {
      return NextResponse.json(
        { error: 'Badge not found' },
        { status: 404 }
      );
    }

    // Check if badge requirements are met
    const isMet = await checkBadgeRequirement(userId, badge, triggerData);
    
    if (!isMet) {
      return NextResponse.json({
        success: false,
        message: 'Badge requirements not met',
      });
    }

    // Award badge
    const achievement = await awardAchievement(userId, badgeId);

    return NextResponse.json({
      success: true,
      badge,
      achievement,
      xpReward: badge.xpReward,
    });
  } catch (error: any) {
    console.error('Award badge error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to award badge' },
      { status: 500 }
    );
  }
}

/**
 * Check if badge requirements are met
 */
async function checkBadgeRequirement(
  userId: string,
  badge: BadgeDefinition,
  triggerData: any
): Promise<boolean> {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!user) return false;

    switch (badge.requirement.type) {
      case 'lessons':
        const { data: progress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('completed', true);
        return (progress?.length || 0) >= badge.requirement.value;

      case 'accuracy':
        return (triggerData?.accuracy || 0) >= badge.requirement.value;

      case 'streak':
        return (user.current_streak || 0) >= badge.requirement.value;

      case 'xp':
        return (user.xp || 0) >= badge.requirement.value;

      case 'level':
        return (user.level || 1) >= badge.requirement.value;

      case 'days':
        return (user.longest_streak || 0) >= badge.requirement.value;

      default:
        return false;
    }
  } catch (error) {
    console.error('Badge requirement check error:', error);
    return false;
  }
}

/**
 * Production Checklist:
 * 
 * [ ] Create badges table in database
 * [ ] Implement badge checking on XP changes
 * [ ] Add badge notifications
 * [ ] Display badges in profile
 * [ ] Create badge progression visuals
 * [ ] Implement badge trading (optional)
 * [ ] Add seasonal badges
 * [ ] Create badge analytics
 * [ ] Implement badge rarity system
 * [ ] Add badge leaderboard
 */
