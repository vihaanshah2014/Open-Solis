'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import KhanAcademy from '@/assets/companies/khan_academy.png';
import Quizlet from '@/assets/companies/quizlet.png';

const AnimatedBar = ({ width, color, children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const barVariants = {
    hidden: { width: 0 },
    visible: { width, transition: { duration: 1, ease: 'easeOut' } },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={barVariants}
      className={`h-16 rounded-lg flex items-center justify-end px-6 ${color}`}
    >
      {children}
    </motion.div>
  );
};

const ComparisonItem = ({ logo, percentage, alt }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={itemVariants}
      className="flex flex-col md:flex-row items-start md:items-center h-auto md:h-16"
    >
      <div className="w-full md:w-32 h-16 mb-4 md:mb-0 md:mr-6 flex items-center justify-center">
        {logo ? (
          <div className="relative w-full h-full">
            <Image 
              src={logo} 
              alt={alt} 
              layout="fill"
              objectFit="contain"
            />
          </div>
        ) : (
          <div className="text-2xl font-bold">{alt}</div>
        )}
      </div>
      {alt === "Solis" ? (
        <AnimatedBar width="100%" color="bg-[#76697E]">
          <span className="text-white text-lg">97.8% of your educational data</span>
        </AnimatedBar>
      ) : (
        <>
          <AnimatedBar width={percentage === 15 ? "20%" : "8%"} color="border-2 border-black" />
          <span className="mt-2 md:mt-0 md:ml-6 text-lg">{percentage}% of your educational data</span>
        </>
      )}
    </motion.div>
  );
};

const Insights: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const percentageVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.3, ease: 'easeOut' } },
  };

  return (
    <div className="bg-gray-100">
      <div className="md:w-3/4 w-full px-4 mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 mt-12">
          <motion.h1
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={titleVariants}
            className="text-4xl font-bold mb-4 md:mb-0"
          >
            More data means better educational insights.
          </motion.h1>
          
          <motion.div
            variants={percentageVariants}
            initial="hidden"
            animate={controls}
            className="flex items-end"
          >
            <span className="text-7xl text-green-800 font-bold mr-4">97.8%</span>
            <div className="text-sm">
              <p>of your educational data analyzed with Solis*</p>
              <p className="text-gray-500">*compared to Khan Academy, Quizlet, and similar platforms</p>
            </div>
          </motion.div>
        </div>
        
        <div className="space-y-8 hidden md:block">
          <ComparisonItem logo={null} percentage={97.8} alt="Solis" />
          <ComparisonItem logo={Quizlet} percentage={15} alt="Quizlet" />
          <ComparisonItem logo={KhanAcademy} percentage={10} alt="Khan Academy" />
        </div>
      </div>
    </div>
  );
};

export default Insights;