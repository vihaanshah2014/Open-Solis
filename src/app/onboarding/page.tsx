"use client";
import { useState, useRef } from 'react';
import Image from "next/legacy/image";
import Link from 'next/link';
import OnboardingImage from '@/assets/images/cloud.jpg';
import { Loader2, Frown, Meh, Smile } from "lucide-react";
import ProjectionChart from '@/components/ProjectionChart';
import ReactMarkdown from 'react-markdown';


const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    grade: '',
    school: '',
    hobbies: '',
    studyTimes: Array(7).fill(Array(24).fill(false)), // 7 days, 24 hours each
    studyEnjoyment: '',
    procrastinator: '',
    socialLearner: '',
    learningScale: '',
    thinkingType: '',
    learningType: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // Store feedback from API
  const [scores, setScores] = useState(null); // Store scores from API
  const isDragging = useRef(false);
  const dragState = useRef({ day: null, hour: null, status: null });

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

  const handleFaceChange = (e) => {
    setFormData({ ...formData, studyEnjoyment: e.target.value });
  };

  const handleCalendarClick = (day, hour) => {
    const updatedStudyTimes = formData.studyTimes.map((d, dayIndex) =>
      dayIndex === day ? d.map((h, hourIndex) => hourIndex === hour ? !h : h) : d
    );
    setFormData({ ...formData, studyTimes: updatedStudyTimes });
  };

  const handleCalendarDragStart = (day, hour) => {
    if (day === null || hour === null) return;
    isDragging.current = true;
    dragState.current = { day, hour, status: !formData.studyTimes[day][hour] };
    updateStudyTime(day, hour, dragState.current.status);
  };

  const handleCalendarDragEnter = (day, hour) => {
    if (isDragging.current) {
      updateStudyTime(day, hour, dragState.current.status);
    }
  };

  const handleCalendarDragEnd = () => {
    isDragging.current = false;
    dragState.current = { day: null, hour: null, status: null };
  };

  const updateStudyTime = (day, hour, status) => {
    const updatedStudyTimes = formData.studyTimes.map((d, dayIndex) =>
      dayIndex === day ? d.map((h, hourIndex) => hourIndex === hour ? status : h) : d
    );
    setFormData({ ...formData, studyTimes: updatedStudyTimes });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setScores(data.scores); // Set the scores to display
        setFeedback(data.feedback); // Set the feedback to display
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
      prompt: 'Welcome aboard Solis! 🚀',
      input: false,
    },
    {
      prompt: 'Part 1: Basic Information',
      inputs: [
        { name: 'name', placeholder: 'Full Name', suggestion: 'Please enter your full name.' },
        { name: 'age', placeholder: 'Age', suggestion: 'Please enter your age.', type: 'number' },
        { name: 'gender', placeholder: 'Gender', suggestion: 'Please enter your gender.' },
        { name: 'grade', placeholder: 'Grade', suggestion: 'Please enter your grade.' },
        { name: 'school', placeholder: 'School', suggestion: 'Please enter your school.' },
      ]
    },
    {
      prompt: 'Part 2: Study Habits',
      inputs: [
        { name: 'hobbies', placeholder: 'List hobbies', suggestion: 'Share a few of your hobbies.' },
        { name: 'procrastinator', placeholder: 'Do you often delay tasks?', suggestion: 'Do you procrastinate studying?', type: 'select', options: ['Yes', 'No', 'Sometimes'] },
      ],
      faces: {
        prompt: 'Rate how you enjoy studying',
        suggestion: 'Do you like studying?',
        name: 'studyEnjoyment'
      }
    },
    {
      prompt: 'Part 3: Learning Preferences',
      inputs: [
        { name: 'socialLearner', placeholder: 'Do you learn best in social settings?', suggestion: 'Indicate if you prefer studying with others people around you. 1 being no, 5 being yes', type: 'radio', options: ['1', '2', '3', '4', '5'] },
        { name: 'thinkingType', placeholder: 'Problem-solving approach', suggestion: 'Are you more logical or creative in solving problems? 1 being more logical, 5 being more creative', type: 'radio', options: ['1', '2', '3', '4', '5'] },
        { name: 'learningType', placeholder: 'Learning style', suggestion: 'Do you prefer conceptual or factual information? 1 being more conceptual, 5 being more factual', type: 'radio', options: ['1', '2', '3', '4', '5'] },
      ]
    },
    {
      prompt: 'Part 4: Weekly Study Schedule',
      inputs: [],
      calendar: true,
    },
    {
      prompt: 'Your Personalized Feedback',
      input: false,
      feedback: true,
    }
  ];

  const progress = Math.min((step / (steps.length - 1)) * 100, 100);

  return (
    <div className="relative overflow-hidden text-white min-h-screen">
      <div className="absolute inset-0">
        <Image
          src={OnboardingImage}
          alt="Onboarding Background"
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
            <div className="relative w-full h-2 bg-gray-200 rounded-full mb-8">
              <div className="absolute top-0 left-0 h-full bg-black rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <h2 className="text-3xl text-white mb-8">{steps[step].prompt}</h2>
            {steps[step].inputs && (
              <form onSubmit={handleNext} className="space-y-6">
                {steps[step].inputs.map((input, idx) => (
                  <div key={idx} className="rounded-md shadow-sm -space-y-px">
                    {input.type === 'select' ? (
                      <select
                        name={input.name}
                        value={formData[input.name]}
                        onChange={handleChange}
                        required
                        className="appearance-none bg-transparent rounded-none relative block w-full px-3 py-2 border-b placeholder-gray-200 text-white focus:outline-none focus:ring-white focus:border-white focus:z-10 sm:text-sm"
                      >
                        <option value="" disabled>{input.placeholder}</option>
                        {input.options.map((option, optIdx) => (
                          <option className='text-black' key={optIdx} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : input.type === 'radio' ? (
                      <div className="flex space-x-4">
                        {input.options.map((option, optIdx) => (
                          <label key={optIdx} className="flex flex-col items-center">
                            <input
                              type="radio"
                              name={input.name}
                              value={option}
                              onChange={handleChange}
                              className="hidden"
                            />
                            <span
                              className={`w-10 h-10 cursor-pointer flex items-center justify-center border ${formData[input.name] === option ? 'border-black bg-black text-white' : 'border-gray-400 text-gray-400'}`}
                            >
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        type={input.type || 'text'}
                        name={input.name}
                        value={formData[input.name]}
                        onChange={handleChange}
                        required
                        className="appearance-none bg-transparent rounded-none relative block w-full px-3 py-2 border-b placeholder-gray-200 text-white focus:outline-none focus:ring-white focus:border-white focus:z-10 sm:text-sm"
                        placeholder={input.placeholder}
                      />
                    )}
                    {input.suggestion && (
                      <p className="text-sm text-gray-200 mb-4">{input.suggestion}</p>
                    )}
                  </div>
                ))}
                {steps[step].faces && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-200 mb-4">{steps[step].faces.suggestion}</p>
                    <div className="flex justify-between">
                      {[...Array(5)].map((_, i) => {
                        let Icon;
                        if (i === 0 || i == 1) Icon = Frown;
                        else if (i === 2) Icon = Meh;
                        else Icon = Smile;
                        const color = i === 0 ? 'text-red-500' : i == 1 ? "text-yellow-500" : i === 2 ? 'text-yellow-400' : i === 3 ? 'text-green-300' : 'text-green-400';

                        return (
                          <label key={i} className="flex flex-col items-center">
                            <input
                              type="radio"
                              name={steps[step].faces.name}
                              value={i + 1}
                              onChange={handleFaceChange}
                              className="hidden"
                            />
                            <Icon
                              className={`w-10 h-10 cursor-pointer ${color} ${formData[steps[step].faces.name] == i + 1 ? 'opacity-100' : 'opacity-50'}`}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
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
            {!steps[step].inputs && step !== steps.length - 1 && (
              <div>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Start
                  {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                </button>
              </div>
            )}
            {step === steps.length - 1 && scores && feedback && (
              <div className="text-center max-w-4xl mx-auto">
                <h3 className="text-3xl text-white mb-6">Your Results</h3>
                
                {/* Learning Score Projection Chart */}
                <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-6">
                  <h4 className="text-xl text-white mb-4">Learning Score Projection</h4>
                  <ProjectionChart scores={scores} />
                </div>

                {/* Detailed Scores */}
                <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-6">
                  <h4 className="text-xl text-white mb-4">Detailed Scores</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <div>
                      <p className="text-sm text-gray-400">Total Mental Score</p>
                      <p className="text-2xl text-gray-200">{scores.totalScore}</p>
                    </div> */}
                    <div>
                      <p className="text-sm text-gray-400">Learning Potential</p>
                      <p className="text-2xl text-gray-200">{scores.learningPotential}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Learning Score Projection</p>
                      <p className="text-2xl text-gray-200">{scores.learningScoreProjection}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                  <h4 className="text-xl text-white mb-4 text-center">Feedback</h4>
                  <ReactMarkdown 
                    className="text-gray-200 text-left"
                    components={{
                      p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                      h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-2" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-2" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2" {...props} />,
                      a: ({node, ...props}) => <a className="text-blue-400 hover:underline" {...props} />,
                    }}
                  >
                    {feedback}
                  </ReactMarkdown>
                </div>

                <Link 
                  href="/dashboard"
                  className="mt-4 inline-block px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-150 ease-in-out"
                >
                  Join Solis
                </Link>
              </div>
            )}
            {step === steps.length - 1 && !feedback && (
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
          {step === 4 && (
            <div className="text-white">
              <h3 className="text-lg mb-4">Weekly Study Schedule</h3>
              <div
                className="grid grid-cols-8 gap-2 text-center text-sm select-none"
                onMouseDown={() => handleCalendarDragStart(dragState.current.day, dragState.current.hour)}
                onMouseUp={() => handleCalendarDragEnd()}
                onMouseLeave={() => handleCalendarDragEnd()}
              >
                <div></div>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                  <div key={idx} className="font-bold select-none">{day}</div>
                ))}
                {[...Array(24)].map((_, hour) => {
                  const displayHour = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;
                  return (
                    <>
                      <div key={`hour-${hour}`} className="font-bold select-none">{displayHour}</div>
                      {formData.studyTimes.map((day, dayIdx) => (
                        <div
                          key={`day-${dayIdx}-hour-${hour}`}
                          className={`p-2 cursor-pointer ${day[hour] ? 'bg-green-500' : 'bg-gray-500'}`}
                          onMouseDown={() => handleCalendarDragStart(dayIdx, hour)}
                          onMouseEnter={() => handleCalendarDragEnter(dayIdx, hour)}
                        >
                        </div>
                      ))}
                    </>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
