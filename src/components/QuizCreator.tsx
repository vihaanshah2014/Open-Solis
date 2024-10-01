import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const QuizCreator = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const createQuiz = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/createQuiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: text, inputType: 'studyGuide', difficulty: 'justStarting', trickQuestionChance: 5 }),
      });
      console.log('Response status:', response.status);

      if (response.ok) {
        const responseText = await response.text();
        console.log('Response text:', responseText);
        try {
          const data = JSON.parse(responseText);
          setQuizData(data);
          setUserAnswers({});
          setShowResults(false);
        } catch (error) {
          console.error('Error parsing response data:', error);
        }
      } else {
        console.error('Quiz creation failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  const handleAnswerChange = (questionIndex, subdivisionIndex, topicIndex, choice) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [`${topicIndex}-${subdivisionIndex}-${questionIndex}`]: choice,
    }));
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text to create a quiz"
        rows="4"
        className="w-full p-2 border rounded"
      />
      <Button onClick={createQuiz} disabled={!text || isLoading}>
        {isLoading ? (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Quiz
          </div>
        ) : (
          'Create Quiz'
        )}
      </Button>
      {quizData && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Generated Quiz</h2>
          {quizData.quiz.map((topic, topicIndex) => (
            <div key={topicIndex} className="mt-2">
              <h3 className="text-md font-semibold">{topic.topic}</h3>
              {topic.subdivisions.map((subdivision, subdivisionIndex) => (
                <div key={subdivisionIndex} className="ml-4">
                  <h4 className="text-sm font-medium">{subdivision.subdivision}</h4>
                  {subdivision.questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="ml-4">
                      <p>{question.question}</p>
                      <div className="ml-6 flex flex-col">
                        {question.choices.map((choice, choiceIndex) => (
                          <label key={choiceIndex} className="flex items-center">
                            <input
                              type="radio"
                              name={`${topicIndex}-${subdivisionIndex}-${questionIndex}`}
                              value={choice}
                              checked={userAnswers[`${topicIndex}-${subdivisionIndex}-${questionIndex}`] === choice}
                              onChange={() => handleAnswerChange(questionIndex, subdivisionIndex, topicIndex, choice)}
                              disabled={showResults}
                              className="mr-2"
                            />
                            {choice}
                          </label>
                        ))}
                      </div>
                      {showResults && (
                        <p className={userAnswers[`${topicIndex}-${subdivisionIndex}-${questionIndex}`] === question.answer ? 'text-green-500' : 'text-red-500'}>
                          {userAnswers[`${topicIndex}-${subdivisionIndex}-${questionIndex}`] === question.answer ? 'Correct' : `Incorrect, the correct answer is: ${question.answer}`}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
          {!showResults && <Button onClick={submitQuiz}>Submit Quiz</Button>}
        </div>
      )}
    </div>
  );
};

export default QuizCreator;