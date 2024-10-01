"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Percy from '../assets/images/aristotle.webp';
import MarkdownIt from 'markdown-it';
import { Loader } from "lucide-react";

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

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [showSuggestedQuestions, setShowSuggestedQuestions] = useState(true); // State to manage visibility
  const messagesEndRef = useRef<HTMLDivElement>(null);

// Suggested questions bank related to learning
const questionsBank = [
  "Can you explain the Pythagorean theorem?",
  "What are the different stages of photosynthesis?",
  "How does the human brain process information?",
  "What are the key principles of effective studying?",
  "Can you provide a summary of World War II?",
  "What are some strategies to improve memory retention?",
  "How does the water cycle work?",
  "What is the significance of Newton's laws of motion?",
  "Can you explain the concept of supply and demand in economics?",
  "What are the benefits of learning a new language?",
  "How do cells divide during mitosis and meiosis?",
  "What is the theory of evolution by natural selection?",
  "What are the basic concepts of quantum mechanics?",
  "How does climate change affect biodiversity?",
  "What are the causes and effects of the Industrial Revolution?",
  "What are the differences between classical and operant conditioning?",
  "Can you explain the structure of DNA?",
  "What are the main components of a computer system?",
  "How does blockchain technology work?",
  "What is the significance of the Magna Carta in history?",
  "Can you explain the principles of relativity?",
  "What are some effective time management strategies for students?",
  "How do vaccines work to protect against diseases?",
  "What is the role of mitochondria in cells?",
  "How does the electoral college system work in the United States?",
  "Can you explain how gravity affects planetary motion?",
  "What are the key elements of a persuasive essay?",
  "What is the difference between renewable and non-renewable energy?",
  "How do literary themes contribute to a story's meaning?",
  "What are the major theories of motivation in psychology?",
  "How does artificial intelligence learn from data?",
  "What is the function of enzymes in the body?",
  "Can you describe the process of protein synthesis?",
  "What are the effects of globalization on local cultures?",
  "How do different economic systems (capitalism, socialism) compare?",
  "What are the key milestones in human cognitive development?",
  "Can you explain the concept of opportunity cost in economics?",
  "How does the internet work, and what are its main components?",
  "What are the principles of good nutrition and a balanced diet?",
  "What is the role of the United Nations in maintaining global peace?",
  "How does photosynthesis contribute to the Earth's carbon cycle?",
  "What are the fundamental concepts of ethics in philosophy?",
  "Can you explain the Big Bang theory of the universe's origin?",
  "What are the benefits and challenges of online learning?",
  "How do literary devices like metaphors and similes enhance writing?",
  "What are the main functions of the circulatory system?",
  "Can you describe the different types of government systems?",
  "How does social media impact communication and society?",
  "What are the primary causes and consequences of the Great Depression?",
  "What is the significance of the Renaissance in European history?"
];


  // Function to rotate suggested questions
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
      setShowSuggestedQuestions(false); // Hide suggested questions after sending the first message
      const newMessage = { sender: 'user', content: userInput };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput('');

      // Add a temporary loading message
      const loadingMessage = { sender: 'bot', content: 'Loading', loading: true };
      setMessages((prevMessages) => [...prevMessages, loadingMessage]);

      const conversationHistory = messages
        .map((message) => `${message.sender}: ${message.content}`)
        .join('\n');

      try {
        const response = await fetch('/api/percy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            prompt: userInput, 
            prevContext: conversationHistory 
          }),
        });

        if (response.ok) {
          const data = await response.text();
          console.log('Response:', data);

          // Handle the response based on its type
          let botResponse;
          try {
            const parsedData = JSON.parse(data);
            botResponse = { sender: 'bot', content: parsedData.response };
          } catch (error) {
            // If the response is not JSON, treat it as plain text
            botResponse = { sender: 'bot', content: data };
          }

          // Replace the loading message with the actual response
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = botResponse;
            return updatedMessages;
          });
        } else {
          console.error('Error:', response.statusText);
          // Remove the loading message and display the error message
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            {
              sender: 'bot',
              content: 'Percy is sleeping right now, come back soon 😴',
              error: true,
            },
          ]);
        }
      } catch (error) {
        console.error('Error:', error);
        // Remove the loading message and display the error message
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1),
          {
            sender: 'bot',
            content: 'Percy is sleeping right now, come back soon 😴',
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
    <div className="h-96 flex flex-col bg-white text-white rounded p-4">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 mr-4 rounded-full overflow-hidden">
          <Image src={Percy} alt="Percy" width={48} height={48} className="object-cover" />
        </div>
        <div>
          <h2 className="text-xl text-black font-bold">Aristotle</h2>
          <span className="text-gray-400">Your Go-To Personal Assistant for Quick Answers</span>
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
          {/* {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={(e) => handleSend(e, question)}
              className="flex-1 bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600 transition-colors text-sm"
            >
              {question}
            </button>
          ))} */}
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