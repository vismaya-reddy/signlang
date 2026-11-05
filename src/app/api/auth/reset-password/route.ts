import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // TODO: Integrate with Supabase resetPasswordForEmail
    // await supabase.auth.resetPasswordForEmail(email)

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Password reset failed' },
      { status: 500 }
    );
  }
}
