import { db } from "@/lib/db";
import { $notes, $users, $courses } from "@/lib/db/schema";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq, and, avg } from "drizzle-orm";

export const runtime = "edge";

export async function POST(req: Request) {
  const { userId } = await getAuth(req);
  if (!userId) {
    console.log("Unauthorized access attempt");
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await req.json();
  const { noteId, courseId, topics, understoodPercentage, mentalStudyScoreIncrement } = body;

  try {
    // Update the specific note
    await db.update($notes)
      .set({
        topic: JSON.stringify(topics),
        understoodPercentage,
      })
      .where(eq($notes.id, noteId))
      .execute();

    console.log("Note updated successfully");

    // Calculate average understoodPercentage for all notes in the course
    const averageResult = await db
      .select({ averagePercentage: avg($notes.understoodPercentage) })
      .from($notes)
      .where(eq($notes.className, courseId))
      .execute();

    const averagePercentage = Math.round(averageResult[0]?.averagePercentage || 0);

    console.log("Average percentage calculated:", averagePercentage);

    // Update the specific course
    const existingCourse = await db
      .select()
      .from($courses)
      .where(and(eq($courses.userId, userId), eq($courses.courseName, courseId)));

    if (existingCourse.length === 0) {
      console.log("Course not found");
      return new NextResponse(JSON.stringify({ error: "Course not found" }), { status: 404 });
    }

    const course = existingCourse[0];
    const currentTopics = course.extractedTopics ? JSON.parse(course.extractedTopics) : [];
    const updatedTopics = [...new Set([...currentTopics, ...topics])];

    await db.update($courses)
      .set({
        extractedTopics: JSON.stringify(updatedTopics),
        topicsUnderstoodPercentage: averagePercentage,
      })
      .where(eq($courses.courseName, courseId))
      .execute();

    console.log("Course updated successfully");

    // Update the user's mental study score
    await db.update($users)
      .set({
        mentalStudyScoreCode: db.raw(
          `CAST(COALESCE(CAST(mental_study_score_code AS INTEGER), 0) + ${mentalStudyScoreIncrement} AS TEXT)`
        ),
      })
      .where(eq($users.id, userId))
      .execute();

    console.log("User mental study score updated successfully");

    return new NextResponse(JSON.stringify({ message: "Scores updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating scores:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}