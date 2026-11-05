import { NextRequest, NextResponse } from 'next/server';
import { addMessage } from '@/lib/supabase';

/**
 * AI Chat Backend with LLM Integration
 * TODO: Replace mock responses with actual OpenAI/Anthropic API calls
 */

const aiKnowledgeBase: Record<string, string> = {
  'alphabet': 'The ASL alphabet has 26 letters. Each letter is represented by a specific hand shape and position. Start with A - make a closed fist with your thumb on the side.',
  'numbers': 'In ASL, numbers 0-9 have specific hand positions. Numbers 1-5 are shown with open fingers, while 6-9 use the 5 handshape as a base.',
  'hello': 'To sign "hello", wave your hand from your forehead, like a salute motion. Keep your hand open with all fingers extended.',
  'thank_you': 'To sign "thank you", touch your fingers to your chin and move your hand downward and forward.',
  'practice': 'I recommend practicing each sign 10 times daily. Record yourself and compare with the lesson videos.',
  'default': 'Great question! I\'m here to help you learn sign language. What would you like to know more about?',
};

export async function POST(request: NextRequest) {
  try {
    const { conversationId, userId, message } = await request.json();

    if (!conversationId || !userId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Add user message to database
    await addMessage(conversationId, userId, 'user', message, false, false);

    // Generate AI response based on keywords
    let aiResponse = aiKnowledgeBase['default'];
    const lowerMessage = message.toLowerCase();

    for (const [keyword, response] of Object.entries(aiKnowledgeBase)) {
      if (lowerMessage.includes(keyword.replace('_', ' '))) {
        aiResponse = response;
        break;
      }
    }

    // TODO: Integrate with actual LLM API
    // Example with OpenAI:
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [{ role: "user", content: message }],
    //   system: "You are a sign language learning assistant..."
    // });
    // aiResponse = completion.choices[0].message.content;

    // Add AI response to database
    const aiMessage = await addMessage(
      conversationId,
      userId,
      'assistant',
      aiResponse,
      true, // hasAudio
      true  // hasSignAnimation
    );

    return NextResponse.json({
      success: true,
      message: aiMessage,
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process message' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Missing conversationId' },
        { status: 400 }
      );
    }

    // TODO: Fetch conversation messages from database
    return NextResponse.json({
      success: true,
      messages: [],
    });
  } catch (error: any) {
    console.error('Get conversation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}
