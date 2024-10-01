// src/app/api/logout/route.tsx
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const sessionId = req.cookies.get("__session")?.value; // Assumes the session ID is stored in a cookie named "__session"
    if (!sessionId) {
      // If no session ID exists, return an appropriate response
      return NextResponse.json({ error: "No session found" }, { status: 400 });
    }

    try {
      await clerkClient.sessions.revokeSession(sessionId);
    } catch (error) {
      // Handle any errors that occur during session revocation
      console.error("Error revoking session:", error);
      return NextResponse.json({ error: "Failed to revoke session" }, { status: 500 });
    }

    const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
    response.cookies.delete("__session");
    return response;
  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 });
  }
}