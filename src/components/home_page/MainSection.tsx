'use client';

import React, { useEffect } from 'react';
import Image from "next/image";
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DemoImage from '@/assets/images/demo.png';
import Glare from '@/assets/images/glare.png';
import Ipad from '@/assets/images/ipad.png';

const MainSection = () => {
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

  const buttonVariants = {
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

  const ipadVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: 'easeOut' 
      } 
    },
  };

  const bgCircleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 0.1, 
      scale: 1, 
      transition: { 
        duration: 1, 
        ease: 'easeOut' 
      } 
    },
  };

  return (
    <motion.main
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden bg-gray-100 font-['MD_Grotesk_Regular']"
    >
      {/* Background circles */}
      <motion.div 
        variants={bgCircleVariants}
        className="absolute top-20 left-20 w-64 h-64 bg-green-300 rounded-full filter blur-3xl opacity-10"
      />
      <motion.div 
        variants={bgCircleVariants}
        className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl opacity-10"
      />

      <motion.h1 
        variants={textVariants}
        className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 mt-32"
      >
        Unlock Your <span className="text-green-700">Learning Potential</span>
      </motion.h1>
      <motion.p 
        variants={textVariants}
        className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl"
      >
        Solis is the ultimate app that adapts to your unique learning style. Boost your grades, expand your knowledge, and become a master of any subject.
      </motion.p>
      <div className="flex flex-col md:flex-row md:space-x-6 mb-10">
        <motion.div variants={buttonVariants}>
          <Link href="/waitlist">
            <Button className="bg-black text-white px-8 py-4 rounded-md mb-6 md:mb-0 text-xl">
              Get early access
            </Button>
          </Link>
        </motion.div>
        <motion.div variants={buttonVariants}>
          <Link href="/why-solis">
            <Button className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 px-8 py-4 rounded-md text-xl">
              Why Solis? 🧠💡
            </Button>
          </Link>
        </motion.div>
      </div>
      <motion.div 
        variants={ipadVariants}
        className="relative mt-24 w-full max-w-6xl mx-auto"
      >
        <div className="relative mx-auto w-[90%] md:w-[80%] lg:w-[70%]">
          <Image
            src={Ipad}
            alt="iPad Frame"
            layout="responsive"
            className="block"
          />
          <div className="absolute inset-[5%] w-[90%] h-[90%] flex items-center justify-center">
            <Image
              src={DemoImage}
              alt="Demo"
              layout="responsive"
              className="rounded-lg"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute inset-0 pointer-events-none rounded-lg"
            >
              <Image
                src={Glare}
                alt="Glare"
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.main>
  );
};

export default MainSection;