import React from 'react';
import Image from 'next/image';
import Header from '@/components/home_page/Header';
import NYC from '@/assets/images/nyc.jpg';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center p-4 font-['MD_Grotesk_Regular']">
        <div className="max-w-5xl w-full p-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-8">About Solis</h1>
          <div className="mb-8">
            <Image
              src={NYC}
              alt="New York City"
              className="rounded-lg w-full object-cover h-96"
              placeholder="blur"
            />
          </div>
          <div className="space-y-6 text-lg text-gray-700">
            <p className="leading-relaxed">
              <strong>Solis</strong> is a cutting-edge educational platform designed to revolutionize the way we learn. Our mission is to <strong>harness the power of artificial intelligence (AI)</strong> to create personalized and engaging learning experiences that captivate students and reignite their love for knowledge.
            </p>
            <p className="leading-relaxed">
              In an era where <strong>attention spans are dwindling</strong>, a study by Microsoft found that the average human attention span has dropped to <strong>8 seconds</strong>, shorter than that of a goldfish (8 seconds) <sup>[1]</sup>. This trend poses significant challenges for educators and learners alike.
            </p>
            <p className="leading-relaxed">
              At Solis, we believe that <strong>technology, particularly AI, holds the key to reversing this trend</strong>. Our application leverages <strong>advanced algorithms and machine learning techniques</strong> to create personalized learning experiences that engage students, making education more interactive, adaptive, and effective.
            </p>
            <p className="leading-relaxed">
              Our <strong>AI-driven approach</strong> not only adapts to the individual learning pace of each student but also identifies areas where they might be struggling, offering <strong>targeted support and guidance</strong> to help them succeed. A study by Nesta found that AI-powered personalized learning can lead to <strong>improved academic performance and higher student engagement</strong> <sup>[2]</sup>.
            </p>
            <p className="leading-relaxed">
              At Solis, we are committed to <strong>continuous innovation and improvement</strong>, collaborating with educators and researchers to stay at the forefront of educational technology. Thank you for choosing us as your partner in learning. If you have any questions or need further information, please feel free to reach out. Together, we can make learning a more enjoyable and fruitful experience.
            </p>
          </div>
          <div className="mt-8">
            <p className="text-sm">
              <sup>[1]</sup> Microsoft (2015). Attention Spans. Retrieved from https://www.statisticbrain.com/attention-span-statistics/
            </p>
            <p className="text-sm">
              <sup>[2]</sup> Nesta (2019). Educ-AI-tion Rebooted? Exploring the future of artificial intelligence in schools and colleges. Retrieved from https://www.nesta.org.uk/report/educ-ai-prising/
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;