import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createApplication } from '../services/api';
import { FiArrowLeft, FiHelpCircle, FiSend, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Simulator = () => {
    const { programId } = useParams();
    const [mockApp, setMockApp] = useState({
        applicant_name: '',
        email: 'test@example.com',
        role: '',
        career_stage: 'Mid-Level',
        goal: '',
        challenge: '',
        program_id: parseInt(programId)
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success

    const submitMockApplication = async () => {
        if (!mockApp.applicant_name || !mockApp.role) return alert("Name and Role are required");

        setStatus('submitting');
        try {
            await createApplication({ ...mockApp, program_id: parseInt(programId) });
            setStatus('success');
            // Reset form partly after 2 seconds
            setTimeout(() => {
                setStatus('idle');
                setMockApp(prev => ({ ...prev, applicant_name: '', role: '', goal: '', challenge: '' }));
            }, 2000);
        } catch (error) {
            console.error(error);
            alert('Error submitting application');
            setStatus('idle');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 min-h-[calc(100vh-80px)] flex flex-col justify-center">
            <Link to={`/program/${programId}`} className="inline-flex items-center text-gray-400 hover:text-yellow-500 mb-8 transition-colors self-start">
                <FiArrowLeft className="mr-2" /> Go to Admin Dashboard
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 rounded-2xl border border-yellow-500/20 shadow-2xl shadow-yellow-900/10"
            >
                <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-6">
                    <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                        <FiHelpCircle className="text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold font-display text-white">Application Simulator</h1>
                        <p className="text-gray-400 text-sm">Submit test candidates to the centralized Admin Dashboard.</p>
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Applicant Details</label>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                className="w-full bg-black/40 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-yellow-500 outline-none transition-colors"
                                placeholder="Full Name"
                                value={mockApp.applicant_name}
                                onChange={e => setMockApp({ ...mockApp, applicant_name: e.target.value })}
                            />
                            <input
                                className="w-full bg-black/40 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-yellow-500 outline-none transition-colors"
                                placeholder="Current Role / Job Title"
                                value={mockApp.role}
                                onChange={e => setMockApp({ ...mockApp, role: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Career Context</label>
                        <textarea
                            className="w-full bg-black/40 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-yellow-500 outline-none transition-colors min-h-[80px]"
                            placeholder="What is their primary professional goal?"
                            value={mockApp.goal}
                            onChange={e => setMockApp({ ...mockApp, goal: e.target.value })}
                        />
                    </div>

                    <div>
                        <textarea
                            className="w-full bg-black/40 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-yellow-500 outline-none transition-colors min-h-[80px]"
                            placeholder="What is their biggest leadership challenge?"
                            value={mockApp.challenge}
                            onChange={e => setMockApp({ ...mockApp, challenge: e.target.value })}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={submitMockApplication}
                            disabled={status !== 'idle'}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${status === 'success' ? 'bg-green-500 text-white' : 'btn-gold'
                                }`}
                        >
                            {status === 'idle' && <><FiSend /> Submit Application</>}
                            {status === 'submitting' && "Sending..."}
                            {status === 'success' && <><FiCheckCircle /> Sent Successfully!</>}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Simulator;
