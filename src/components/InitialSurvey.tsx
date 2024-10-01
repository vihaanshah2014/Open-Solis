import React, { useState } from 'react';
import axios from 'axios';
import { X, Loader2 } from 'lucide-react';
import Cloud from "@/assets/images/cloud.jpg"; // Adjust the path as necessary

interface SurveyProps {
  onComplete: () => void;
  onClose: () => void;
}

const InitialSurvey: React.FC<SurveyProps> = ({ onComplete, onClose }) => {
  const [name, setName] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [hoursOfSleep, setHoursOfSleep] = useState('');
  const [hoursOfStudy, setHoursOfStudy] = useState('');
  const [studyFrequency, setStudyFrequency] = useState('');
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

// src/components/InitialSurvey.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    console.log("Submitting data:", { name, hobbies, hoursOfSleep, hoursOfStudy, studyFrequency, surveyNumber: 1, subscriptionType: 'free'});
    
    const updateResponse = await axios.post('/api/updateUser', { 
      name, 
      hobbies, 
      hoursOfSleep, 
      hoursOfStudy, 
      studyFrequency, 
      surveyNumber: 1, 
      subscriptionType: 'free'
    });
    
    console.log("Update response:", updateResponse.data);

    const analyzeResponse = await axios.post('/api/analyzeCognitiveLoad', { hoursOfSleep, hoursOfStudy, studyFrequency });
    console.log("Analyze response:", analyzeResponse.data);

    await axios.post('/api/updateUser', { mentalStudyScoreCode: analyzeResponse.data.cognitiveLoadCapacity });

    onComplete();
  } catch (error) {
    console.error('Error updating user:', error);
    console.error('Error details:', error.response?.data);
  } finally {
    setIsLoading(false);
  }
};

  const handleClose = () => {
    setShowCloseWarning(true);
  };

  const confirmClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-2xl relative">
        {!showCloseWarning && (
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        )}
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome aboard! 🚀</h2>
        <p className="text-gray-600 mb-6">Let's personalize your experience. Tell us a bit about yourself:</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
          <div>
            <label htmlFor="hobbies" className="block text-sm font-medium text-gray-700 mb-1">Your Hobbies</label>
            <textarea
              id="hobbies"
              value={hobbies}
              onChange={(e) => setHobbies(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="hoursOfSleep" className="block text-sm font-medium text-gray-700 mb-1">Hours of Sleep</label>
              <input
                type="number"
                id="hoursOfSleep"
                value={hoursOfSleep}
                onChange={(e) => setHoursOfSleep(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
            <div>
              <label htmlFor="hoursOfStudy" className="block text-sm font-medium text-gray-700 mb-1">Hours of Study</label>
              <input
                type="number"
                id="hoursOfStudy"
                value={hoursOfStudy}
                onChange={(e) => setHoursOfStudy(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="studyFrequency" className="block text-sm font-medium text-gray-700 mb-1">Study Frequency</label>
            <select
              id="studyFrequency"
              value={studyFrequency}
              onChange={(e) => setStudyFrequency(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            >
              <option value="">Select</option>
              <option value="Daily">Daily</option>
              <option value="Several times a week">Several times a week</option>
              <option value="Weekly">Weekly</option>
              <option value="Occasionally">Occasionally</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition flex items-center justify-center"
            style={{
              backgroundImage: `url(${Cloud.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: 'white'
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : null}
            {isLoading ? 'Processing' : "Let's Get Started"}
          </button>
        </form>
        <p className="text-sm text-orange-500 mt-6 italic">
          Note: You can update this information later in your profile settings.
        </p>
      </div>
      {showCloseWarning && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4 text-red-600">Warning</h3>
            <p className="text-gray-700 mb-6">
              Not completing the survey will limit your experience with our platform. Are you sure you want to skip?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCloseWarning(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Go Back
              </button>
              <button
                onClick={confirmClose}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Skip Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InitialSurvey;