import React from 'react';

const CircularLogoLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default CircularLogoLoader;