import { db } from "@/lib/db";
import { $notes, $users, $courses } from "@/lib/db/schema";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export const runtime = "edge";

export async function POST(req: Request) {
  const { userId } = await getAuth(req);
  if (!userId) {
    console.log("Unauthorized access attempt");
    return new NextResponse("unauthorised", { status: 401 });
  }

  const body = await req.json();
  const { name, className } = body;
  console.log("Received notebook name:", name);

  const randomSeed = Math.floor(Math.random() * 1000);
  const picsumImageUrl = `https://picsum.photos/seed/${randomSeed}/300/300`;

  console.log("Using Picsum image URL:", picsumImageUrl);

  try {
    // First, check if the user exists in the users table
    const existingUser = await db.select().from($users).where(eq($users.id, userId));

    if (existingUser.length === 0) {
      console.error("User does not exist in the database.");
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if the course exists
    const existingCourse = await db
      .select()
      .from($courses)
      .where(and(eq($courses.userId, userId), eq($courses.courseName, className)));

    let isNewCourse = false;

    if (existingCourse.length === 0) {
      console.log("Course does not exist. Creating a new course.");
      // If the course doesn't exist, create it
      await db.insert($courses).values({
        userId,
        courseName: className,
        keyDates: null,
        extractedTopics: null,
        topicsUnderstoodPercentage: null,
      });
      isNewCourse = true;
    }

    // If it's a new course, increment the numberOfClasses for the user
    if (isNewCourse) {
      await db
        .update($users)
        .set({ numberOfClasses: (existingUser[0].numberOfClasses || 0) + 1 })
        .where(eq($users.id, userId));
    }

    // Now create the note
    const note_ids = await db
      .insert($notes)
      .values({
        userId,
        name,
        imageUrl: picsumImageUrl,
        className,
        createdAt: new Date(),
        editorState: null,
        understoodPercentage: null,
        topic: null,
        extractedContent: null,
      })
      .returning({ insertedId: $notes.id });

    return NextResponse.json({ note_id: note_ids[0].insertedId });
  } catch (error) {
    console.error("Error inserting note into the database:", error);
    return new NextResponse("failed to create notebook", { status: 500 });
  }
}
