import React from 'react';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsButton: React.FC = () => {
    return (
        <Link href="/settings">
            <motion.button 
                className="flex items-center justify-center gap-2 w-44 h-12 text-gray-700 hover:text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Settings size={20} />
                <span className="text-md">Settings</span>
            </motion.button>
        </Link>
    );
};

export default SettingsButton;