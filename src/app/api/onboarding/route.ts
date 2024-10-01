import { OpenAIApi, Configuration } from "openai-edge";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { $users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// OpenAI configuration
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  console.log("Received POST request");

  // Authenticate the user
  const { userId } = await getAuth(req);
  if (!userId) {
    console.log("Unauthorized access attempt");
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  console.log(`Authenticated user ID: ${userId}`);

  try {
    // Parse form data
    const formData = await req.json();
    console.log("Parsed form data:", formData);

    // Calculate scores
    const scores = calculateMentalScore(formData);
    console.log("Calculated mental scores:", scores);

    // Generate feedback prompt
    const prompt = generatePrompt(formData, scores);
    console.log("Generated feedback prompt:", prompt);

    // Fetch feedback from OpenAI
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an educational advisor providing personalized feedback and tips based on user data. Use reinforcement learning principles to provide suggestions. Answer in a concise manner.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: false,
    });

    if (!response.ok) {
      console.error("OpenAI API request failed with status:", response.status);
      return new NextResponse(
        JSON.stringify({ error: "Failed to get feedback from OpenAI" }),
        { status: 500 }
      );
    }

    const responseData = await response.json();
    console.log("Received OpenAI response data:", responseData);

    const feedback = responseData.choices[0]?.message?.content || "No feedback available.";
    console.log("Generated feedback:", feedback);

    // Prepare user data for the database, ensuring all required fields have values
    const userData: any = {
      id: userId,
      name: formData.name,
      hobbies: formData.hobbies,
      studyEnjoyment: formData.studyEnjoyment,
      procrastinator: formData.procrastinator,
      socialLearner: formData.socialLearner,
      thinkingType: formData.thinkingType,
      learningType: formData.learningType,
      mentalStudyScoreCode: scores.totalScore,
      subscriptionType: formData.subscriptionType || 'free', // Ensure subscriptionType has a default value
    };
    console.log("Prepared user data for database:", userData);

    // Check if user exists in the database
    const existingUser = await db.select().from($users).where(eq($users.id, userId)).execute();
    console.log("Existing user check result:", existingUser);

    if (existingUser.length === 0) {
      console.log("Creating new user in database");
      await db.insert($users).values(userData).execute();
    } else {
      console.log("Updating existing user in database");
      await db.update($users).set(userData).where(eq($users.id, userId)).execute();
    }

    // Fetch the updated/created user data
    const updatedUser = await db.select().from($users).where(eq($users.id, userId)).execute();
    console.log("Fetched updated user data from database:", updatedUser[0]);

    // Return the response with scores, feedback, and user data
    return new NextResponse(
      JSON.stringify({
        success: true,
        scores,
        feedback,
        user: updatedUser[0],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error processing request:", error.message);
    console.error("Error stack trace:", error.stack);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500 }
    );
  }
}

// Function to calculate mental scores
function calculateMentalScore(formData) {
  console.log("Calculating mental scores...");
  const enjoymentScore = calculateEnjoymentScore(parseInt(formData.studyEnjoyment, 10));
  const procrastinationScore = calculateProcrastinationScore(formData.procrastinator);
  const socialLearnerScore = calculateSocialLearnerScore(parseInt(formData.socialLearner, 10));
  const thinkingTypeScore = calculateThinkingTypeScore(parseInt(formData.thinkingType, 10));
  const learningTypeScore = calculateLearningTypeScore(parseInt(formData.learningType, 10));

  const totalScore = (
    enjoymentScore * 0.25 +
    procrastinationScore * 0.2 +
    socialLearnerScore * 0.2 +
    thinkingTypeScore * 0.15 +
    learningTypeScore * 0.2
  ) * 10;

  const learningPotential = Math.round(100 * (1 - Math.exp(-totalScore / 50)));
  const learningScoreProjection = Math.round(20 * Math.log(totalScore + 1));

  console.log("Scores breakdown:", {
    enjoymentScore,
    procrastinationScore,
    socialLearnerScore,
    thinkingTypeScore,
    learningTypeScore,
    totalScore,
    learningPotential,
    learningScoreProjection,
  });

  return {
    totalScore: Math.round(totalScore),
    learningPotential,
    learningScoreProjection,
  };
}

function calculateEnjoymentScore(score) {
  return 10 * Math.exp(-Math.pow(score - 5, 2) / 8);
}

function calculateProcrastinationScore(procrastinator) {
  switch (procrastinator) {
    case "Yes":
      return 2;
    case "Sometimes":
      return 5;
    default:
      return 8;
  }
}

function calculateSocialLearnerScore(score) {
  return 10 / (1 + Math.exp(-0.5 * (score - 5)));
}

function calculateThinkingTypeScore(score) {
  return 10 * (1 - Math.abs(score - 5) / 5);
}

function calculateLearningTypeScore(score) {
  return 10 * (1 - Math.abs(score - 5) / 5);
}

function generatePrompt(formData, scores) {
  const prompt = `
    The user has completed an onboarding survey with the following details:
    - Name: ${formData.name}
    - Age: ${formData.age}
    - Gender: ${formData.gender}
    - Grade: ${formData.grade}
    - School: ${formData.school}
    - Hobbies: ${formData.hobbies}
    - Study Enjoyment: ${formData.studyEnjoyment}
    - Procrastinator: ${formData.procrastinator}
    - Social Learner: ${formData.socialLearner}
    - Thinking Type: ${formData.thinkingType}
    - Learning Type: ${formData.learningType}
    
    Based on this data:
    - Total Mental Score: ${scores.totalScore}
    - Learning Potential: ${scores.learningPotential}
    - Learning Score Projection: ${scores.learningScoreProjection}
    
    Provide personalized tips on how they can use reinforcement learning to connect on their strong points and improve their weak points. Include actionable steps and examples.
  `;
  console.log("Generated prompt content:", prompt);
  return prompt;
}
