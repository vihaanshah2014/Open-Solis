import { db } from "@/lib/db";
import { $notes, $courses } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const courseName = searchParams.get("courseName");

  if (!userId || !courseName) {
    return NextResponse.json({ error: "Missing userId or courseName" }, { status: 400 });
  }

  try {
    // Delete all notes associated with the course
    const deleteNotesResult = await db.delete($notes).where(
      and(
        eq($notes.userId, userId),
        eq($notes.className, courseName)
      )
    );

    // Delete the course
    const deleteCourseResult = await db.delete($courses).where(
      and(
        eq($courses.userId, userId),
        eq($courses.courseName, courseName)
      )
    );

    if (deleteCourseResult.rowCount === 0) {
      // If no course was deleted, it might not exist
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Course and associated notes deleted successfully",
      deletedNotes: deleteNotesResult.rowCount,
      deletedCourses: deleteCourseResult.rowCount
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}