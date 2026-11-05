import { signUp } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, and name are required' },
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

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Sign up user with Supabase Auth (creates profile automatically)
    const authData = await signUp(email, password, name);

    const response = NextResponse.json({
      success: true,
      user: authData.user,
      session: authData.session,
      message: 'Account created successfully',
    });

    if (authData.session?.access_token) {
      response.cookies.set('auth_token', authData.session.access_token, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    if (authData.user?.id) {
      response.cookies.set('user_id', authData.user.id, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error: any) {
    console.error('Signup error:', error);
    
    // Handle specific errors
    let statusCode = 400;
    let errorMessage = error.message || 'Failed to sign up';

    if (error.message?.includes('already exists')) {
      errorMessage = 'Email already registered';
      statusCode = 409;
    } else if (error.message?.includes('Invalid email')) {
      statusCode = 400;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
