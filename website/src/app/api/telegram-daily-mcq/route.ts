// app/api/telegram-daily-mcq/route.ts
// Returns today's 5 rotating Daily MCQ questions in a format optimized for
// Telegram inline-button interaction (questions numbered, with callback data for answers).

import { NextRequest, NextResponse } from 'next/server';
import { fetchDailyFive, pseudoSolvedPct, type MCQQuestion } from '@/lib/dailyMcq';

interface TelegramQuestion {
  qno: number;
  subject: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  solvedPct: number;
}

interface TelegramMCQResponse {
  date: string;
  postTime: string;
  questions: TelegramQuestion[];
  channelId: string;
}

export async function GET(request: NextRequest) {
  try {
    // Fetch today's 5 rotating questions (same source as homepage + current-affairs)
    const questions = await fetchDailyFive();

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions available for today' },
        { status: 500 }
      );
    }

    // Format for Telegram bot
    const telegramQuestions: TelegramQuestion[] = questions.map((q, idx) => ({
      qno: idx + 1, // 1-5 for Telegram display
      subject: q.subject,
      topic: q.topic,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      solvedPct: pseudoSolvedPct(q),
    }));

    // IST time for the post
    const istDate = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toLocaleDateString('en-IN');

    const response: TelegramMCQResponse = {
      date: istDate,
      postTime: '09:00 AM IST', // Your chosen time
      questions: telegramQuestions,
      channelId: '@UKPSCDECODED',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching daily MCQ for Telegram:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily questions', details: String(error) },
      { status: 500 }
    );
  }
}

// POST endpoint for Telegram callback (when user clicks an answer button)
// This is called by the Telegram bot when someone clicks A/B/C/D on a question
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { queryId, userId, questionIndex, selectedAnswer, correctAnswer } = body;

    // Build response message (shown as popup notification to user)
    const isCorrect = selectedAnswer === correctAnswer;
    const emoji = isCorrect ? '✅' : '❌';
    const message = isCorrect
      ? `${emoji} Correct! It's option ${String.fromCharCode(65 + correctAnswer)}`
      : `${emoji} Wrong. The correct answer is ${String.fromCharCode(65 + correctAnswer)}`;

    return NextResponse.json({
      success: true,
      queryId,
      message,
      isCorrect,
    });
  } catch (error) {
    console.error('Telegram callback error:', error);
    return NextResponse.json(
      { error: 'Failed to process answer', details: String(error) },
      { status: 500 }
    );
  }
}
