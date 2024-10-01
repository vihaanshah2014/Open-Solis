// pages/api/analyzeCognitiveLoad.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.json();

  // Simplified scoring system. Enhance this based on psychological research.
  let score = 0;
  const insights: string[] = [];

  // Simple scoring criteria
  const hoursOfSleep = parseInt(formData.hoursOfSleep, 10);
  const hoursOfStudy = parseInt(formData.hoursOfStudy, 10);

  if (hoursOfSleep >= 7) score += 30;
  else if (hoursOfSleep >= 5) score += 20;
  else score += 10;

  if (hoursOfStudy >= 3) score += 30;
  else if (hoursOfStudy >= 1) score += 20;
  else score += 10;

  if (formData.studyFrequency === 'Daily') score += 30;
  else if (formData.studyFrequency === 'Several times a week') score += 20;
  else if (formData.studyFrequency === 'Weekly') score += 10;
  else score += 5;

  // Generate insights based on responses
  if (score <= 50) {
    insights.push("Consider getting more sleep and increasing study hours for better cognitive performance.");
  } else if (score <= 70) {
    insights.push("You have a good balance, but there's room for improvement.");
  } else {
    insights.push("You have excellent cognitive habits.");
  }

  return NextResponse.json({
    cognitiveLoadCapacity: score,
    insights: insights
  });
}
