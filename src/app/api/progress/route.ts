import { NextRequest, NextResponse } from 'next/server';
import { getUserProgress } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const progress = await getUserProgress(userId);

    return NextResponse.json({
      success: true,
      progress,
    });
  } catch (error: any) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
