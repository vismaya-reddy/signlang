import { NextRequest, NextResponse } from 'next/server';
import { getLesson } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    const lessonId = searchParams.get('id');
    const userId = request.headers.get('x-user-id');

    if (lessonId && userId) {
      // Get single lesson with user progress
      const lesson = await getLesson(lessonId);
      return NextResponse.json({
        success: true,
        lesson,
      });
    }

    if (moduleId) {
      // For now, return mock lessons for the module
      return NextResponse.json({
        success: true,
        lessons: [
          { id: '1', title: 'Basic Greetings', description: 'Learn hello, goodbye, thank you', moduleId },
          { id: '2', title: 'Common Phrases', description: 'Essential everyday phrases', moduleId },
          { id: '3', title: 'Numbers', description: 'Count from 1-10', moduleId },
        ],
      });
    }

    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Get lessons error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}
