"use client";
import React, { useState } from 'react';

const ConsentPage: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isChecked) {
      // Proceed with Google integration
      console.log('User consented to integrate with Google.');
    } else {
      alert('You must agree to the terms and services to proceed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Integrate with Google</h2>
        <form onSubmit={handleFormSubmit}>
          <p className="mb-4">
            By connecting your Google Calendar account, you agree to our{' '}
            <a href="https://solis.eco/policy" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
              Terms and Services
            </a>.
          </p>
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="consent"
              className="mr-2"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="consent" className="text-sm">
              I agree to the Terms and Services
            </label>
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded ${
              isChecked ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
            } text-white font-bold transition duration-200`}
            disabled={!isChecked}
          >
            Integrate with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsentPage;
