import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Trophy,
    Clock,
    Target,
    ChevronRight,
    Star,
    Calendar,
    Zap,
    GraduationCap,
    ArrowUpRight,
    Search,
    Bell,
    ChevronDown,
    PlayCircle
} from 'lucide-react';
import studentService from '../../services/studentService';

const StatCard = ({ title, value, detail, icon: Icon, colorClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="premium-card p-6 group"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-2xl ${colorClass} bg-opacity-10 flex items-center justify-center`}>
                <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                <ArrowUpRight size={14} />
            </div>
        </div>
        <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">{value}</h3>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">{detail}</p>
        </div>
    </motion.div>
);

const StudentDashboard = () => {
    const [stats, setStats] = useState({
        enrolledCourses: 0,
        completedLectures: 0,
        totalLectures: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await studentService.getActiveCourses();
                // Handle both array and object responses for robustness
                const coursesArray = Array.isArray(res) ? res : (res?.courses || []);
                setStats({
                    enrolledCourses: coursesArray.length,
                    completedLectures: 12, // Mock data
                    totalLectures: 45      // Mock data
                });
            } catch (error) {
                console.error('Error fetching student stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="pb-10">
            {/* Header / Top Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight text-center lg:text-left flex items-center gap-3 justify-center lg:justify-start">
                        Welcome back, Awais! <span className="text-3xl">👋</span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-1 font-medium text-center lg:text-left">You've completed 85% of your weekly learning goal.</p>
                </div>
                <div className="flex items-center justify-center lg:justify-end gap-3 w-full lg:w-auto">
                    <div className="relative group flex-1 lg:flex-initial max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find a course..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all lg:w-64"
                        />
                    </div>
                    <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors relative">
                        <Bell size={18} />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                    </button>
                    <div className="hidden lg:flex items-center gap-3 pl-3 ml-3 border-l border-slate-200 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden ring-2 ring-indigo-50 dark:ring-slate-800 transition-all">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Awais" alt="avatar" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">Awais laal</p>
                            <p className="text-[11px] text-slate-400 mt-1 font-medium">Student Prime</p>
                        </div>
                        <ChevronDown size={16} className="text-slate-400" />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    title="Active Learning"
                    value={stats.enrolledCourses}
                    detail="Courses in progress"
                    icon={BookOpen}
                    colorClass="bg-indigo-600"
                    delay={0}
                />
                <StatCard
                    title="Course Progress"
                    value={`${Math.round((stats.completedLectures / stats.totalLectures) * 100) || 0}%`}
                    detail="Total lectures completed"
                    icon={Target}
                    colorClass="bg-purple-600"
                    delay={0.1}
                />
                <StatCard
                    title="Current GPA"
                    value="3.8"
                    detail="Top 5% of your class"
                    icon={GraduationCap}
                    colorClass="bg-green-600"
                    delay={0.2}
                />
                <StatCard
                    title="Hours Spent"
                    value="24h"
                    detail="Learning time this week"
                    icon={Clock}
                    colorClass="bg-orange-600"
                    delay={0.3}
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Continue Learning */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white italic">Continue Your Path</h3>
                        <button className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors flex items-center gap-1 group">
                            Full Syllabus <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="premium-card p-0 overflow-hidden group"
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
                                alt="Course Cover"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 bg-indigo-600 text-[10px] font-bold text-white rounded-md uppercase tracking-wider">Next Lecture</span>
                                    <span className="text-indigo-200 text-xs font-medium uppercase tracking-widest">• 15 MINS LONG</span>
                                </div>
                                <h4 className="text-xl font-bold text-white">Principles of Modern Web Architectures</h4>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                        <Zap size={18} className="text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">Module 4: React Server Components</p>
                                        <p className="text-[11px] text-slate-400 font-medium">Session by Dr. Jane Doe</p>
                                    </div>
                                </div>
                                <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-500 transition-all flex items-center gap-2">
                                    Play <PlayCircle size={16} />
                                </button>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-slate-400">COURSE COMPLETION</span>
                                    <span className="text-indigo-600">64%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '64%' }}
                                        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                                    ></motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Performance & Deadlines */}
                <div className="space-y-6">
                    <div className="mb-2">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white italic">Deadlines</h3>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="premium-card p-6"
                    >
                        <div className="space-y-5">
                            {[
                                { title: 'Final UI Submission', date: 'Tomorrow, Oct 31', time: '11:59 PM', color: 'text-orange-600', bg: 'bg-orange-50' },
                                { title: 'Database Design Quiz', date: 'Fri, Nov 2', time: '02:00 PM', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                { title: 'Algorithm Peer Review', date: 'Sun, Nov 4', time: '06:00 PM', color: 'text-purple-600', bg: 'bg-purple-50' }
                            ].map((deadline, i) => (
                                <div key={i} className="flex gap-4 group cursor-pointer">
                                    <div className={`w-12 h-12 rounded-2xl ${deadline.bg} shrink-0 flex flex-col items-center justify-center ${deadline.color}`}>
                                        <Calendar size={18} />
                                    </div>
                                    <div className="min-w-0 border-b border-slate-50 dark:border-slate-800 pb-3 flex-1 group-last:border-none">
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{deadline.title}</h4>
                                        <p className="text-[11px] text-slate-400 font-medium mt-1">{deadline.date} • {deadline.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-3 bg-slate-50 dark:bg-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] rounded-xl hover:text-indigo-600 transition-all">
                            View All Events
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-[2rem] p-8 text-white relative overflow-hidden group border border-white/10"
                    >
                        <div className="relative z-10">
                            <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Trophy className="text-orange-400" size={24} /> Achievements
                            </h4>
                            <div className="flex gap-3 mb-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                        <Star size={18} className="text-orange-400" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center text-xs font-bold text-white/40">
                                    +5
                                </div>
                            </div>
                            <p className="text-[11px] text-white/60 font-medium leading-relaxed">
                                You are only 120 points away from becoming a "Code Ninja"! Keep learning to unlock new badges.
                            </p>
                        </div>
                        {/* Decorative circle */}
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
