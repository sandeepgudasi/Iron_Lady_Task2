import React, { useEffect, useState } from 'react';
import { getPrograms, createProgram, deleteProgram } from '../services/api';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiArrowRight, FiActivity, FiUsers, FiClock } from 'react-icons/fi';

const ProgramDashboard = () => {
    const [programs, setPrograms] = useState([]);
    const [newProgram, setNewProgram] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const fetchPrograms = async () => {
        try {
            const response = await getPrograms();
            setPrograms(response.data);
        } catch (error) {
            console.error("Failed to fetch programs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createProgram(newProgram);
            setNewProgram({ name: '', description: '' });
            setShowForm(false);
            fetchPrograms();
        } catch (error) {
            alert('Error creating program');
        }
    };

    const handleDelete = async (id, e) => {
        e.preventDefault(); // Prevent link navigation
        if (!window.confirm('Are you sure?')) return;
        try {
            await deleteProgram(id);
            fetchPrograms();
        } catch (error) {
            alert('Error deleting program');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-12">
            {/* Hero & Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid md:grid-cols-3 gap-6"
            >
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-4xl text-white font-serif">Welcome back, Admin.</h2>
                    <p className="text-gray-400 max-w-lg text-lg font-light">
                        Manage your empowerment programs and review applications with AI-driven insights.
                    </p>
                </div>
                <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-sm text-yellow-500 uppercase tracking-wider">Total Programs</p>
                        <p className="text-4xl text-white font-display mt-2">{programs.length}</p>
                    </div>
                    <FiActivity className="text-white text-4xl opacity-20" />
                </div>
            </motion.div>

            {/* Controls */}
            <div className="flex justify-between items-center">
                <h3 className="text-2xl text-white font-display">Active Programs</h3>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(!showForm)}
                    className="btn-gold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-yellow-900/20"
                >
                    <FiPlus /> {showForm ? 'Close Form' : 'New Program'}
                </motion.button>
            </div>

            {/* Create Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleCreate} className="glass-panel p-8 rounded-2xl space-y-6 max-w-2xl mx-auto border border-yellow-500/20">
                            <h4 className="text-xl text-white border-b border-gray-700 pb-2">Launch New Initiative</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Program Title</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/40 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
                                        value={newProgram.name}
                                        onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                                        placeholder="e.g. Future Leaders Fellowship"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                                    <textarea
                                        className="w-full bg-black/40 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all h-32"
                                        value={newProgram.description}
                                        onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                                        placeholder="Detailed description of the program..."
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full btn-gold py-3 rounded-lg font-bold tracking-wide">
                                    LAUNCH PROGRAM
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                    {programs.map((program, index) => (
                        <motion.div
                            key={program.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card rounded-2xl p-6 relative group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                                {program.name}
                            </h3>
                            <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                                {program.description}
                            </p>

                            <div className="flex justify-between items-end border-t border-gray-800 pt-4 mt-auto">
                                <Link to={`/program/${program.id}`} className="flex items-center gap-2 text-yellow-500 font-medium hover:gap-3 transition-all">
                                    View Apps <FiArrowRight />
                                </Link>
                                <button
                                    onClick={(e) => handleDelete(program.id, e)}
                                    className="text-gray-600 hover:text-red-500 transition-colors p-2"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {!loading && programs.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        <FiClock className="text-4xl mx-auto mb-4 opacity-30" />
                        <p>No active programs. Launch one to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgramDashboard;
