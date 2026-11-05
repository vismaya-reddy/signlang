import { signOut } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Sign out from Supabase
    await signOut();

    // Create response with cleared cookies
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear any auth-related cookies
    response.cookies.set('auth_token', '', {
      maxAge: 0,
      path: '/',
    });

    response.cookies.set('supabase-auth-token', '', {
      maxAge: 0,
      path: '/',
    });

    response.cookies.set('user_id', '', {
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: error.message || 'Logout failed' },
      { status: 500 }
    );
  }
}
