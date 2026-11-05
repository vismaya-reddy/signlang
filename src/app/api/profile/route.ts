import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getUserProfile, updateUserProfile } from '@/lib/supabase';

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

    const profile = await getUserProfile(userId);

    return NextResponse.json({
      success: true,
      user: profile,
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const data = await request.json();
    const updated = await updateUserProfile(userId, data);

    return NextResponse.json({
      success: true,
      user: updated,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
