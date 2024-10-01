'use client';

import { useEffect } from 'react';
import { User, Activity, Award } from 'lucide-react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Monet from '@/assets/images/waitlist.jpg';

const StepItem = ({ icon: Icon, title, description, index }) => {
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
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        delay: index * 0.2,
        ease: 'easeOut' 
      } 
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={controls}
      className="text-center"
    >
      <motion.div 
        className="h-48 mb-4 flex items-center justify-center rounded-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="text-white" size={48} />
      </motion.div>
      <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-white">{description}</p>
    </motion.div>
  );
};

const HowItWorksSection = () => {
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

  const backgroundVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: 'easeOut' } },
  };

  return (
    <section className="relative z-10 py-20 bg-gray-200 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2
          ref={ref}
          variants={titleVariants}
          initial="hidden"
          animate={controls}
          className="text-4xl font-bold mb-8 text-gray-900 text-center"
        >
          How Solis Works
        </motion.h2>
        <div className="relative rounded-lg overflow-hidden">
          <motion.div
            variants={backgroundVariants}
            initial="hidden"
            animate="visible"
            className="absolute inset-0 z-0 rounded-lg overflow-hidden"
          >
            <Image
              src={Monet}
              alt="Background"
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div>
          </motion.div>
          <div className="relative z-10 py-20 px-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepItem
                icon={User}
                title="1. Understand Your Learning Style"
                description="Solis analyzes your learning patterns and preferences to create a personalized learning profile."
                index={0}
              />
              <StepItem
                icon={Activity}
                title="2. Adaptive Learning Paths"
                description="Based on your profile, Solis generates adaptive learning paths that optimize your learning experience."
                index={1}
              />
              <StepItem
                icon={Award}
                title="3. Achieve Your Goals"
                description="With personalized support and powerful tools, Solis helps you achieve better grades and expand your knowledge."
                index={2}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;