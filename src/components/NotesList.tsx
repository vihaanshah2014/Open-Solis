// components/NotesList.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/legacy/image";
import DeleteButton from "@/components/DeleteCourse";

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("/api/getNotes");
        setNotes(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (isLoading) {
    return <div>Loading notes...</div>;
  }

  if (isError) {
    return <div>Error loading notes</div>;
  }

  // Group notes by className
  const groupedNotes: Record<string, typeof notes> = {};
  notes.forEach((note: any) => {
    if (!groupedNotes[note.className]) {
      groupedNotes[note.className] = [];
    }
    groupedNotes[note.className].push(note);
  });

  return (
    <div className="grid sm:grid-cols-3 md:grid-cols-5 grid-cols-1 gap-3">
      {Object.entries(groupedNotes).map(([className, classNotes]) => (
        <div key={className}>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">{className}</h3>
          {classNotes.map((note: any) => (
            <a href={`/notebook/${note.id}`} key={note.id}>
              <div className="border border-stone-300 rounded-lg overflow-hidden flex flex-col hover:shadow-xl transition hover:-translate-y-1">
                <Image width={400} height={200} alt={note.name} src={note.imageUrl || ""} />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900">{note.name}</h3>
                  <div className="h-1"></div>
                  <p className="text-sm text-gray-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </a>
          ))}
          <DeleteButton className={className} />
        </div>
      ))}
    </div>
  );
};

export default NotesList;