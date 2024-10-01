"use client";
import React, { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Brain, TrendingUp, AlertTriangle, BarChart2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import QuizPopup from "@/components/QuizPopup";
import Link from "next/link";

const LearningReport = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cognitiveProfile, setCognitiveProfile] = useState({
    overallScore: 7.5,
    strengths: ["Problem solving", "Focus duration", "Learning adaptability"],
    weaknesses: ["Stress management", "Multitasking"],
    growthAreas: ["Consistent routines", "Regular breaks"],
    mindMap: {
      creativity: 0.8,
      logic: 0.9,
      memory: 0.7,
      attention: 0.6,
      emotion: 0.75
    }
  });

  const handleQuizSubmit = (result) => {
    setCognitiveProfile(prevProfile => ({
      ...prevProfile,
      overallScore: result.cognitiveLoadCapacity,
    }));
  };

  const MindMapVisualization = () => {
    const areas = Object.keys(cognitiveProfile.mindMap);
    const values = Object.values(cognitiveProfile.mindMap);
    const numPoints = areas.length;
    const angleStep = (Math.PI * 2) / numPoints;

    return (
      <div className="relative w-full h-64">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Background circles */}
          <circle cx="100" cy="100" r="80" fill="none" stroke={isDarkMode ? "#4B5563" : "#E5E7EB"} strokeWidth="0.5" />
          <circle cx="100" cy="100" r="60" fill="none" stroke={isDarkMode ? "#4B5563" : "#E5E7EB"} strokeWidth="0.5" />
          <circle cx="100" cy="100" r="40" fill="none" stroke={isDarkMode ? "#4B5563" : "#E5E7EB"} strokeWidth="0.5" />
          <circle cx="100" cy="100" r="20" fill="none" stroke={isDarkMode ? "#4B5563" : "#E5E7EB"} strokeWidth="0.5" />

          {/* Data points and lines */}
          <path
            d={values.map((value, index) => {
              const angle = angleStep * index - Math.PI / 2;
              const x = 100 + Math.cos(angle) * value * 80;
              const y = 100 + Math.sin(angle) * value * 80;
              return (index === 0 ? 'M' : 'L') + `${x},${y}`;
            }).join(' ') + 'Z'}
            fill="rgba(16, 185, 129, 0.2)"
            stroke="rgb(16, 185, 129)"
            strokeWidth="2"
          />

          {/* Axis lines and labels */}
          {areas.map((area, index) => {
            const angle = angleStep * index - Math.PI / 2;
            const x = 100 + Math.cos(angle) * 90;
            const y = 100 + Math.sin(angle) * 90;
            const labelX = 100 + Math.cos(angle) * 100;
            const labelY = 100 + Math.sin(angle) * 100;
            const adjustedLabelY = labelY < 100 ? labelY + 5 : labelY - 5; // Adjust the Y position of the labels
            return (
              <g key={area}>
                <line x1="100" y1="100" x2={x} y2={y} stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} strokeWidth="0.5" />
                <text x={labelX} y={adjustedLabelY} textAnchor="middle" dominantBaseline="middle" fill={isDarkMode ? "#D1D5DB" : "#4B5563"} fontSize="8">
                  {area}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className={`min-h-screen font-['MD_Grotesk_Regular'] bg-[#f4f4f4] text-gray-900`}>
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard" className="flex items-center text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold">Cognitive Profile Dashboard</h1>
          <div className="flex items-center space-x-4">
            <UserButton />
          </div>
        </div>
        <Separator className="mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-lg p-6`}>
            <h2 className="text-2xl font-semibold mb-4 flex items-center"><Brain className="mr-2 text-green-700" /> Strengths</h2>
            <ul className="list-disc pl-5">
              {cognitiveProfile.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
          
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-lg p-6`}>
            <h2 className="text-2xl font-semibold mb-4 flex items-center"><AlertTriangle className="mr-2 text-green-700" /> Improvement</h2>
            <ul className="list-disc pl-5">
              {cognitiveProfile.weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </div>
          
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-lg p-6`}>
            <h2 className="text-2xl font-semibold mb-4 flex items-center"><TrendingUp className="mr-2 text-green-700" /> Growth</h2>
            <ul className="list-disc pl-5">
              {cognitiveProfile.growthAreas.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>
          
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-lg p-6`}>
            <h2 className="text-2xl font-semibold mb-4 flex items-center"><BarChart2 className="mr-2 text-green-700" /> Mind Map</h2>
            <MindMapVisualization />
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsQuizOpen(true)}
            className="bg-green-800 text-white py-3 px-6 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300"
          >
            Retake Cognitive Assessment
          </button>
        </div>
      </div>
      <Dialog open={isQuizOpen} onOpenChange={setIsQuizOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <QuizPopup onClose={() => setIsQuizOpen(false)} onSubmit={handleQuizSubmit} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LearningReport;
