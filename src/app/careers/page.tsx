import React from 'react';
import Image from 'next/image';
import Header from '@/components/home_page/Header';
import NYC from '@/assets/images/reach.jpeg';

const Careers = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center p-4 font-['MD_Grotesk_Regular']">
        <div className="max-w-5xl w-full p-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-8">Careers at Solis</h1>
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
              At <strong>Solis</strong>, we're revolutionizing education with AI. We're looking for dreamers who are passionate about making a difference.
            </p>
            <p className="leading-relaxed">
              Join our team of educators, technologists, researchers, and creatives. Help us create personalized and engaging learning experiences for students around the world.
            </p>
            <p className="leading-relaxed">
              If you're innovative, driven, and ready to change the world, we want to hear from you!
            </p>
          </div>
          <div className="mt-8">
            <p className="text-lg text-gray-700">Calling all dreamers!</p>
            <p className="text-lg text-gray-700">
              Email your resume and your biggest dream to <a href="mailto:dream@solis.eco" className="text-blue-500">dream@solis.eco</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
