'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProfileImage from '@/assets/images/roman.jpeg';

const AnimatedListItem = ({ children, index }) => {
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
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.5, 
        delay: index * 0.1,
        ease: 'easeOut' 
      } 
    },
  };

  return (
    <motion.li
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={itemVariants}
      className="flex justify-between"
    >
      {children}
    </motion.li>
  );
};

const Testimonial: React.FC = () => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.5, 
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: 0.2
      } 
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: 'easeOut' 
      } 
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.5, 
        ease: 'easeOut' 
      } 
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.5, 
        delay: 0.3,
        ease: 'easeOut' 
      } 
    },
  };

  return (
    <div className="bg-gray-100 flex justify-center py-8 mt-12">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="w-full md:w-3/4 flex flex-col md:flex-row items-center md:items-center p-8 rounded-lg shadow-lg bg-white"
      >
        <div className="w-full mb-6 md:mb-0 text-center md:text-left">
          <motion.div 
            variants={textVariants}
            className="flex justify-center md:justify-start items-center mb-4 mt-50"
          >
            <span className="text-yellow-500 text-3xl">★★★★★</span>
          </motion.div>
          <motion.p 
            variants={textVariants}
            className="text-xl lg:text-2xl font-semibold mb-4"
          >
            "I mastered complex topics in just a month with Solis, something I couldn't achieve in years of traditional learning."
          </motion.p>
          <motion.p variants={textVariants} className="text-lg text-gray-700">Alex P.</motion.p>
          <motion.p variants={textVariants} className="text-sm text-gray-500">Solis user (anonymized for privacy)</motion.p>
        </div>
        <div className="md:w-1/2 w-full flex justify-center items-center relative">
          <motion.div variants={imageVariants}>
            <Image 
              src={ProfileImage} 
              alt="Profile image of Alex P." 
              layout="responsive"
              width={300}
              height={400}
              className="rounded-lg"
            />
          </motion.div>
          <motion.div 
            variants={cardVariants}
            className="absolute top-4 left-4 h-fit md:left-auto md:top-48 md:-left-7 bg-white p-4 rounded-lg shadow-2xl md:w-72 w-64"
          >
            <h3 className="text-lg font-bold mb-2">Alex's Solis journey</h3>
            <p className="text-sm mb-2">Outcome: Alex was able to understand and retain information on complex physics subjects, which improved his performance significantly.</p>
            <ul className="text-sm space-y-1">
              <AnimatedListItem index={0}>
                <span>Quantum Mechanics</span> 
                <span className="text-yellow-500">Advanced</span>
              </AnimatedListItem>
              <AnimatedListItem index={1}>
                <span>Electromagnetism</span> 
                <span>Proficient</span>
              </AnimatedListItem>
              <AnimatedListItem index={2}>
                <span>Thermodynamics</span> 
                <span>Proficient</span>
              </AnimatedListItem>
              <AnimatedListItem index={3}>
                <span>Statistical Mechanics</span> 
                <span className="text-green-500">Intermediate</span>
              </AnimatedListItem>
              <AnimatedListItem index={4}>
                <span>General Relativity</span> 
                <span className="text-green-500">Intermediate</span>
              </AnimatedListItem>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Testimonial;