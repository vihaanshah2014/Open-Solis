"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import axios from "axios";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cloud from "@/assets/images/cloud.jpg";

type Props = {};

const CreateNoteDialog = (props: Props) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [className, setClassName] = React.useState("");
  const [courses, setCourses] = React.useState([]);
  const [selectedCourse, setSelectedCourse] = React.useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/getCourses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const createNotebook = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/createNoteBook", {
        name,
        className: selectedCourse === "new" ? className : selectedCourse,
      });
      return response.data;
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name === "") {
      window.alert("Please enter a name for your notebook");
      return;
    }
    if (selectedCourse === "" && className === "") {
      window.alert("Please enter a class name for your notebook");
      return;
    }
    createNotebook.mutate(undefined, {
      onSuccess: ({ note_id }) => {
        console.log("created new note:", { note_id });
        setOpen(false);
        router.push(`/notebook/${note_id}`);
      },
      onError: (error) => {
        console.error(error);
        window.alert("Failed to create new notebook");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="relative w-44 h-12 overflow-hidden rounded-lg group">
          <button
            className="w-full h-full text-[#706e6f] font-medium transition-colors duration-300 group-hover:text-white"
          >
            <span className="relative z-10">Create new Note</span>
          </button>
          <div 
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              backgroundImage: `url(${Cloud.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black opacity-40"></div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Note Book</DialogTitle>
          <DialogDescription>
            You can create a new note by filling out the form below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Note Name..."
          />
          <div className="h-4"></div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select an existing course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.courseName}>
                {course.courseName}
              </option>
            ))}
            <option value="new">Add new course</option>
          </select>
          {selectedCourse === "new" && (
            <>
              <div className="h-4"></div>
              <Input
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="New Class Name..."
              />
            </>
          )}
          <div className="h-4"></div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gray-900"
              disabled={createNotebook.isLoading}
            >
              {createNotebook.isLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;