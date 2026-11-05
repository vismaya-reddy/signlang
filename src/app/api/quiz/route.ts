import { NextRequest, NextResponse } from 'next/server';

/**
 * Quiz/Assessment API
 * Handles multiple choice, matching, and video recognition exercises
 * Scores and tracks accuracy
 */

interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  confidence?: number;
}

export async function POST(request: NextRequest) {
  try {
    const { lessonId, userId, answers } = await request.json();

    if (!lessonId || !userId || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mock quiz answers - TODO: Replace with actual database quiz definitions
    const correctAnswers: Record<string, any> = {
      'q1': { answer: 'b', points: 25 },
      'q2': { answer: 'a', points: 25 },
      'q3': { answer: ['a', 'c'], points: 25 },
      'q4': { answer: 'a', points: 25 },
    };

    let totalScore = 0;
    let correctCount = 0;
    const resultDetails = [];

    for (const userAnswer of answers) {
      const correct = correctAnswers[userAnswer.questionId];
      if (!correct) continue;

      let isCorrect = false;
      if (Array.isArray(correct.answer)) {
        isCorrect = JSON.stringify(userAnswer.answer.sort()) === 
                   JSON.stringify(correct.answer.sort());
      } else {
        isCorrect = userAnswer.answer === correct.answer;
      }

      if (isCorrect) {
        totalScore += correct.points;
        correctCount += 1;
      }

      resultDetails.push({
        questionId: userAnswer.questionId,
        correct: isCorrect,
        pointsEarned: isCorrect ? correct.points : 0,
      });
    }

    const accuracy = Math.round((correctCount / answers.length) * 100);

    // TODO: Update user progress in database
    // TODO: Award XP if accuracy > threshold

    return NextResponse.json({
      success: true,
      score: totalScore,
      accuracy,
      details: resultDetails,
      xpEarned: accuracy >= 70 ? 50 : 25,
    });
  } catch (error: any) {
    console.error('Quiz error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process quiz' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json(
        { error: 'Missing lessonId' },
        { status: 400 }
      );
    }

    // Mock quiz questions - TODO: Load from database
    const questions = [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What hand position do you use for the letter A?',
        options: [
          { id: 'a', text: 'Open hand with fingers spread' },
          { id: 'b', text: 'Closed fist with curled fingers' },
          { id: 'c', text: 'Peace sign with two fingers' },
          { id: 'd', text: 'Pointing with one finger' },
        ],
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'Where should the letter A be positioned?',
        options: [
          { id: 'a', text: 'At chest level' },
          { id: 'b', text: 'Above your head' },
          { id: 'c', text: 'Near your hip' },
          { id: 'd', text: 'Any position is fine' },
        ],
      },
    ];

    return NextResponse.json({
      success: true,
      questions,
    });
  } catch (error: any) {
    console.error('Get quiz error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}
