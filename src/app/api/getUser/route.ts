import { db } from "@/lib/db";
import { $users } from "@/lib/db/schema";
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
    // Fetch user data
    const userResult = await db.select().from($users).where(eq($users.id, userId));

    if (userResult.length === 0) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Return the first (and should be only) user object
    return new NextResponse(JSON.stringify(userResult[0]), { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}