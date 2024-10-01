'use client';

import React, { useEffect } from 'react';
import Image from "next/image";
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { AlertCircle, ShieldOff, Smile, Brain } from 'lucide-react';
import Socrates from '@/assets/images/socrates.jpeg';

const AnimatedListItem = ({ icon: Icon, children, index }) => {
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
    <motion.li
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={itemVariants}
      className="flex items-center"
    >
      <Icon className={`mr-2 ${Icon === AlertCircle ? 'text-red-600' : 
                               Icon === ShieldOff ? 'text-orange-600' : 
                               Icon === Smile ? 'text-green-700' : 
                               'text-pink-500'}`} 
           size={24} />
      {children}
    </motion.li>
  );
};

const Why = () => {
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

  return (
    <section className="relative z-10 py-20 bg-gray-200 mt-12">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="container mx-auto flex flex-col md:flex-row items-center md:w-3/4 w-full px-4"
      >
        <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8">
          <motion.h2 
            variants={textVariants}
            className="text-4xl font-bold mb-2 text-gray-900"
          >
            Why We Are Building This
          </motion.h2>
          <motion.h3 
            variants={textVariants}
            className="text-xl mb-6 text-gray-500"
          >
            and why you should care
          </motion.h3>
          <ul className="list-none text-lg text-gray-900 space-y-4">
            <AnimatedListItem icon={AlertCircle} index={0}>
              Attention spans are decreasing
            </AnimatedListItem>
            <AnimatedListItem icon={ShieldOff} index={1}>
              It's easier than ever to cheat
            </AnimatedListItem>
            <AnimatedListItem icon={Smile} index={2}>
              So why not make studying easy and effective, and in a way... fun
            </AnimatedListItem>
            <AnimatedListItem icon={Brain} index={3}>
              We use AI to know how you learn, so you can learn anything in 3 minutes
            </AnimatedListItem>
          </ul>
        </div>
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <motion.div 
            variants={imageVariants}
            className="rounded-lg overflow-hidden border-4 border-gray-900"
          >
            <Image
              src={Socrates}
              alt="Socrates"
              width={550}
              height={550}
              className="object-cover"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Why;