import React from 'react';
import Image from 'next/image';

interface LearningCardProps {
    imageSrc: string;
    imageAlt: string;
    quote: string;
    onStartLearning: () => void;
}

const LearningCard: React.FC<LearningCardProps> = ({ imageSrc, imageAlt, quote, onStartLearning }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 overflow-hidden">
            <div className="relative">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black opacity-40 rounded-t-lg"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white text-2xl font-bold text-center px-8">{quote}</p>
                </div>
            </div>
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
                        />
                    </div>
                    <div className="text-center">
                        <button
                            className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition duration-300"
                            onClick={onStartLearning}
                        >
                            Start Learning
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningCard;