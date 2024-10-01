"use client";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Star, Pencil, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FlashcardsProps = {
  notes: string;
  noteId: number;
  noteFlashCards: { question: string; answer: string }[];
};

const Flashcards: React.FC<FlashcardsProps> = ({ notes, noteId, noteFlashCards }) => {
  const [flashcards, setFlashcards] = useState(noteFlashCards || []);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [favorites, setFavorite] = useState([]);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedAnswer, setEditedAnswer] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery(
    ["flashcards", noteId],
    async () => {
      const response = await axios.get(`/api/flashcards?noteId=${noteId}`);
      return response.data;
    },
    {
      enabled: !!noteId,
      onSuccess: (data) => {
        if (data.notecards && data.notecards.length > 0) {
          setFlashcards(data.notecards);
        } else {
          console.log("No flashcards found for this note.");
        }

        if (data.favorites) {
          setFavorite(data.favorites);
        }
      },
    }
  );

  const createFlashcards = useMutation({
    mutationFn: async () => {
      if (!notes || typeof notes !== "string" || notes.trim() === "") {
        throw new Error("Notes are null, not a string, or empty");
      }
      console.log("Sending notes to server:", notes);

      const response = await axios.post("/api/createFlashcards", {
        prompt: notes,
        inputType: "notes",
      });

      return response.data;
    },
    onSuccess: (data) => {
      if (data.flashcards) {
        setFlashcards(data.flashcards);
      } else {
        console.error("No flashcards found in the response");
      }
    },
    onError: (error) => {
      console.error("Error creating flashcards:", error);
    },
  });

  const saveNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/flashcards", {
        notecards: flashcards,
        favorites: favorites,
        queryKey: noteId,
      });
      return response.data;
    },
    onSuccess: () => {
      console.log("Note saved successfully");
    },
    onError: (error) => {
      console.error("Error saving note:", error);
    },
  });

  const handleCreateFlashcards = () => {
    setIsLoading(true);
    createFlashcards.mutate(undefined, {
      onSuccess: () => {
        setIsLoading(false);
      },
      onError: (error) => {
        setIsLoading(false);
        console.error(error.message);
      },
    });
  };

  const handleSaveNote = () => {
    saveNote.mutate();
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setIsFlipped(false);
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleFavorite = () => {
    const currentFlashcard = flashcards[currentCardIndex];
    if (favorites.includes(currentFlashcard)) {
      setFavorite(favorites.filter((card) => card !== currentFlashcard));
    } else {
      setFavorite((prevFavorites) => [...prevFavorites, currentFlashcard]);
    }
  };

  const handleEditing = () => {
    setIsEditing(true);
    if (isFlipped) {
      setEditedAnswer(flashcards[currentCardIndex].answer);
    } else {
      setEditedQuestion(flashcards[currentCardIndex].question);
    }
  };

  const handleSubmit = () => {
    let updatedFlashcards = [...flashcards];

    if (isFlipped) {
      updatedFlashcards[currentCardIndex].answer = editedAnswer;
    } else {
      updatedFlashcards[currentCardIndex].question = editedQuestion;
    }

    setFlashcards(updatedFlashcards);
    setIsEditing(false);
  };

  const handleAddFlashcard = () => {
    const newFlashcard = { question: "New Question", answer: "New Answer" };
    setFlashcards([...flashcards, newFlashcard]);
  };

  const handleRemoveFlashcard = (index) => {
    const updatedFlashcards = flashcards.filter((_, i) => i !== index);
    setFlashcards(updatedFlashcards);
    if (currentCardIndex >= updatedFlashcards.length) {
      setCurrentCardIndex(updatedFlashcards.length - 1);
    }
  };

  return (
    <div className="sticky top-0 h-[calc(100vh-4rem)] w-full flex flex-col bg-white text-black rounded p-4 overflow-y-auto">
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl w-full flex flex-col items-center">
          {flashcards.length === 0 ? (
            <button
              onClick={handleCreateFlashcards}
              disabled={isLoading}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 mt-4"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Flashcards
                </div>
              ) : (
                "Create Flashcards"
              )}
            </button>
          ) : (
            <>
              <button
                onClick={handleSaveNote}
                className="w-full md:w-1/3 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 mb-4"
              >
                Save Note
              </button>

              {!isEditing ? (
                <motion.div
                  className="w-full max-w-lg h-96 mt-8 p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center perspective relative"
                  onClick={handleFlip}
                >
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      key={isFlipped ? "back" : "front"}
                      className="absolute w-full h-full flex items-center justify-center"
                      initial={{ rotateY: isFlipped ? -180 : 0, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: isFlipped ? 0 : 180, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <p className="text-3xl font-medium text-center">
                        {isFlipped
                          ? flashcards[currentCardIndex].answer
                          : flashcards[currentCardIndex].question}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                  {/* Favorite and Edit Buttons */}
                  <div
                    className="absolute top-2 right-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavorite();
                    }}
                  >
                    <Star
                      fill={
                        favorites.includes(flashcards[currentCardIndex])
                          ? "yellow"
                          : "white"
                      }
                    />
                  </div>
                  <div
                    className="absolute top-2 left-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditing();
                    }}
                  >
                    <Pencil />
                  </div>
                </motion.div>
              ) : (
                // Edit Mode
                <div className="w-full max-w-lg h-96 mt-8 p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center">
                  <textarea
                    value={isFlipped ? editedAnswer : editedQuestion}
                    onChange={(e) =>
                      isFlipped
                        ? setEditedAnswer(e.target.value)
                        : setEditedQuestion(e.target.value)
                    }
                    className="text-3xl w-full h-full font-medium text-center resize-none border-0 focus:outline-none"
                  />
                  <button
                    onClick={handleSubmit}
                    className="mt-4 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    Submit
                  </button>
                </div>
              )}

              {/* Controls */}
              <div className="flex flex-col items-center mt-4 w-full max-w-lg">
                <div className="flex justify-between w-full mb-2">
                  <button
                    onClick={handlePreviousCard}
                    className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    Previous Card
                  </button>
                  <button
                    onClick={handleNextCard}
                    className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    Next Card
                  </button>
                </div>
                <button
                  onClick={() => setIsListOpen(!isListOpen)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 mt-2"
                >
                  {isListOpen ? "Hide Flashcards List" : "Show Flashcards List"}
                </button>
              </div>

              {/* Flashcards List */}
              {isListOpen && (
                <div className="w-full max-w-lg mt-4 bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-medium mb-2">Flashcards ({flashcards.length})</h3>
                  <ul className="space-y-2">
                    {flashcards.map((card, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span className="truncate w-3/4">{card.question}</span>
                        <button
                          onClick={() => handleRemoveFlashcard(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Minus size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={handleAddFlashcard}
                    className="mt-4 flex items-center justify-center w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    <Plus size={16} className="mr-2" /> Add Flashcard
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flashcards;