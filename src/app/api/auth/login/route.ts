import { signIn, getUserProfile } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const loginData = await signIn(email, password);

    // Get user profile data
    let profile = null;
    if (loginData.user) {
      profile = await getUserProfile(loginData.user.id);
    }

    const response = NextResponse.json({
      success: true,
      user: loginData.user,
      session: loginData.session,
      profile,
      message: 'Logged in successfully',
    });

    if (loginData.session?.access_token) {
      response.cookies.set('auth_token', loginData.session.access_token, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    if (loginData.user?.id) {
      response.cookies.set('user_id', loginData.user.id, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    
    let statusCode = 400;
    let errorMessage = error.message || 'Failed to sign in';

    if (error.message?.includes('Invalid')) {
      errorMessage = 'Invalid email or password';
      statusCode = 401;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
