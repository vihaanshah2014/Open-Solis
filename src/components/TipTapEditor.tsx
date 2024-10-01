import React, { useState, useEffect } from "react";
import Editor from "@/components/notebook/Editor";
import NotesQuiz from "@/components/notebook/NotesQuiz";
// import Flashcards from "@/components/notebook/Flashcards";
import { NoteType } from "@/lib/db/schema";

type Props = {
  note: NoteType;
  onEditorInit: (editor: any) => void;
};

const TipTapEditor: React.FC<Props> = ({ note, onEditorInit }) => {
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isFlashcardActive, setFlashcardsActive] = useState(false);
  const [editor, setEditor] = useState<any>(null); // Add this line to hold the editor instance

  const createQuiz = async () => {
    if (!editor) {
      console.error("Editor is not initialized");
      return;
    }

    setIsLoading(true);
    try {
      const userResponse = await fetch("/api/getUser");
      const userData = await userResponse.json();

      const coursesResponse = await fetch("/api/getCourses");
      const coursesData = await coursesResponse.json();

      const topicsUnderstoodPercentage = coursesData.map(
        (course) => course.topicsUnderstoodPercentage
      );

      const response = await fetch("/api/createQuiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: editor.getText(),
          inputType: "notes",
          userId: userData.id,
          mentalStudyScoreCode: userData.mentalStudyScoreCode,
          hobbies: userData.hobbies,
          topicsUnderstoodPercentage: topicsUnderstoodPercentage,
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
            setQuizData(data);
            setIsQuizActive(true);
          } else {
            console.error("No valid JSON found in the response");
          }
        } catch (error) {
          console.error("Error parsing response data:", error);
        }
      } else {
        console.error("Quiz creation failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  const handleEditorInit = (editorInstance: any) => {
    console.log("Editor initialized:", editorInstance);
    setEditor(editorInstance);
    onEditorInit(editorInstance);
  };

  return (
    <>
      <div className={`relative ${isQuizActive || isFlashcardActive ? "blur-sm" : ""} max-w-5xl`}>
        <Editor note={note} onEditorInit={handleEditorInit} createQuiz={createQuiz} />
      </div>
      {editor && (
        <>
        {/* <div className= {`${(isQuizActive) ? "blur-sm" : ""} `}>
        <Flashcards editor={editor} note={note} setFlashcardsActive={setFlashcardsActive} />
        </div> */}
          
        
          <NotesQuiz
            note={note}
            editor={editor}
            isQuizActive={isQuizActive}
            setIsQuizActive={setIsQuizActive}
            quizData={quizData}
            setQuizData={setQuizData}
          />
        </>
      )}
    </>
  );
};

export default TipTapEditor;
