// src/app/api/updateUser/route.ts
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { $users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await getAuth(req);
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const { name, hobbies, hoursOfSleep, hoursOfStudy, studyFrequency, surveyNumber, mentalStudyScoreCode, subscriptionType} = await req.json();
    
    console.log("Received data:", { name, hobbies, hoursOfSleep, hoursOfStudy, studyFrequency, surveyNumber, mentalStudyScoreCode, subscriptionType});

    const userData: any = {
      id: userId,
      name,
      hobbies,
      hoursOfSleep,
      hoursOfStudy,
      studyFrequency,
      surveyNumber,
      mentalStudyScoreCode: mentalStudyScoreCode || 0,
      subscriptionType,
    };

    // Check if user exists
    const existingUser = await db.select().from($users).where(eq($users.id, userId)).execute();

    if (existingUser.length === 0) {
      console.log("Creating new user");
      await db.insert($users).values(userData).execute();
    } else {
      console.log("Updating existing user");
      await db.update($users).set(userData).where(eq($users.id, userId)).execute();
    }

    // Fetch the updated/created user data
    const updatedUser = await db.select().from($users).where(eq($users.id, userId)).execute();

    console.log("Updated user:", updatedUser[0]);

    return new NextResponse(JSON.stringify({ 
      success: true,
      user: updatedUser[0]
    }), { status: 200 });
  } catch (error) {
    console.error("Error updating/creating user:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error", details: error.message }), { status: 500 });
  }
}