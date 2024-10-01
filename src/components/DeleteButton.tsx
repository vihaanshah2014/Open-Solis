"use client";
import React from "react";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type Props = {
  noteId: number;
};

const DeleteButton = ({ noteId }: Props) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  
  const deleteNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/deleteNote", { noteId });
      return response.data;
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <button
          className="bg-transparent border-none cursor-pointer"
          onClick={() => setOpen(true)}
        >
          Delete Note
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle>Delete Note</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this note? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="bg-white text-black border-black hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={deleteNote.isLoading}
            onClick={() => {
              deleteNote.mutate(undefined, {
                onSuccess: () => {
                  setOpen(false);
                  router.push("/dashboard");
                },
                onError: (err) => {
                  console.error(err);
                },
              });
            }}
            className="bg-black text-white hover:bg-red-800"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteButton;
