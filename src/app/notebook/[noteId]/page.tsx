// src/app/notebook/[noteId]/page.tsx
"use client"
import { useAuth, useUser } from "@clerk/nextjs";
import { db } from '@/lib/db';
import { $notes } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import LoadingSpinner from "@/components/LoadingSpinner";

const NotebookPageClient = dynamic(() => import('./NotebookPageClient'), { ssr: false });

type Props = {
  params: { noteId: string };
};

const NotebookPage: React.FC<Props> = ({ params: { noteId } }) => {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      if (!userId) {
        return redirect('/dashboard');
      }

      const notes = await db
        .select()
        .from($notes)
        .where(and(eq($notes.id, parseInt(noteId)), eq($notes.userId, userId)));

      if (notes.length !== 1) {
        return redirect('/dashboard');
      }

      setNote(notes[0]);
    };

    if (isLoaded) {
      fetchNote();
    }
  }, [isLoaded, noteId, userId]);

  if (!isLoaded || !user || !note) {
    // Optional: Add a loading state here
    return <LoadingSpinner />;
;
  }

  return <NotebookPageClient user={user} note={note} />;
};

export default NotebookPage;
