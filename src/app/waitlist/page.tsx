"use client";
import { useState } from 'react';
import Image from "next/legacy/image";
import WaitlistImage from '@/assets/images/waitlist.jpg';
import { Loader2 } from "lucide-react";

const Waitlist = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    grade: '',
    reason: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = (e) => {
    e.preventDefault();
    if (step < steps.length - 2) {
      setLoading(true);
      const delay = Math.random() * 1000; // Random delay between 0 and 1 second
      setTimeout(() => {
        setStep(step + 1);
        setLoading(false);
      }, delay);
    } else {
      handleSubmit();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Thank you for joining the waitlist. We will reach out to you soon.');
        setStep(step + 1);
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  const steps = [
    {
      prompt: 'Join the Waitlist to access Solis',
      input: false,
    },
    {
      prompt: 'what is your name?',
      input: true,
      name: 'name',
      placeholder: 'Aristotle',
      suggestion: 'Please enter your full name.'
    },
    {
      prompt: 'what is your email?',
      input: true,
      name: 'email',
      placeholder: 'aristotle@solis.eco',
      suggestion: 'Enter a valid email address.'
    },
    {
      prompt: 'what school do you attend?',
      input: true,
      name: 'school',
      placeholder: 'Plato\'s Academy',
      suggestion: ''
    },
    {
      prompt: 'what grade are you in?',
      input: true,
      name: 'grade',
      placeholder: 'Type your answer here...',
      suggestion: ''
    },
    {
      prompt: 'why should you get a lifetime of free Solis access?',
      input: true,
      name: 'reason',
      placeholder: 'Type your answer here...',
      suggestion: 'You don\'t have to answer if you don\'t like free.'
    },
    {
      prompt: 'Thank you for joining the waitlist. We will reach out to you soon.',
      input: false,
    }
  ];

  return (
    <div className="relative overflow-hidden text-white min-h-screen">
      <div className="absolute inset-0">
        <Image
          src={WaitlistImage}
          alt="Waitlist Background"
          layout="fill"
          objectFit="cover"
          objectPosition="top"
          quality={100}
        />
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      <div className="relative max-w-2xl mx-auto z-10 min-h-screen flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8 font-[Space]">
        <div className="w-full rounded-lg p-8">
          <div className="mb-8">
            <h2 className="text-3xl text-white mb-8">{steps[step].prompt}</h2>
            {steps[step].suggestion && (
              <p className="text-sm text-gray-200 mb-4">{steps[step].suggestion}</p>
            )}
            {!steps[step].input && step !== steps.length - 1 && (
              <div>
              <button
                onClick={handleNext}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Start
                {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              </button>
              <p className='mt-5 text-gray-300'>It will take around <b>30 seconds</b></p>

              </div>
            )}
          </div>
          {steps[step].input && (
            <form onSubmit={handleNext} className="space-y-6">
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                <input
                  type={steps[step].name === 'email' ? 'email' : 'text'}
                  name={steps[step].name}
                  value={formData[steps[step].name]}
                  onChange={handleChange}
                  required={steps[step].name !== 'reason'}
                  className="appearance-none bg-transparent rounded-none relative block w-full px-3 py-2 border-b placeholder-gray-200 text-white focus:outline-none focus:ring-white focus:border-white focus:z-10 sm:text-sm"
                  placeholder={steps[step].placeholder}
                />
                </div>
              </div>
              <div className="flex justify-between">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="text-white hover:text-gray-200 focus:outline-none focus:underline"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className="group relative px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  {step === steps.length - 2 ? 'Submit' : 'Next'}
                  {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                </button>
              </div>
            </form>
          )}
          {step === steps.length - 1 && (
            <div className="text-center">
              <p className="mt-4 text-white">{message}</p>
              <a
                href="https://solis.eco"
                className="mt-4 inline-block px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Go back to Solis.eco
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Waitlist;
