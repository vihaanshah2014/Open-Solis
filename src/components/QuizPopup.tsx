"use client";
import React, { useState } from "react";
import axios from "axios";

const QuizPopup = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    morningRoutine: '',
    todoList: '',
    multitasking: '',
    stressResponse: '',
    problemSolving: '',
    learningNewSkills: '',
    focusDuration: '',
    breakFrequency: '',
    eveningWindDown: '',
    sleepQuality: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('/api/analyzeCognitiveLoad', formData);
      onSubmit(response.data);
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Habits Survey</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {[
          { id: 'morningRoutine', question: 'Do you have a consistent morning routine?', type: 'select', options: ['Yes, very consistent', 'Somewhat consistent', 'Not really consistent', 'No routine at all'] },
          { id: 'todoList', question: 'How often do you make to-do lists?', type: 'select', options: ['Daily', 'Few times a week', 'Occasionally', 'Rarely or never'] },
          { id: 'multitasking', question: 'How comfortable are you with multitasking?', type: 'select', options: ['Very comfortable', 'Somewhat comfortable', 'Prefer to focus on one task', 'Avoid multitasking'] },
          { id: 'stressResponse', question: 'How do you typically respond to stress?', type: 'select', options: ['Take action immediately', 'Plan and then act', 'Become overwhelmed', 'Avoid the stressor'] },
          { id: 'problemSolving', question: 'When faced with a complex problem, you usually:', type: 'select', options: ['Break it down into smaller parts', 'Research extensively', 'Ask for help', 'Feel overwhelmed'] },
          { id: 'learningNewSkills', question: 'How often do you attempt to learn new skills?', type: 'select', options: ['Very often', 'Sometimes', 'Rarely', 'Almost never'] },
          { id: 'focusDuration', question: 'How long can you typically focus on a task without a break?', type: 'select', options: ['More than 2 hours', '1-2 hours', '30 minutes to 1 hour', 'Less than 30 minutes'] },
          { id: 'breakFrequency', question: 'How often do you take breaks during work or study?', type: 'select', options: ['Every 30 minutes', 'Every hour', 'Every few hours', 'Rarely take breaks'] },
          { id: 'eveningWindDown', question: 'Do you have an evening routine to wind down?', type: 'select', options: ['Yes, consistently', 'Sometimes', 'Rarely', 'No routine'] },
          { id: 'sleepQuality', question: 'How would you rate your overall sleep quality?', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Poor'] },
        ].map((field) => (
          <div key={field.id}>
            <label className="block text-lg font-medium text-gray-700 mb-2" htmlFor={field.id}>
              {field.question}
            </label>
            <select 
              id={field.id} 
              value={formData[field.id]} 
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            >
              <option value="">Select...</option>
              {field.options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}

        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default QuizPopup;