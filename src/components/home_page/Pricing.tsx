'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import FamilyImage from '@/assets/images/touch.jpeg';

const AnimatedTableRow = ({ item, index }) => {
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

  const rowVariants = {
    hidden: { opacity: 0, x: -50 },
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
    <motion.tr
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={rowVariants}
    >
      <td className="py-2 flex items-center">
        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        {item.name}
      </td>
      <td className="py-2 text-right">{item.price}</td>
    </motion.tr>
  );
};

const Pricing: React.FC = () => {
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

  const pricingItems = [
    { name: 'Personalized learning plans', price: '$500' },
    { name: 'Expert-led courses', price: '$300' },
    { name: 'Study analytics and insights', price: '$200' },
    { name: '24/7 Tutoring support', price: '$100' },
  ];

  return (
    <div className="bg-gray-100 flex items-center justify-center mt-12 mb-12">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="flex flex-col md:flex-row rounded-lg overflow-hidden md:w-3/4 w-full"
      >
        <motion.div 
          variants={imageVariants}
          className="w-full md:w-1/2 max-h-[500px] overflow-hidden"
        >
          <Image
            src={FamilyImage}
            alt="Family image"
            layout="responsive"
            width={500}
            height={500}
          />
        </motion.div>
        <div className="w-full md:w-1/2 p-8">
          <motion.h2 
            variants={textVariants}
            className="text-3xl font-bold mb-6"
          >
            Invest in your education
          </motion.h2>
          <table className="w-full mb-4 text-base">
            <thead>
              <motion.tr variants={textVariants}>
                <th className="text-left font-normal text-lg">Solis covers</th>
                <th className="text-right font-normal text-lg">Cost on your own*</th>
              </motion.tr>
            </thead>
            <tbody>
              {pricingItems.map((item, index) => (
                <AnimatedTableRow key={index} item={item} index={index} />
              ))}
            </tbody>
          </table>
          <motion.div 
            variants={textVariants}
            className="flex justify-between items-center border-t border-gray-200 pt-4"
          >
            <span className="font-bold text-lg">Total cost</span>
            <div className="text-right">
              <div className="bg-black text-white px-3 py-1 rounded font-bold mb-1 text-base">$9/month</div>
              <div className="text-xl font-bold">$1,100</div>
            </div>
          </motion.div>
          <motion.p 
            variants={textVariants}
            className="text-sm text-gray-500 mt-3"
          >
            *Based on average industry prices as of June 2024.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Pricing;