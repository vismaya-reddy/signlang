import { NextRequest, NextResponse } from 'next/server';
import { getFriends, addFriend, removeFriend } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const friends = await getFriends(userId);

    return NextResponse.json({
      success: true,
      friends,
      count: friends.length,
    });
  } catch (error: any) {
    console.error('Get friends error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch friends' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { friendId } = await request.json();

    if (!userId || !friendId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await addFriend(userId, friendId);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Add friend error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add friend' },
      { status: 500 }
    );
  }
}
