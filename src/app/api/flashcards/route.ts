import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Handler for GET requests
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const noteId = searchParams.get("id");

    if (!noteId) {
      return new NextResponse("Missing noteId", { status: 400 });
    }

    const parsedNoteId = parseInt(noteId);
    const notes = await db.select().from($notes).where(eq($notes.id, parsedNoteId));

    if (notes.length !== 1) {
      return new NextResponse("Note not found", { status: 404 });
    }

    return NextResponse.json(notes[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching note:", error);
    return new NextResponse("Failed to fetch note", { status: 500 });
  }
}

// Handler for POST requests
export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { noteId, editorState, notecards, favorites } = body;

    // Validate the presence of required fields
    if (!noteId || !editorState) {
      console.log("noteId",noteId);
      console.log("EditorState",editorState)
      return new NextResponse("Missing editorState or noteId", { status: 400 });
    }

    // Convert noteId to an integer for database queries
    const parsedNoteId = parseInt(noteId);
    const notes = await db.select().from($notes).where(eq($notes.id, parsedNoteId));

    // Check if the note exists
    if (notes.length !== 1) {
      return new NextResponse("Note not found", { status: 404 });
    }

    const note = notes[0];

    // Only update if the editorState has changed or new data is added
    if (note.editorState !== editorState || notecards || favorites) {
      await db
        .update($notes)
        .set({
          editorState,
          notecards: JSON.stringify(notecards),
          favorites: JSON.stringify(favorites),
        })
        .where(eq($notes.id, parsedNoteId));
    }

    // Return success response
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Error processing POST request:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}

// Additional handlers like PUT, DELETE can be added below if needed
