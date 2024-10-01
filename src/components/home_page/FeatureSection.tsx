'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import LearningReport from '@/assets/images/learning_report.png';
import Personalize from '@/assets/images/personalize.jpg';
import Quizes from '@/assets/images/quizes.png';

const FeatureItem = ({ title, description, imageSrc, imageAlt, reversed }) => {
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
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: reversed ? 50 : -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2, ease: 'easeOut' } },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className={`flex flex-col ${
        reversed ? 'md:flex-row-reverse' : 'md:flex-row'
      } items-center md:w-3/4 mx-auto`}
    >
      <div className="md:w-1/2 mb-4 md:mb-0 md:px-8 text-center md:text-left">
        <h3 className="text-2xl font-bold mb-4 text-gray-900">{title}</h3>
        <p className="text-gray-700">{description}</p>
      </div>
      <motion.div className="md:w-1/2 flex justify-center" variants={imageVariants}>
        <div className="w-full md:w-full lg:w-3/4 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={imageSrc}
            alt={imageAlt}
            layout="responsive"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

const FeatureSection = () => {
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

  return (
    <section className="relative z-10 py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          ref={ref}
          variants={titleVariants}
          initial="hidden"
          animate={controls}
          className="text-4xl font-bold mb-12 text-gray-900 text-center"
        >
          Features
        </motion.h2>
        <div className="space-y-20">
          <FeatureItem
            title="Personalized Learning"
            description="Tailored content to fit your unique learning style and pace."
            imageSrc={Personalize}
            imageAlt="Personalized Learning"
            reversed={false}
          />
          <FeatureItem
            title="Interactive Quizzes"
            description="Engaging quizzes to test your knowledge and track your progress."
            imageSrc={Quizes}
            imageAlt="Interactive Quizzes"
            reversed={true}
          />
          <FeatureItem
            title="Progress Tracking"
            description="Monitor your learning journey with detailed analytics and insights."
            imageSrc={LearningReport}
            imageAlt="Learning Report"
            reversed={false}
          />
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;