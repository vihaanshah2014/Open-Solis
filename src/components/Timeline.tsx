"use client";

import React from 'react';
import { ChevronRight, Lock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Timeline: React.FC = () => {
  return (
    <div className="relative bg-white text-black font-['MD_Grotesk_Regular'] py-4 overflow-hidden min-h-[400px]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Schedule Link */}
        <div className="flex justify-between items-center mb-4">
          <Link href="/planner" className="group flex items-center cursor-pointer">
            <motion.h2 
              className="text-xl md:text-2xl font-bold group-hover:text-green-700 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Schedule
            </motion.h2>
            <motion.div
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ChevronRight className="ml-1 w-5 h-5 text-gray-400 group-hover:text-green-700 transition-colors" />
            </motion.div>
          </Link>
        </div>

        {/* Container for Adding AI to Schedule */}
        <div className="relative flex justify-center items-center min-h-[300px]">
          {/* Animated Background Circles */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
            animate={{ opacity: 0.2, scale: 1, rotate: 360 }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute w-64 h-64 bg-green-500 rounded-full"
            style={{ filter: "blur(100px)", top: "30%", left: "25%" }}
          ></motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
            animate={{ opacity: 0.2, scale: 1, rotate: -360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute w-80 h-80 bg-blue-500 rounded-full"
            style={{ filter: "blur(150px)", top: "50%", right: "20%" }}
          ></motion.div>
          {/* Additional Animated Elements */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 0.1, y: -50 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute w-40 h-40 bg-purple-500 rounded-full"
            style={{ filter: "blur(100px)", top: "60%", left: "40%" }}
          ></motion.div>
          
          {/* New Colorful Animated Elements */}
          <motion.div
            initial={{ opacity: 0, x: -100, y: -100 }}
            animate={{ opacity: 0.15, x: 100, y: 100 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute w-56 h-56 bg-yellow-400 rounded-full"
            style={{ filter: "blur(80px)", top: "20%", left: "10%" }}
          ></motion.div>
          <motion.div
            initial={{ opacity: 0, x: 100, y: 100 }}
            animate={{ opacity: 0.15, x: -100, y: -100 }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute w-48 h-48 bg-pink-500 rounded-full"
            style={{ filter: "blur(90px)", bottom: "10%", right: "15%" }}
          ></motion.div>
          
          {/* Button for Adding AI to Schedule with Enhanced Hover Animation */}
          <motion.button
            whileHover={{ 
              scale: 1.1, 
              boxShadow: "0px 0px 15px rgba(0, 255, 0, 0.5)",
              backgroundColor: "#16a34a" // A brighter green
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 500,
              damping: 25
            }}
            className="flex items-center px-6 py-3 bg-green-700 text-white rounded-full shadow-md hover:bg-green-800 transition-all duration-300 z-10"
          >
            <Lock className="w-5 h-5 mr-2" />

            Add AI to your schedule
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Timeline;