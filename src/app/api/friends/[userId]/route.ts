import { NextRequest, NextResponse } from 'next/server';
import { removeFriend } from '@/lib/supabase';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId: friendId } = await params;
  try {
    const currentUserId = request.headers.get('x-user-id');
    
    if (!currentUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await removeFriend(currentUserId, friendId);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Remove friend error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove friend' },
      { status: 500 }
    );
  }
}
