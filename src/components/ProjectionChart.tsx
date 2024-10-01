import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProjectionChart = ({ scores }) => {
  console.log("projection chart got", scores);

  // Calculate weeks to reach projection
  const weeksToReachProjection = 5.5 - (scores.totalScore / 100 * 2.5);
  
  // Function to add controlled randomness
  const addNoise = (baseValue, week, maxNoise) => {
    const halfPoint = weeksToReachProjection / 2;
    const variabilityFactor = week < halfPoint ? 1 : (weeksToReachProjection - week) / halfPoint;
    const noise = (Math.random() - 0.5) * maxNoise * variabilityFactor;
    return baseValue + noise;
  };

  // Create data points with controlled variability
  const solidData = [];
  const steps = 20; // Increase steps for smoother curve
  const maxNoise = 10 - (scores.totalScore / 10); // Less noise for higher scores

  for (let i = 0; i <= steps; i++) {
    const week = (weeksToReachProjection / steps) * i;
    const baseScore = scores.learningPotential + ((scores.learningScoreProjection - scores.learningPotential) / steps) * i;
    const score = addNoise(baseScore, week, maxNoise);
    solidData.push({ week, score: Math.max(scores.learningPotential, Math.min(scores.learningScoreProjection, score)) });
  }

  // Ensure the last point matches the projected score
  solidData[solidData.length - 1].score = scores.learningScoreProjection;

  // Create data points for the dotted line (extension to 6 weeks)
  const dottedData = [
    { week: weeksToReachProjection, score: scores.learningScoreProjection },
    { week: 6, score: scores.learningScoreProjection }
  ];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
          <XAxis 
            dataKey="week" 
            stroke="#E5E7EB" 
            label={{ value: 'Weeks', position: 'insideBottom', offset: -15 }}
            domain={[0, 6]}
            ticks={[0, 1, 2, 3, 4, 5, 6]}
            type="number"
          />
          <YAxis 
            stroke="#E5E7EB" 
            label={{ value: 'Score', angle: -90, position: 'insideLeft' }} 
            domain={[0, 100]}
          />
          <Tooltip 
            formatter={(value, name) => [Math.round(value), name === 'score' ? 'Projected Score' : name]}
            labelFormatter={(label) => `Week ${Math.round(label * 10) / 10}`}
          />
          <Line 
            data={solidData}
            type="monotone" 
            dataKey="score" 
            stroke="#10B981" 
            strokeWidth={2} 
            dot={false}
          />
          <Line 
            data={dottedData}
            type="monotone" 
            dataKey="score" 
            stroke="#10B981" 
            strokeWidth={2} 
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectionChart;