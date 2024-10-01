import React from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const QuickLearn: React.FC = () => {
    return (
        <Link href="/quicklearn">
            <motion.button 
                className="flex items-center justify-center gap-2 w-44 h-12 text-green-900 font-medium rounded-lg hover:bg-green-900 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Clock size={20} />
                <span className="text-md">Learn in 3 minutes</span>
            </motion.button>
        </Link>
    );
};

export default QuickLearn;