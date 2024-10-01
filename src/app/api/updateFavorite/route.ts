import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { noteId, favorite } = body;

        if (!favorite || !noteId) {
            return new NextResponse("Missing favorite or noteId", { status: 400 });
        }

        const notes = await db.select().from($notes).where(eq($notes.id, noteId));
        if (notes.length != 1) {
            return new NextResponse("Note not found", { status: 404 });
        }

        const note = notes[0];

        const currentFavorites = note.favorites || [];

        // Update the favorite in the currentFavorites array
        const updatedFavorites = currentFavorites.map(fav =>
          fav.id === favorite.id ? favorite : fav
        );

        await db.update($notes).set({ favorites: updatedFavorites }).where(eq($notes.id, noteId));

        const updatedNotes = await db.select().from($notes).where(eq($notes.id, noteId));
        const updatedNote = updatedNotes[0];

        return NextResponse.json(
            { success: true, updatedNote },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false },
            { status: 500 }
        );
    }
}
