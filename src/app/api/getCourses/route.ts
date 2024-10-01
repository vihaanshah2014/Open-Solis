//api/getCourses/route.ts
import { db } from "@/lib/db";
import { $courses } from "@/lib/db/schema";
import { getAuth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await getAuth(req);
  if (!userId) {
    console.log("Unauthorized access attempt");
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    // Fetch courses for the user
    const coursesResult = await db.select().from($courses).where(eq($courses.userId, userId));
    console.log("Courses fetched for user:", coursesResult);

    return new NextResponse(JSON.stringify(coursesResult), { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}