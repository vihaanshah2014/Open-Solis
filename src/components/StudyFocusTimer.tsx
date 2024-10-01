"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Timer, PauseCircle, PlayCircle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TIMER_KEY = 'study_focus_timer_state';

const StudyFocusTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem(TIMER_KEY));
    if (savedState) {
      const { timeLeft: savedTimeLeft, isActive: savedIsActive, sessionCount: savedSessionCount, lastUpdated } = savedState;
      const elapsedTime = Math.floor((Date.now() - lastUpdated) / 1000);
      
      let newTimeLeft = savedTimeLeft;
      if (savedIsActive) {
        newTimeLeft = Math.max(savedTimeLeft - elapsedTime, 0);
        setIsActive(true);
        startTimeRef.current = Date.now() - ((savedTimeLeft - newTimeLeft) * 1000);
      }
      
      setTimeLeft(newTimeLeft);
      setSessionCount(savedSessionCount);
    }
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      startTimeRef.current = startTimeRef.current || Date.now() - ((25 * 60 - timeLeft) * 1000);
      intervalRef.current = setInterval(updateTimer, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      clearInterval(intervalRef.current);
    }

    localStorage.setItem(TIMER_KEY, JSON.stringify({
      timeLeft,
      isActive,
      sessionCount,
      lastUpdated: Date.now()
    }));

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, sessionCount]);

  const updateTimer = () => {
    const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const newTimeLeft = Math.max(25 * 60 - elapsedSeconds, 0);
    setTimeLeft(newTimeLeft);

    if (newTimeLeft === 0) {
      handleTimerComplete();
    }
  };

  const handleTimerComplete = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setSessionCount(prevCount => prevCount + 1);
    setTimeLeft(25 * 60);
    startTimeRef.current = null;
  };

  const toggleTimer = () => {
    if (!isActive && timeLeft < 25 * 60) {
      startTimeRef.current = Date.now() - ((25 * 60 - timeLeft) * 1000);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setTimeLeft(25 * 60);
    startTimeRef.current = null;
    setSessionCount(0);
    localStorage.removeItem(TIMER_KEY);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full p-4">
      <motion.h3 
        className="text-lg font-semibold flex items-center mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Timer className="mr-2" /> Study Focus Timer
      </motion.h3>
      
      <div className="flex-grow flex flex-col justify-center items-center space-y-6">
        <div className="text-5xl font-bold text-center">
          {formatTime(timeLeft)}
        </div>
        
        <div className="flex justify-center space-x-4">
          <motion.button 
            onClick={toggleTimer}
            className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isActive ? "pause" : "play"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isActive ? <PauseCircle size={40} /> : <PlayCircle size={40} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
          <motion.button 
            onClick={resetTimer}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={40} />
          </motion.button>
        </div>
        
        <p className="text-center text-gray-600 text-lg">
          Completed sessions: {sessionCount}
        </p>
      </div>
      
      <motion.div 
        className="text-sm text-gray-500 mt-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <p>Use the Pomodoro Technique to boost your productivity:</p>
        <ul className="list-disc list-inside mt-2">
          <li>Study for 25 minutes</li>
          <li>Take a 5-minute break</li>
          <li>After 4 sessions, take a longer 15-30 minute break</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default StudyFocusTimer;