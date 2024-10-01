import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { $users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await getAuth(req);
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const queryUserId = url.searchParams.get('userId');

    if (!queryUserId) {
      return new NextResponse(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    if (userId !== queryUserId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const user = await db.select().from($users).where(eq($users.id, userId)).execute();
    if (user.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const surveyNumber = user[0].surveyNumber !== null ? user[0].surveyNumber : 0;
    const name = user[0].name ?? '';
    console.log("Returning user status:", { surveyNumber, name });
    return new NextResponse(JSON.stringify({ surveyNumber, name }), { status: 200 });
  } catch (error) {
    console.error("Error checking user status:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}