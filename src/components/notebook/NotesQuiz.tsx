"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

type QuizProps = {
  note: any;
  editor: any;
  isQuizActive: boolean;
  setIsQuizActive: (value: boolean) => void;
  quizData: any;
  setQuizData: (value: any) => void;
};

const NotesQuiz: React.FC<QuizProps> = ({ note, editor, isQuizActive, setIsQuizActive, quizData, setQuizData }) => {
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (questionIndex, choice) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: choice,
    }));
  };

  const submitQuiz = async () => {
    setShowResults(true);
    let correctAnswers = 0;
    const topics = quizData.quiz.map((question) => question.question);
    quizData.quiz.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        correctAnswers += 1;
      }
    });
    const understoodPercentage = Math.round(
      (correctAnswers / quizData.quiz.length) * 100
    );

    try {
      const response = await fetch("/api/updateScore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: note.userId,
          noteId: note.id, // Include note ID
          courseId: note.className,
          topics: topics,
          understoodPercentage: understoodPercentage,
          mentalStudyScoreIncrement: correctAnswers,
        }),
      });

      if (!response.ok) {
        console.error("Failed to update scores");
      }
    } catch (error) {
      console.error("Error updating scores:", error);
    }
  };

  return (
    <>
      {quizData && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Quiz</h2>
          {quizData.quiz.map((question, questionIndex) => (
            <div key={questionIndex} className="mb-6">
              <p className="font-medium mb-2">{question.question}</p>
              <div className="ml-6 flex flex-col space-y-2">
                {question.choices.map((choice, choiceIndex) => (
                  <label key={choiceIndex} className="flex items-center">
                    <input
                      type="radio"
                      name={`${questionIndex}`}
                      value={choice}
                      checked={userAnswers[questionIndex] === choice}
                      onChange={() => handleAnswerChange(questionIndex, choice)}
                      disabled={showResults}
                      className="mr-2"
                    />
                    {choice}
                  </label>
                ))}
              </div>
              {showResults && (
                <p
                  className={`mt-2 ${
                    userAnswers[questionIndex] === question.answer
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {userAnswers[questionIndex] === question.answer
                    ? "Correct"
                    : `Incorrect, the correct answer is: ${question.answer}`}
                </p>
              )}
            </div>
          ))}
          {!showResults && (
            <Button onClick={submitQuiz} className="mt-4">
              Submit Quiz
            </Button>
          )}
          <Button
            onClick={() => {
              setIsQuizActive(false);
              setQuizData(null);
            }}
            className="mt-4 ml-4"
          >
            Close Quiz
          </Button>
        </div>
      )}
    </>
  );
};

export default NotesQuiz;
