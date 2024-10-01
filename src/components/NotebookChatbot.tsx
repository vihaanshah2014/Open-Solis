"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Aristotle from '../assets/images/aristotle.webp';
import MarkdownIt from 'markdown-it';
import { Loader } from "lucide-react";
import { NoteType } from '@/lib/db/schema';

type Message = {
  sender: 'user' | 'bot';
  content: string;
  loading?: boolean;
  error?: boolean;
};

interface PrettierProps {
  text: string;
}

const md = new MarkdownIt({
  html: true,
  breaks: true,
  typographer: true,
});

const Prettier: React.FC<PrettierProps> = ({ text }) => {
  const formattedText = md.render(text);
  return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
};

type ChatbotProps = {
  note: NoteType; // Ensure note has a valid type
  extractedText: string;
};

const Chatbot: React.FC<ChatbotProps> = ({ note, extractedText }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [showSuggestedQuestions, setShowSuggestedQuestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questionsBank = [
    "Can you summarize this note?",
    "What are the key points from my notes?",
    "How can I improve the structure of my notes?",
    "What should I focus on in this note?",
    "If you were a teacher, what would you test me on?"
  ];

  const rotateQuestions = () => {
    const shuffledQuestions = questionsBank.sort(() => 0.5 - Math.random());
    setSuggestedQuestions(shuffledQuestions.slice(0, 3));
  };

  useEffect(() => {
    rotateQuestions();
  }, [messages]);

  const handleSend = async (e: React.FormEvent, question?: string) => {
    e.preventDefault();
    const userInput = question || input;
    if (userInput.trim()) {
      setShowSuggestedQuestions(false);

      const newMessage = { sender: 'user', content: userInput };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      setInput('');

      const updatedMessages = [...messages, newMessage];

      const conversationHistory = updatedMessages
        .map((message) => `${message.sender}: ${message.content}`)
        .join('\n');

      const loadingMessage = { sender: 'bot', content: 'Loading', loading: true };
      setMessages((prevMessages) => [...prevMessages, loadingMessage]);

      try {
        const response = await fetch('/api/aristotle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: userInput,
            context: conversationHistory,
            note: note,
            extractedText
          }),
        });

        if (response.ok) {
          const data = await response.text();
          console.log('Response:', data);

          let botResponse;
          try {
            const parsedData = JSON.parse(data);
            botResponse = { sender: 'bot', content: parsedData.response };
          } catch (error) {
            botResponse = { sender: 'bot', content: data };
          }

          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = botResponse;
            return updatedMessages;
          });
        } else {
          console.error('Error:', response.statusText);
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            {
              sender: 'bot',
              content: 'Aristotle is sleeping right now, come back soon 😴',
              error: true,
            },
          ]);
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1),
          {
            sender: 'bot',
            content: 'Aristotle is sleeping right now, come back soon 😴',
            error: true,
          },
        ]);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="sticky top-0 h-[calc(100vh-4rem)] flex flex-col bg-white text-white rounded p-4">
      <div className="flex items-center mb-4 border border-gray-300 p-4 rounded-lg bg-gray-50">
        <div className="w-12 h-12 mr-4 rounded-full overflow-hidden">
          <Image src={Aristotle} alt="Aristotle" width={48} height={48} className="object-cover" />
        </div>
        <div>
          <h2 className="text-xl text-black font-bold">Aristotle</h2>
          <span className="text-gray-400">Your personal AI tutor</span>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex my-2 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`px-4 py-2 max-w-[75%] break-words relative ${
                message.sender === 'user'
                  ? 'bg-[#3f3f46] text-white ml-auto rounded-xl rounded-br-none'
                  : message.error
                  ? 'bg-red-500 text-white mr-auto rounded-xl rounded-bl-none'
                  : 'bg-[#e4e4e7] text-black mr-auto rounded-xl rounded-bl-none'
              }`}
            >
              {message.loading ? (
                <div className="flex items-center">
                  <div>Loading </div>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                </div>
              ) : (
                <Prettier text={message.content} />
              )}
              <div
                className={`absolute bottom-0 ${
                  message.sender === 'user' ? 'right-0 border-r-8' : 'left-0 border-l-8'
                } border-b-8 border-transparent ${
                  message.sender === 'user'
                    ? 'border-r-[#3f3f46]'
                    : message.error
                    ? 'border-l-red-500'
                    : 'border-l-[#e4e4e7]'
                }`}
              ></div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {showSuggestedQuestions && (
        <div className="flex space-x-2 mb-4">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={(e) => handleSend(e, question)}
              className="flex-1 bg-gray-200 text-gray-600 rounded px-4 py-2 hover:bg-gray-100 transition-colors shadow-md"
            >
              {question}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSend} className="flex mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 text-black border border-[#3f3f46] rounded px-4 py-2 mr-2"
          placeholder="Ask me anything..."
        />
        <button
          type="submit"
          className={`rounded px-4 py-2 ${
            input.trim() ? 'bg-black hover:bg-gray-800 text-white' : 'bg-gray-600 text-white cursor-not-allowed'
          }`}
          disabled={!input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
