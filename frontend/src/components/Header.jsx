import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header = () => {
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="glass-panel sticky top-0 z-50 px-6 py-4 flex justify-between items-center"
        >
            <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 p-1 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-shadow">
                    <img src={logo} alt="Iron Lady Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                    <h1 className="text-xl font-bold m-0 tracking-wide text-white">IRON LADY</h1>
                    <p className="text-[10px] text-yellow-500 tracking-[0.2em] uppercase font-sans">Internal Operations</p>
                </div>
            </Link>

            <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>System Operational</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border border-gray-500"></div>
            </div>
        </motion.header>
    );
};

export default Header;
