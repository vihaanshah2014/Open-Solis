import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Loader2 } from 'lucide-react';

const Flashcards = ({ editor, note, setFlashcardsActive }) => {
  const [flashcardsData, setFlashcardsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const createFlashcards = async () => {
    setIsLoading(true);
    try {
      const userResponse = await fetch("/api/getUser");
      const userData = await userResponse.json();

      const response = await fetch("/api/createFlashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: editor.getText(),
          inputType: "notes",
          userId: userData.id,
        }),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const responseText = await response.text();
        console.log("Response text:", responseText);
        try {
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const jsonString = jsonMatch[0];
            const data = JSON.parse(jsonString);
            setFlashcardsData(data);
            setCurrentFlashcardIndex(0);
            setIsFlipped(false); 
            setFlashcardsActive(true);
          } else {
            console.error("No valid JSON found in the response");
          }
        } catch (error) {
          console.error("Error parsing response data:", error);
        }
      } else {
        console.error("Flashcards creation failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  const handlePreviousFlashcard = () => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex((prevIndex) => prevIndex - 1);
      setIsFlipped(false); 
    }
  };

  const handleNextFlashcard = () => {
    setCurrentFlashcardIndex((prevIndex) =>
      prevIndex < flashcardsData.flashcards.length - 1 ? prevIndex + 1 : prevIndex
    );
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped((prevState) => !prevState);
  };

  return (
    <div>
      <button
        onClick={createFlashcards}
        disabled={isLoading}
        className="mt-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        {isLoading ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Flashcards
          </div>
        ) : (
          "Click to Generate flashcards"
        )}
      </button>
      {flashcardsData && (
        <div className=" mt-4 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Flashcards</h2>
          <div className="flex flex-col items-center">
            <div
              className={`w-full and md:max-w-xl p-4 border border-gray-300 rounded-lg mb-4 cursor-pointer flex items-center flex justify-center ${isFlipped ? 'bg-gray-200' : ''}`}style={{ minHeight: '300px'}}
              onClick={handleFlip}
            >
              <p className="text-xl font-medium mb-2 text-center">
                {isFlipped
                  ? flashcardsData.flashcards[currentFlashcardIndex].answer
                  : flashcardsData.flashcards[currentFlashcardIndex].question}
              </p>
            </div>
            <div className="flex space-x-4">
            <Button
            onClick={() => {
              setFlashcardsActive(false);
              setFlashcardsData(null);
            }}
            className="mt-4"
          >
            Close Flashcards
          </Button>
              <Button
                onClick={handlePreviousFlashcard}
                disabled={currentFlashcardIndex === 0}
                className="mt-4"
              >
                Previous
              </Button>
              <Button
                onClick={handleNextFlashcard}
                className="mt-4"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
