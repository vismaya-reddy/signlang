import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

/**
 * In-Lesson AI Guide API - Production Ready
 * 
 * Provides context-aware hints, explanations, and encouragement during lessons
 * 
 * Features:
 * - Real-time hints based on user struggles
 * - Step-by-step breakdowns
 * - Motivation and encouragement
 * - Progress awareness
 * - Adaptive difficulty suggestions
 * - Error-specific guidance
 */

interface InLessonGuideRequest {
  userId: string;
  lessonId: string;
  currentStep: number;
  totalSteps: number;
  userAccuracy?: number;
  userState: 'stuck' | 'learning' | 'progressing' | 'struggling' | 'needs_break';
  recentErrors?: string[];
  hintLevel?: 1 | 2 | 3; // 1=subtle, 2=moderate, 3=explicit
}

interface GuideResponse {
  hint: string;
  explanation?: string;
  encouragement: string;
  nextSteps: string[];
  suggestedFocus?: string;
  shouldTakeBreak?: boolean;
  estimatedTimeRemaining?: number;
}

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'placeholder-key',
  });
}

const guideSystemPrompt = `You are an in-lesson AI tutor for sign language learning. Your role is to:

1. PROVIDE CONTEXT-AWARE HINTS based on where the student is in the lesson
2. ADAPT your hints based on their accuracy level and emotional state
3. ENCOURAGE and MOTIVATE the student continuously
4. KNOW when a student needs a break or should move forward
5. USE encouraging language but be specific about improvements needed

Response format:
- Hint: A specific, actionable hint (1-2 sentences)
- Explanation: Deeper explanation if needed (2-3 sentences)
- Encouragement: Positive, motivating statement (1-2 sentences)
- Next Steps: Clear next actions (bullet points)`;

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      lessonId,
      currentStep,
      totalSteps,
      userAccuracy = 50,
      userState = 'learning',
      recentErrors = [],
      hintLevel = 2,
    } = (await request.json()) as InLessonGuideRequest;

    if (!userId || !lessonId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const progressPercentage = Math.round((currentStep / totalSteps) * 100);

    const userPrompt = `
    Student context:
    - Current step: ${currentStep} of ${totalSteps} (${progressPercentage}% through lesson)
    - Current accuracy: ${userAccuracy}%
    - Emotional/learning state: ${userState}
    - Recent errors: ${recentErrors.length > 0 ? recentErrors.join(', ') : 'None'}
    - Hint specificity level: ${hintLevel === 1 ? 'Very subtle' : hintLevel === 2 ? 'Moderate' : 'Explicit'}
    
    Provide a ${hintLevel === 1 ? 'subtle' : hintLevel === 2 ? 'helpful' : 'clear and explicit'} hint to help the student progress.
    Consider their emotional state and accuracy level. Be encouraging.`;

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: guideSystemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 400,
    });

    const aiResponse = completion.choices[0]?.message?.content || '';

    // Parse AI response
    const guide = parseGuideResponse(aiResponse, userAccuracy, userState, progressPercentage);

    return NextResponse.json({
      success: true,
      guide,
      userId,
      lessonId,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('In-lesson guide error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate guide' },
      { status: 500 }
    );
  }
}

/**
 * Parse AI response into structured guide format
 */
function parseGuideResponse(
  aiResponse: string,
  accuracy: number,
  userState: string,
  progress: number
): GuideResponse {
  // Extract sections from AI response
  const hintMatch = aiResponse.match(/hint[:\s]+([^.!]+[.!])/i);
  const explanationMatch = aiResponse.match(/explanation[:\s]+([^.!]+[.!])/i);
  const encouragementMatch = aiResponse.match(/encouragement[:\s]+([^.!]+[.!])/i);

  // Determine if break is needed
  const shouldTakeBreak =
    accuracy < 40 && userState === 'struggling' && progress > 50;

  // Estimate remaining time
  const avgTimePerStep = 3; // minutes
  const stepsRemaining = 10 - Math.floor(progress / 10);
  const estimatedTimeRemaining = stepsRemaining * avgTimePerStep;

  return {
    hint: hintMatch ? hintMatch[1].trim() : 'Keep practicing! You\'re doing great.',
    explanation: explanationMatch
      ? explanationMatch[1].trim()
      : undefined,
    encouragement: encouragementMatch
      ? encouragementMatch[1].trim()
      : 'You\'re making progress. Keep going!',
    nextSteps: [
      'Review the current step carefully',
      'Try the gesture again with the hint in mind',
      'Compare your form with the demonstration',
    ],
    suggestedFocus: determineFocus(userState, accuracy),
    shouldTakeBreak,
    estimatedTimeRemaining,
  };
}

/**
 * Determine what to focus on based on user state
 */
function determineFocus(userState: string, accuracy: number): string {
  if (userState === 'stuck') {
    return 'Hand positioning - make sure your hand is at the correct angle and height';
  }
  if (userState === 'struggling') {
    return 'Finger formation - focus on how each finger should bend and position';
  }
  if (accuracy < 60) {
    return 'Movement fluidity - practice smooth transitions between positions';
  }
  if (accuracy < 80) {
    return 'Fine details - refine small adjustments to perfect your gesture';
  }
  return 'Practice consistency - repeat until the gesture becomes natural';
}

/**
 * Production Checklist:
 * 
 * [ ] Set OPENAI_API_KEY environment variable
 * [ ] Test with different user states
 * [ ] Monitor response quality and accuracy
 * [ ] Implement user feedback on hint helpfulness
 * [ ] Track which hints are most effective
 * [ ] Add analytics for break recommendations
 * [ ] Implement personalization based on learning style
 * [ ] Cache common hints for faster response
 * [ ] Add support for voice delivery of hints
 * [ ] Implement hint history for student review
 * [ ] Create admin interface to review guides
 * [ ] A/B test different hint styles
 */
