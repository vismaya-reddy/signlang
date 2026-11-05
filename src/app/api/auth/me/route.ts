import { getCurrentUser, getUserProfile } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token =
      request.cookies.get('auth_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');
    const userIdCookie = request.cookies.get('user_id')?.value;

    // Get current authenticated user
    const user = await getCurrentUser(token, userIdCookie);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user profile data
    const profile = await getUserProfile(user.id);

    return NextResponse.json({
      success: true,
      user,
      profile,
    });
  } catch (error: any) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get current user' },
      { status: 500 }
    );
  }
}
