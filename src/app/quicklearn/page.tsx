"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import City from '@/assets/images/lillies.jpg';
import MarkdownIt from 'markdown-it';
import { Loader2 } from 'lucide-react';

const md = new MarkdownIt();

const Page = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [topic, setTopic] = useState('');
    const [definition, setDefinition] = useState('');
    const [impact, setImpact] = useState('');
    const [negative, setNegative] = useState('');
    const [graph, setGraph] = useState('');
    const [quiz, setQuiz] = useState(null);
    const [finale, setFinale] = useState('');
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleStartLearning = async () => {
        setIsLoading(true);
        const definition = await fetchDefinition(topic);
        setDefinition(definition);
        setIsLoading(false);
        setCurrentPage(1);
    };

    const handleNext = async () => {
        setIsLoading(true);
        switch (currentPage) {
            case 1:
                const impact = await fetchImpact();
                setImpact(impact);
                break;
            case 2:
                const negative = await fetchNegative();
                setNegative(negative);
                break;
            case 3:
                const graph = await fetchGraph();
                setGraph(graph);
                break;
            case 4:
                const quiz = await fetchQuiz();
                setQuiz(quiz);
                break;
            case 5:
                const finale = await fetchFinale();
                setFinale(finale);
                break;
            default:
                break;
        }
        setCurrentPage((prevPage) => prevPage + 1);
        setIsLoading(false);
    };

    const fetchDefinition = async (input) => {
        try {
            const response = await fetch('/api/quicklearn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: input,
                    sysPrompt: "using the prompt, write two definitions in the following format: Definition, Metaphor Definition(a metaphor relating the key parts to a topic/item that can be understood by a 2nd grader)"
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch definition');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let definition = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                definition += decoder.decode(value);
            }

            return definition;
        } catch (error) {
            console.error('Error fetching definition:', error);
            return 'Failed to fetch definition';
        }
    };

    const fetchImpact = async () => {
        try {
            const response = await fetch('/api/quicklearn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: topic,
                    sysPrompt: "Write about the impact of the given topic."
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch impact');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let impact = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                impact += decoder.decode(value);
            }

            return impact;
        } catch (error) {
            console.error('Error fetching impact:', error);
            return 'Failed to fetch impact';
        }
    };

    const fetchNegative = async () => {
        try {
            const response = await fetch('/api/quicklearn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: topic,
                    sysPrompt: "Write about the negative aspects of the given topic if it didn't exist, feel free to include current events that include something like this."
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch negative aspects');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let negative = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                negative += decoder.decode(value);
            }

            return negative;
        } catch (error) {
            console.error('Error fetching negative aspects:', error);
            return 'Failed to fetch negative aspects';
        }
    };

    const fetchGraph = async () => {
        try {
            const response = await fetch('/api/quicklearn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: topic,
                    sysPrompt: "Provide graph data related to the topic."
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch graph data');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let graph = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                graph += decoder.decode(value);
            }

            return graph;
        } catch (error) {
            console.error('Error fetching graph data:', error);
            return 'Failed to fetch graph data';
        }
    };

    const fetchQuiz = async () => {
        try {
            const response = await fetch('/api/createQuiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: topic,
                    inputType: 'topic',
                    difficulty: 'tryMe',
                    trickQuestionChance: 3,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch quiz data');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let quizData = '';
            let insideQuiz = false;
            let openBracesCount = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                
                for (const char of chunk) {
                    if (char === '{') {
                        openBracesCount++;
                        if (openBracesCount === 1) {
                            insideQuiz = true;
                        }
                    }
                    if (insideQuiz) {
                        quizData += char;
                    }
                    if (char === '}') {
                        openBracesCount--;
                        if (openBracesCount === 0) {
                            insideQuiz = false;
                            break;
                        }
                    }
                }
            }

            return JSON.parse(quizData);
        } catch (error) {
            console.error('Error fetching quiz data:', error);
            return 'Failed to fetch quiz data';
        }
    };

    const fetchFinale = async () => {
        try {
            const response = await fetch('/api/quicklearn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: topic,
                    sysPrompt: "Provide a finale summary of the topic."
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch finale data');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let finale = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                finale += decoder.decode(value);
            }

            return finale;
        } catch (error) {
            console.error('Error fetching finale data:', error);
            return 'Failed to fetch finale data';
        }
    };

    const handleAnswerChange = (subdivisionIndex, questionIndex, answer) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [`${subdivisionIndex}-${questionIndex}`]: answer,
        }));
    };

    const handleSubmitQuiz = () => {
        setSubmitted(true);
    };

    const renderQuiz = () => {
        return (
            <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">Quiz</h2>
                {quiz.quiz.map((topicItem, topicIndex) => (
                    <div key={topicIndex}>
                        <h3 className="text-xl font-semibold">{topicItem.topic}</h3>
                        {topicItem.subdivisions.map((subdivision, subdivisionIndex) => (
                            <div key={subdivisionIndex} className="mt-4">
                                <h4 className="text-lg font-medium">{subdivision.subdivision}</h4>
                                {subdivision.questions.map((question, questionIndex) => (
                                    <div key={questionIndex} className="mt-2">
                                        <p>{question.question}</p>
                                        <ul className="mt-2">
                                            {question.choices.map((choice, choiceIndex) => {
                                                const answerKey = `${subdivisionIndex}-${questionIndex}`;
                                                const isCorrect = choice === question.answer;
                                                const isSelected = answers[answerKey] === choice;
                                                const choiceClass = submitted
                                                    ? isCorrect
                                                        ? 'bg-green-200'
                                                        : isSelected
                                                            ? 'bg-red-200'
                                                            : ''
                                                    : '';

                                                return (
                                                    <li key={choiceIndex} className={`${choiceClass} p-1 rounded-md`}>
                                                        <label>
                                                            <input
                                                            className='m-1'
                                                                type="radio"
                                                                name={`question-${subdivisionIndex}-${questionIndex}`}
                                                                value={choice}
                                                                checked={isSelected}
                                                                onChange={() => handleAnswerChange(subdivisionIndex, questionIndex, choice)}
                                                                disabled={submitted}
                                                            />
                                                            {choice}
                                                        </label>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
                <div className="text-center mt-8">
                    {!submitted ? (
                        <button
                            className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition duration-300"
                            onClick={handleSubmitQuiz}
                        >
                            Submit Quiz
                        </button>
                    ) : (
                        <button
                            className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition duration-300"
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center p-8">
                    Loading<Loader2 className="animate-spin h-8 w-8 text-black" />
                </div>
            );
        }

        switch (currentPage) {
            case 0:
                return (
                    <div className="p-8">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="topic" className="block text-gray-700 font-semibold mb-2">
                                    What do you want to learn?
                                </label>
                                <input
                                    type="text"
                                    id="topic"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                                    placeholder="Enter a topic"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                />
                            </div>
                            <div className="text-center">
                                <button
                                    className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition duration-300"
                                    onClick={handleStartLearning}
                                >
                                    Start Learning
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Definition</h2>
                        <div dangerouslySetInnerHTML={{ __html: md.render(definition) }} />
                        <div className="mt-8 text-center">
                            <button
                                className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition duration-300"
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Impact</h2>
                        <div dangerouslySetInnerHTML={{ __html: md.render(impact) }} />
                        <div className="text-center mt-8">
                            <button
                                className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition duration-300"
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Negative</h2>
                        <div dangerouslySetInnerHTML={{ __html: md.render(negative) }} />
                        <div className="text-center mt-8">
                            <button
                                className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition duration-300"
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Graph</h2>
                        <div dangerouslySetInnerHTML={{ __html: md.render(graph) }} />
                        <div className="text-center mt-8">
                            <button
                                className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition duration-300"
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                );
            case 5:
                return renderQuiz();
            case 6:
                return (
                    <div className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Finale</h2>
                        <div dangerouslySetInnerHTML={{ __html: md.render(finale) }} />
                        <div className="text-center mt-8">
                            <Link href="/dashboard">
                                <button className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition duration-300">
                                    Back to Dashboard
                                </button>
                            </Link>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-['MD_Grotesk_Regular']">
            <div className="fixed top-4 left-4">
                <Link href="/dashboard">
                    <button className="px-4 py-2 bg-black text-white rounded-md shadow-md hover:bg-gray-800 transition duration-300">
                        Back
                    </button>
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 overflow-hidden">
                <div className="relative">
                    <Image src={City} alt="New York City" className="w-full h-48 object-cover rounded-t-lg" />
                    <div className="absolute inset-0 bg-black opacity-40 rounded-t-lg"></div>
                    {currentPage === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-white text-2xl font-bold text-center px-8">
                                "Education is the most powerful weapon which you can use to change the world." - Nelson Mandela
                            </p>
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h2 className="text-white text-2xl font-bold text-center px-8">
                                {currentPage === 1 ? '"The roots of education are bitter, but the fruit is sweet." - Aristotle' : 
                                 currentPage === 2 ? '"The more I read, the more I acquire, the more certain I am that I know nothing." - Voltaire' :
                                 currentPage === 3 ? '"An investment in knowledge pays the best interest." - Benjamin Franklin' :
                                 currentPage === 4 ? '"Education is the passport to the future." - Malcolm X' :
                                 currentPage === 5 ? '"Learning never exhausts the mind." - Leonardo da Vinci' :
                                 '"Education is the kindling of a flame, not the filling of a vessel." - Socrates'}
                            </h2>
                        </div>
                    )}
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default Page;
