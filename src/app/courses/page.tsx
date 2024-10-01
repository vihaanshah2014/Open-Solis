"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import CreateNoteDialog from "@/components/CreateNoteDialog";
import { ArrowLeft, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const getGreeting = (name: string) => {
  const currentHour = new Date().getHours();
  let greeting = "Good Morning";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good Afternoon";
  } else if (currentHour >= 18) {
    greeting = "Good Evening";
  }

  const firstName = name.split(" ")[0];
  return `${greeting}, ${firstName} 👋`;
};

const formatDate = () => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
};

const CoursesPage = () => {
  const [courses, setCourses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState("");
  const { userId } = useAuth();
  const today = formatDate();

  const courseColors = [
    "bg-orange-50 border-orange-200",
    "bg-blue-50 border-blue-200",
    "bg-yellow-50 border-yellow-200",
    "bg-green-50 border-green-200",
    "bg-indigo-50 border-indigo-200",
  ];

  useEffect(() => {
    const fetchUserAndNotes = async () => {
      if (!userId) return;

      try {
        const [userResponse, notesResponse] = await Promise.all([
          axios.get(`/api/getUserStatus?userId=${userId}`),
          axios.get("/api/getNotes")
        ]);

        setUserName(userResponse.data.name || "Guest");

        const notesData = notesResponse.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const groupedNotes = notesData.reduce((acc, note) => {
          if (!acc[note.className]) {
            acc[note.className] = [];
          }
          acc[note.className].push(note);
          return acc;
        }, {});

        setCourses(groupedNotes);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchUserAndNotes();
  }, [userId]);

  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);

  const handleDeleteClick = (courseName) => {
    setCourseToDelete(courseName);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/deleteCourse?userId=${userId}&courseName=${encodeURIComponent(courseToDelete)}`);
      setCourses(prevCourses => {
        const newCourses = { ...prevCourses };
        delete newCourses[courseToDelete];
        return newCourses;
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course. Please try again.");
    } finally {
      setIsDeleteModalOpen(false);
      setCourseToDelete("");
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setCourseToDelete("");
  };

  if (isError) {
    return <div className="text-center text-red-500 mt-8">Error loading courses and notes</div>;
  }

  return (
    <div className="bg-[#f4f4f4] min-h-screen font-['MD_Grotesk_Regular']">
      <div className="max-w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
          <div className="flex flex-col items-start mb-4 sm:mb-0">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 mb-2">
              <ArrowLeft className="mr-2" size={20} />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl sm:text-3xl font-bold text-gray-900 mt-2">
              {getGreeting(userName)}
            </h1>
            <p className="text-gray-500 mt-2 text-xl">{today}</p>
          </div>
          <div className="flex items-center space-x-4">
            <CreateNoteDialog open={isDialogOpen} onClose={handleDialogClose} />
          </div>
        </div>
        <Separator className="mb-6" />
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white h-64 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(courses).map(([courseName, notes], index) => (
              <div key={courseName} className={`${courseColors[index % courseColors.length]} rounded-lg p-6 shadow-sm border`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">{courseName}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(courseName)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                {notes.map((note) => (
                  <Link href={`/notebook/${note.id}`} key={note.id}>
                    <div className="bg-white rounded-md m-2 p-3 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-10 flex-shrink-0">
                          <Image
                            src={note.imageUrl || "/placeholder-image.jpg"}
                            alt={note.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 truncate">{note.name}</h3>
                          <p className="text-xs text-gray-500">{new Date(note.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {note.understoodPercentage !== null
                          ? `${note.understoodPercentage}%`
                          : "Not tested"}
                      </div>
                    </div>
                  </Link>
                ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              <Button variant="ghost" size="icon" onClick={handleDeleteCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="mb-4">
              Are you sure you want to delete the course "{courseToDelete}" and all its associated notes? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleDeleteCancel}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;