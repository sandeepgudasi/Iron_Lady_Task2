import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProgramApplications, updateApplicationStatus, deleteApplication } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiBriefcase, FiTrash2, FiHelpCircle, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';
import { GiBrain } from 'react-icons/gi';

const ApplicationReview = () => {
    const { programId } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await getProgramApplications(programId);
            // Sort by ID descending (newest first)
            const sorted = response.data.sort((a, b) => b.id - a.id);
            setApplications(sorted);
        } catch (error) {
            console.error("Failed to fetch applications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (programId) fetchApplications();
    }, [programId]);

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateApplicationStatus(id, status);
            fetchApplications();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this application?")) return;
        try {
            await deleteApplication(id);
            fetchApplications();
        } catch (error) {
            alert('Failed to delete application');
        }
    };

    // Helper to parse AI JSON safely
    const parseAI = (jsonString) => {
        try {
            const data = JSON.parse(jsonString);
            return {
                summary: data.summary,
                score: data.score || 0,
                strengths: data.strengths || [],
                questions: data.interview_questions || [],
                potential: data.leadership_potential || 'Unknown'
            };
        } catch (e) {
            if (!jsonString) return null;
            return { summary: jsonString, score: 0, strengths: [], questions: [], potential: 'N/A' };
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 min-h-[calc(100vh-80px)]">
            <Link to="/" className="inline-flex items-center text-gray-400 hover:text-yellow-500 mb-8 transition-colors">
                <FiArrowLeft className="mr-2" /> Back to Programs
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-end mb-8 pb-6 border-b border-gray-800 gap-4">
                <div>
                    <h1 className="text-4xl text-white font-display mb-2">Admin Dashboard</h1>
                    <p className="text-gray-500">Managing all applications in one unified view.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchApplications} className="p-2.5 bg-gray-800 text-gray-400 rounded-lg hover:text-white transition-colors" title="Refresh">
                        <FiRefreshCw />
                    </button>
                    <Link to={`/program/${programId}/simulator`} className="px-5 py-2.5 bg-gray-800 border border-yellow-500/30 text-yellow-500 font-bold rounded-lg hover:bg-yellow-500/10 transition-colors">
                        Open Simulator
                    </Link>
                </div>
            </div>

            <div className="space-y-6">
                {applications.length === 0 ? (
                    <div className="text-center py-24 bg-gray-900/30 rounded-3xl border border-gray-800 border-dashed">
                        <GiBrain className="text-6xl text-gray-700 mx-auto mb-4" />
                        <h3 className="text-xl text-gray-400 font-bold mb-2">No Applications Yet</h3>
                        <p className="text-gray-600 mb-6">Use the Simulator to add test candidates.</p>
                        <Link to={`/program/${programId}/simulator`} className="btn-gold px-8 py-3 rounded-lg text-sm font-bold inline-block">
                            Go to Simulator
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {applications.map((app) => {
                            const aiData = parseAI(app.ai_summary);
                            return (
                                <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-card p-0 rounded-2xl overflow-hidden flex flex-col md:flex-row relative group"
                                >
                                    {/* Status Stripe */}
                                    <div className={`w-full md:w-2 h-2 md:h-auto flex-shrink-0 ${app.status === 'Approved' ? 'bg-green-500' :
                                            app.status === 'Rejected' ? 'bg-red-500/50' : 'bg-yellow-500'
                                        }`}></div>

                                    <div className="p-6 md:p-8 flex-1 flex flex-col gap-6">
                                        {/* Header: Name & Role */}
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-2xl font-bold text-white font-display">{app.applicant_name}</h3>
                                                    <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${app.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                                                            app.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                                                                'bg-yellow-500/20 text-yellow-400'
                                                        }`}>
                                                        {app.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                    <FiBriefcase /> {app.role}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex bg-gray-900/50 rounded-lg p-1 gap-1">
                                                <button onClick={() => handleStatusUpdate(app.id, 'Pending')} className={`p-2 rounded hover:bg-white/10 ${app.status === 'Pending' ? 'text-yellow-500' : 'text-gray-500'}`} title="Mark Pending"><FiRefreshCw /></button>
                                                <button onClick={() => handleStatusUpdate(app.id, 'Approved')} className={`p-2 rounded hover:bg-white/10 ${app.status === 'Approved' ? 'text-green-500' : 'text-gray-500'}`} title="Approve"><FiCheck /></button>
                                                <button onClick={() => handleStatusUpdate(app.id, 'Rejected')} className={`p-2 rounded hover:bg-white/10 ${app.status === 'Rejected' ? 'text-red-500' : 'text-gray-500'}`} title="Reject"><FiX /></button>
                                                <div className="w-px bg-gray-700 my-1 mx-1"></div>
                                                <button onClick={() => handleDelete(app.id)} className="p-2 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-500" title="Delete"><FiTrash2 /></button>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            {/* Left: User Query */}
                                            <div className="bg-black/20 rounded-xl p-5 border border-gray-800">
                                                <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-3">Applicant Query</h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <span className="text-yellow-600/70 text-xs font-bold block mb-1">GOAL</span>
                                                        <p className="text-gray-300 text-sm">{app.goal}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-red-500/50 text-xs font-bold block mb-1">CHALLENGE</span>
                                                        <p className="text-gray-300 text-sm">{app.challenge}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: AI Analysis */}
                                            {aiData ? (
                                                <div className="relative">
                                                    <h4 className="text-indigo-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-2"><GiBrain /> AI Analysis</h4>

                                                    <div className="flex items-start gap-4 mb-4">
                                                        <div className="flex-shrink-0 text-center bg-indigo-500/10 rounded-lg p-3 border border-indigo-500/20">
                                                            <div className="text-2xl font-bold text-white leading-none">{aiData.score}</div>
                                                            <div className="text-[9px] uppercase text-indigo-300 mt-1">Match</div>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-300 text-sm italic leading-relaxed">"{aiData.summary}"</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {/* Strengths Tags */}
                                                        <div className="flex flex-wrap gap-2">
                                                            {aiData.strengths.map((s, i) => (
                                                                <span key={i} className="px-2 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded">{s}</span>
                                                            ))}
                                                        </div>
                                                        {/* Questions */}
                                                        <ul className="space-y-1">
                                                            {aiData.questions.slice(0, 2).map((q, i) => (
                                                                <li key={i} className="text-xs text-gray-500 flex gap-2">
                                                                    <span className="text-indigo-500">•</span> {q}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center text-gray-600 text-sm italic bg-black/20 rounded-xl border border-gray-800 dashed">
                                                    Waiting for AI Analysis...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicationReview;
