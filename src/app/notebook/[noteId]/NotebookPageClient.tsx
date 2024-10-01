'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NoteType } from '@/lib/db/schema';
import TipTapMenuBar from '@/components/TipTapMenuBar';

// Dynamic imports for components
const DeleteButton = dynamic(() => import('@/components/DeleteButton'), { ssr: false });
const TipTapEditor = dynamic(() => import('@/components/TipTapEditor'), { ssr: false });
const QuizCreator = dynamic(() => import('@/components/QuizCreator'), { ssr: false });
const Chatbot = dynamic(() => import('@/components/NotebookChatbot'), { ssr: false });
const Flashcards = dynamic(() => import('@/components/notebook/Flashcards'), { ssr: false });
const NotesQuiz = dynamic(() => import('@/components/notebook/NotesQuiz'), { ssr: false });

type Props = {
  user: { firstName: string; lastName: string };
  note: NoteType;
};

const NotebookPageClient = ({ user, note }: Props) => {
  const [extractedText, setExtractedText] = useState<string>('');
  const [editor, setEditor] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false); 
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState<boolean>(false);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);

  const handleTextExtracted = (text: string) => {
    setExtractedText(text);
  };

  const handleEditorInit = (editor) => {
    setEditor(editor);
  };

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const toggleFlashcards = () => {
    setIsFlashcardsOpen(!isFlashcardsOpen);
  };

  const toggleQuiz = () => {
    setIsQuizOpen(!isQuizOpen);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <header className="bg-white border-b border-stone-200 p-4 flex items-center justify-between md:hidden">
        <div className="flex items-center">
          <Link href="/dashboard">
            <Button className="bg-black" size="sm">
              Back
            </Button>
          </Link>
          <div className="ml-4">
            <span className="font-semibold text-gray-400">
              {user.firstName} {user.lastName}
            </span>
            <span className="inline-block mx-1">/</span>
            <span className="text-black font-semibold">{note.name}</span>
          </div>
        </div>
        <DeleteButton noteId={note.id} />
      </header>

      {/* Sidebar for Desktop */}
      <div className="hidden md:block md:w-64 bg-gray-100 md:border-r border-stone-200 p-8 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center mb-4">
          <Link href="/dashboard">
            <Button className="bg-black" size="sm">
              Back
            </Button>
          </Link>
          <div className="ml-4">
            <span className="font-semibold text-gray-400">
              {user.firstName} {user.lastName}
            </span>
            <span className="inline-block mx-1">/</span>
            <span className="text-black font-semibold">{note.name}</span>
          </div>
        </div>
        <div className="mt-8">{editor && <TipTapMenuBar editor={editor} />}</div>
        <div className="mt-auto">
          <DeleteButton noteId={note.id} />
          <Button className="bg-black mt-4" size="sm" onClick={toggleChatbot}>
            {isChatbotOpen ? 'Close Chatbot' : 'Open Chatbot'}
          </Button>
          <Button className="bg-gray-900 mt-4" size="sm" onClick={toggleFlashcards}>
            {isFlashcardsOpen ? 'Close Flashcards' : 'Open Flashcards'}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 flex">
        <div className={`max-w-5xl mx-auto ${isChatbotOpen || isFlashcardsOpen || isQuizOpen ? 'w-1/2' : 'w-full'} transition-width duration-300`}>
          <div className="bg-white px-4 md:px-16 py-8 h-full w-full">
            <TipTapEditor note={note} onEditorInit={handleEditorInit} />
          </div>
        </div>
        {isChatbotOpen && (
          <div className="w-1/2 p-4 border-l-2 border-gray-300">
            <Chatbot note={note.editorState} extractedText={extractedText} />
          </div>
        )}
        {isFlashcardsOpen && (
          <div className="w-1/2 p-4 border-l-2 border-gray-300">
            <Flashcards notes={note.editorState} noteId={note.id} noteFlashCards={note.notecards} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotebookPageClient;
