"use client";
import React from "react";
import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type DeleteButtonProps = {
  className: string;
};

const DeleteButton: React.FC<DeleteButtonProps> = ({ className }) => {
  const [open, setOpen] = React.useState(false);

  const handleDelete = async () => {
    await db.delete($notes).where(eq($notes.className, className));
    // Refresh the page or update the UI accordingly
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="mt-4 bg-white text-black hover:bg-gray-200">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle>Delete Notes</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete all notes in the "{className}" class? This action cannot be undone.
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
            onClick={() => {
              handleDelete();
              setOpen(false);
            }}
            className="bg-black text-white hover:bg-gray-800"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteButton;
