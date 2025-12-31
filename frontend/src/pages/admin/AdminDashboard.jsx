import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    BookOpen,
    Video,
    TrendingUp,
    TrendingDown,
    Search,
    Bell,
    ChevronDown,
    MoreHorizontal,
    Monitor,
    Gamepad2,
    Armchair,
    Globe,
    GraduationCap,
    Clock,
    CheckCircle2,
    BarChart3
} from 'lucide-react';
import adminService from '../../services/adminService';

const StatCard = ({ title, value, subtext, trend, trendValue, icon: Icon, colorClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="premium-card p-7 relative overflow-hidden group"
    >
        <div className="flex justify-between items-start mb-6">
            <div className={`w-12 h-12 rounded-2xl ${colorClass} bg-opacity-10 flex items-center justify-center`}>
                <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
            </div>
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {trendValue}
            </div>
        </div>
        <div>
            <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">{value}</h3>
            <p className="text-xs text-slate-400 mt-2 font-medium">{subtext}</p>
        </div>

        {/* Subtle decorative circle */}
        <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${colorClass} opacity-[0.03] group-hover:scale-110 transition-transform duration-500`}></div>
    </motion.div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        totalLectures: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await adminService.getAllCourses();
            const courseCount = data.courses.length;
            const lectureCount = data.courses.reduce((acc, course) => acc + (course.lecture_count || 0), 0);
            const studentCount = data.courses.reduce((acc, course) => acc + (course.student_count || 0), 0) + 120;

            setStats({
                totalCourses: courseCount,
                totalStudents: studentCount,
                totalLectures: lectureCount
            });
        } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-10">
            {/* Header / Top Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight text-center lg:text-left">Academic Overview</h1>
                    <p className="text-slate-400 text-sm mt-1 font-medium text-center lg:text-left">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center justify-center lg:justify-end gap-3 w-full lg:w-auto">
                    <div className="relative group flex-1 lg:flex-initial max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all lg:w-64"
                        />
                    </div>
                    <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors relative">
                        <Bell size={18} />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                    </button>
                    <div className="hidden lg:flex items-center gap-3 pl-3 ml-3 border-l border-slate-200 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden ring-2 ring-indigo-50 dark:ring-slate-800 transition-all">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Awais" alt="avatar" />
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">Awais laal</p>
                            <p className="text-[11px] text-slate-400 mt-1 font-medium">Head Administrator</p>
                        </div>
                        <ChevronDown size={16} className="text-slate-400" />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-indigo-600 rounded-[2rem] p-7 text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden h-full flex flex-col justify-between"
                    >
                        <div className="flex justify-between items-start relative z-10">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                <GraduationCap size={24} />
                            </div>
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 text-[11px] font-bold">
                                <TrendingUp size={12} />
                                +5.2%
                            </div>
                        </div>
                        <div className="mt-8 relative z-10">
                            <p className="text-indigo-100 text-sm font-medium opacity-80 mb-1">Total Enrollment</p>
                            <h3 className="text-3xl font-extrabold tracking-tight">{stats.totalStudents}</h3>
                            <p className="text-[11px] text-indigo-100 mt-2 opacity-60">Students vs last month</p>
                        </div>
                        {/* Decorative blob */}
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    </motion.div>
                </div>

                <StatCard
                    title="Active Courses"
                    value={stats.totalCourses}
                    subtext="Courses currently live"
                    trend="up"
                    trendValue="+2"
                    icon={BookOpen}
                    colorClass="bg-orange-500"
                    delay={0.1}
                />

                <StatCard
                    title="Average Progress"
                    value="78%"
                    subtext="Learning completion rate"
                    trend="up"
                    trendValue="+12.4%"
                    icon={BarChart3}
                    colorClass="bg-purple-500"
                    delay={0.2}
                />

                <StatCard
                    title="Pending Tasks"
                    value="24"
                    subtext="Submissions to grade"
                    trend="down"
                    trendValue="-4"
                    icon={Clock}
                    colorClass="bg-green-500"
                    delay={0.3}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Section */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="premium-card p-8"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Learning Engagement</h3>
                                <p className="text-slate-400 text-sm mt-1 uppercase tracking-wider font-bold text-[10px]">Weekly student activity</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                                    <span className="text-xs font-bold text-slate-400">Lectures Viewed</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                                    <span className="text-xs font-bold text-slate-400">Assignments Done</span>
                                </div>
                                <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                                    This semester <ChevronDown size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Mock Chart Area */}
                        <div className="h-[280px] w-full flex items-end justify-between px-2 group">
                            {[40, 60, 45, 80, 55, 70, 40].map((h, i) => (
                                <div key={i} className="w-8 flex flex-col items-center gap-2 group/bar">
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-[200px] relative overflow-hidden">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                            className="absolute bottom-0 w-full bg-indigo-600 rounded-full group-hover/bar:bg-indigo-500 transition-colors"
                                        ></motion.div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">
                                        {['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right Statistics Section */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="premium-card p-8"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Department Stats</h3>
                            <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-600">
                                Stats Overview <ChevronDown size={14} />
                            </button>
                        </div>
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-8">Course distribution by category</p>

                        {/* Circular Progress Mockup */}
                        <div className="relative h-48 flex items-center justify-center mb-10">
                            {[100, 80, 60].map((r, i) => (
                                <div
                                    key={i}
                                    className="absolute rounded-full border-[10px]"
                                    style={{
                                        width: `${r}%`,
                                        height: `${r}%`,
                                        borderColor: ['#f1f5f9', '#f8fafc', '#ffffff'][i],
                                        borderLeftColor: ['#ef4444', '#22c55e', '#4f46e5'][i],
                                        borderTopColor: ['#ef4444', '#22c55e', '#4f46e5'][i],
                                        transform: `rotate(${[45, 120, -30][i]}deg)`
                                    }}
                                ></div>
                            ))}
                            <div className="text-center">
                                <p className="text-3xl font-extrabold text-slate-800 dark:text-white leading-none">{stats.totalCourses}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Active Courses</p>
                                <div className="flex items-center justify-center gap-1 text-green-500 font-bold mt-1">
                                    <TrendingUp size={12} />
                                    <span className="text-[11px]">+2 this week</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Science', val: '12', perc: '+1', icon: Monitor, color: 'text-indigo-600' },
                                { label: 'Arts', val: '8', perc: '+2', icon: Gamepad2, color: 'text-green-600' },
                                { label: 'History', val: '5', perc: '0', icon: Armchair, color: 'text-red-500' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <item.icon size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-800">{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-extrabold text-slate-800">{item.val}</span>
                                        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600`}>
                                            {item.perc}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="premium-card p-8"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Student Origins</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Campus distribution</p>
                            </div>
                            <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-600">
                                Details <ChevronDown size={14} />
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-10 py-4">
                            <div className="relative">
                                <div className="w-28 h-28 rounded-full border-[12px] border-slate-100 border-t-indigo-600 border-r-indigo-600 transform rotate-45"></div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <p className="text-xl font-extrabold text-slate-800 dark:text-white leading-none">{stats.totalStudents}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Total</p>
                                </div>
                            </div>
                            <div className="space-y-4 flex-1">
                                {[
                                    { label: 'City Campus', val: '450', color: 'bg-indigo-600', flag: '🏛️' },
                                    { label: 'West Branch', val: '210', color: 'bg-indigo-400', flag: '🏫' },
                                    { label: 'Online Only', val: '120', color: 'bg-slate-200', flag: '💻' }
                                ].map((loc, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm grayscale group-hover:grayscale-0 transition-all">{loc.flag}</span>
                                            <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800">{loc.label}</span>
                                        </div>
                                        <span className="text-xs font-extrabold text-slate-800">{loc.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;