import { getModules, getModule } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const moduleId = searchParams.get('id');

    if (moduleId) {
      const moduleData = await getModule(moduleId);
      return NextResponse.json({
        success: true,
        module: moduleData,
      });
    }

    const modules = await getModules();

    return NextResponse.json({
      success: true,
      modules,
    });
  } catch (error: any) {
    console.error('Get modules error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch modules' },
      { status: 500 }
    );
  }
}
