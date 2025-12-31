import React, { useEffect, useState } from 'react';
import commService from '../../services/commService';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe,
    MessageSquare,
    Users,
    Search,
    Hash,
    Plus,
    Filter,
    ArrowRight,
    Send,
    BookOpen
} from 'lucide-react';

import authService from '../../services/authService';

const Forum = ({ courseId: initialCourseId }) => {
    const [courses, setCourses] = useState([]);
    const [courseId, setCourseId] = useState(initialCourseId);
    const [forums, setForums] = useState([]);
    const [posts, setPosts] = useState([]);
    const [activeForum, setActiveForum] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchingForums, setFetchingForums] = useState(false);
    const user = authService.getCurrentUser();

    useEffect(() => {
        if (!courseId) {
            (async () => {
                try {
                    let res;
                    if (user?.role === 'admin') {
                        res = await adminService.getAllCourses();
                        setCourses(res.courses || []);
                    } else {
                        res = await studentService.getActiveCourses();
                        // Handle potential array or object response
                        setCourses(Array.isArray(res) ? res : (res.courses || []));
                    }
                } catch (e) {
                    toast.error('Failed to load community hubs');
                }
            })();
        }
    }, [courseId]);

    useEffect(() => {
        if (!courseId) return;
        (async () => {
            setFetchingForums(true);
            try {
                const res = await commService.listForums(courseId);
                const fetchedForums = res.forums || [];
                setForums(fetchedForums);
                if (fetchedForums.length > 0) {
                    openForum(fetchedForums[0]);
                } else {
                    setActiveForum(null);
                    setPosts([]);
                }
            } catch (e) {
                console.error('Failed to list forums');
                setForums([]);
            } finally {
                setFetchingForums(false);
            }
        })();
    }, [courseId]);

    const openForum = async (f) => {
        setLoading(true);
        setActiveForum(f);
        try {
            const res = await commService.getPosts(f.id);
            setPosts(res.posts || []);
        } catch (e) {
            toast.error('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    if (!courseId) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Community Hub</h1>
                    <p className="text-slate-400 text-sm mt-1 font-medium italic">Select a course to join the discussion</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(c => (
                        <motion.button
                            key={c.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => setCourseId(c.id)}
                            className="premium-card p-6 flex flex-col items-start gap-4 hover:border-indigo-600 transition-all text-left group"
                        >
                            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">{c.title}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Community Discussion</p>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                                Open Hub <ArrowRight size={14} />
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="pb-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Community Hub</h1>
                    <p className="text-slate-400 text-sm mt-1 font-medium">Join the discussion with your peers and instructors</p>
                </div>
                <button
                    onClick={() => setCourseId(null)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                    <BookOpen size={16} /> Switch Course
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Channels Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 premium-card flex flex-col h-[650px]"
                >
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Globe size={18} className="text-indigo-600" />
                            <span className="text-sm font-bold text-slate-800 dark:text-white">Discussion</span>
                        </div>
                        <button className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                            <Plus size={16} />
                        </button>
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-1">
                        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 mt-2">Available Forums</p>
                        {fetchingForums ? (
                            <div className="text-center py-10 animate-pulse">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-loose">Syncing Hub...</p>
                            </div>
                        ) : (
                            <>
                                {forums.map(f => (
                                    <button
                                        key={f.id}
                                        onClick={() => openForum(f)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeForum?.id === f.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                    >
                                        <Hash size={16} className={activeForum?.id === f.id ? 'text-white' : 'text-slate-400'} />
                                        <span className="text-xs font-bold truncate">{f.title}</span>
                                    </button>
                                ))}
                                {forums.length === 0 && (
                                    <div className="text-center py-10">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-loose">No Channels Found</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 rounded-b-[2rem]">
                        <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                            <Users size={16} className="text-slate-400" />
                            <span className="text-[11px] font-bold text-slate-600">Community Sync Active</span>
                        </div>
                    </div>
                </motion.div>

                {/* Posts Feed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-3 flex flex-col h-[650px] space-y-6"
                >
                    <div className="premium-card flex flex-col flex-1 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white capitalize">
                                    {activeForum ? `# ${activeForum.title}` : 'Select a Thread'}
                                </h3>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">Forum Feed</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden md:flex items-center relative group">
                                    <Search className="absolute left-3 text-slate-400 group-focus-within:text-indigo-600" size={14} />
                                    <input type="text" placeholder="Search posts..." className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500/10" />
                                </div>
                                <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                    <Filter size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-50">
                                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Syncing discussions...</p>
                                    </div>
                                ) : posts.length > 0 ? (
                                    posts.map((p, i) => (
                                        <motion.div
                                            key={p.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900/40 transition-all group"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden shrink-0 shadow-sm transition-transform group-hover:scale-105">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}`} alt="user" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-baseline mb-2">
                                                        <h5 className="text-xs font-bold text-indigo-600">User_{p.id}</h5>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Discussion Participant</span>
                                                    </div>
                                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                                        {p.content}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100/50 dark:border-slate-700/30">
                                                        <button className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                                                            <MessageSquare size={13} /> Reply
                                                        </button>
                                                        <button className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                                                            <Globe size={13} /> View Thread
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-30 text-center px-10">
                                        <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem]">
                                            <MessageSquare size={48} className="text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">No Discussions Yet</p>
                                            <p className="text-[11px] font-medium text-slate-400">Be the first to start a conversation in this forum!</p>
                                        </div>
                                        <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold mt-4 shadow-lg shadow-indigo-100 transition-transform hover:-translate-y-1">
                                            Start Discussion <ArrowRight size={14} />
                                        </button>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="premium-card p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Awais`} alt="Admin" />
                        </div>
                        <div className="flex-1 relative group">
                            <input
                                type="text"
                                placeholder="Share your thoughts with the community..."
                                className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-500 transition-all">
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Forum;
