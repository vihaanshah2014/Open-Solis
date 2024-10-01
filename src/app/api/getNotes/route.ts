import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
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
    // Fetch notes directly for the user
    const notesResult = await db.select().from($notes).where(eq($notes.userId, userId));
    // console.log("Notes fetched for user:", notesResult);

    return new NextResponse(JSON.stringify(notesResult), { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}