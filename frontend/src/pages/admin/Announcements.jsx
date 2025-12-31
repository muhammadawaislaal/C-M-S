import React, { useState } from 'react';
import commService from '../../services/commService';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Megaphone,
    Bell,
    Send,
    Calendar,
    FileText,
    Target,
    Layers,
    ChevronDown
} from 'lucide-react';

const Announcements = ({ courseId }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const create = async () => {
        if (!title || !content) return toast.warning('Please provide both title and content');
        try {
            await commService.createAnnouncement(courseId, { title, content });
            toast.success('Announcement broadcasted successfully 📢');
            setTitle(''); setContent('');
        } catch (e) { toast.error('Failed to create announcement'); }
    };

    return (
        <div className="pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Announcements</h1>
                    <p className="text-slate-400 text-sm mt-1 font-medium">Broadcast critical news and updates to your students</p>
                </div>
                <div className="w-12 h-12 bg-orange-500 bg-opacity-10 rounded-2xl flex items-center justify-center text-orange-600">
                    <Megaphone size={24} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Create Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-3 premium-card p-8 flex flex-col"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                            <Send size={18} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Create Broadcast</h3>
                    </div>

                    <div className="space-y-6 flex-1">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Announcement Title</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="E.g., Midterm Exam Schedule Updated"
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Target Audience</label>
                            <div className="flex gap-3">
                                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold border border-indigo-100">
                                    <Target size={14} /> This Course
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold border border-slate-100">
                                    <Layers size={14} /> Full Campus
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 flex-1 flex flex-col">
                            <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Description Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Details about this announcement..."
                                className="w-full flex-1 p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none shadow-sm min-h-[150px]"
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                        <button
                            onClick={create}
                            className="flex items-center gap-2 px-10 py-3.5 bg-orange-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-500 hover:-translate-y-1 transition-all"
                        >
                            Publish Now <Bell size={18} />
                        </button>
                    </div>
                </motion.div>

                {/* Recent History */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 space-y-6"
                >
                    <div className="premium-card p-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Recent History</h3>
                        <div className="space-y-4">
                            {[
                                { title: 'New Course Materials', date: '2 hours ago', type: 'info' },
                                { title: 'Holiday Closure Notice', date: 'Yesterday', type: 'warning' },
                                { title: 'Welcome New Students!', date: 'Oct 15, 2023', type: 'success' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 group hover:border-indigo-200 transition-all cursor-pointer">
                                    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${item.type === 'info' ? 'bg-blue-100 text-blue-600' :
                                            item.type === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                                        }`}>
                                        <FileText size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                                        <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                                            <Calendar size={12} />
                                            <span className="text-[10px] font-bold uppercase">{item.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:text-indigo-600 transition-all">
                            View Older Broadcasts
                        </button>
                    </div>

                    <div className="bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-xl font-bold mb-2">Announcement Tips</h4>
                            <p className="text-indigo-100 text-xs leading-relaxed opacity-80">
                                Keep your announcements concise and use clear titles to increase student engagement by up to 40%.
                            </p>
                        </div>
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Announcements;
