"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";

const CreateNoteDialog = dynamic(() => import("./CreateNoteDialog"), {
  ssr: false,
});

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [courseColors, setCourseColors] = useState({});

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("/api/getNotes");
        const sortedNotes = response.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setNotes(sortedNotes);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    const courseSet = new Set(notes.map((note) => note.className));
    const colors = ["text-orange-500", "text-blue-500", "text-yellow-500", "text-green-500", "text-indigo-500"];
    const courseColorMap = {};

    Array.from(courseSet).forEach((course, index) => {
      courseColorMap[course] = colors[index % colors.length];
    });

    setCourseColors(courseColorMap);
  }, [notes]);

  if (isError) {
    return <div>Error loading notes</div>;
  }

  return (
    <div className="p-4 overflow-y-auto rounded-lg custom-scrollbar h-full">
      <div className="grid grid-cols-5 gap-4 h-full">
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-200 h-1/2 rounded-lg animate-pulse"
              ></div>
            ))
          : notes.slice(0, 5).map((note) => (
              <a
                href={`/notebook/${note.id}`}
                key={note.id}
                className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between p-2 bg-white"
                style={{ height: '100%' }}
              >
                <div className={`text-xs font-medium truncate ${courseColors[note.className]}`}>{note.className}</div>
                <div className="text-xxs text-gray-900">{note.name}</div>
                <div className="relative flex-grow mt-1">
                  <Image
                    src={note.imageUrl || "/placeholder-image.jpg"}
                    alt={note.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              </a>
            ))}
      </div>
    </div>
  );
};

export default Notes;
