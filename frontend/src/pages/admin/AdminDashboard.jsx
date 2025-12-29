import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Video, Activity, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{value}</h3>
            </div>
            <div className={`p-4 rounded-xl ${color} bg-opacity-20`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            <TrendingUp size={14} className="text-green-500 mr-1" />
            <span className="text-green-500 font-medium">12%</span>
            <span className="text-slate-400 ml-1">vs last month</span>
        </div>
    </motion.div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0, // Placeholder
        totalLectures: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await adminService.getAllCourses();

            // Calculate stats from courses data
            const courseCount = data.courses.length;
            const lectureCount = data.courses.reduce((acc, course) => acc + (course.lecture_count || 0), 0);

            // Mock student count for now as API is missing
            const studentCount = data.courses.reduce((acc, course) => acc + (course.student_count || 0), 0) + 120;

            setStats({
                totalCourses: courseCount,
                totalStudents: studentCount,
                totalLectures: lectureCount
            });
        } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
            // toast.error('Failed to load dashboard metrics');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">
                    Dashboard Overview
                </h1>
                <p className="text-slate-500 mt-2">Welcome back, Admin! Here's what's happening today.</p>
            </div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <StatCard
                    title="Total Courses"
                    value={stats.totalCourses}
                    icon={BookOpen}
                    color="bg-blue-500 text-blue-600"
                    delay={0}
                />
                <StatCard
                    title="Active Students"
                    value={stats.totalStudents}
                    icon={Users}
                    color="bg-purple-500 text-purple-600"
                    delay={0.1}
                />
                <StatCard
                    title="Total Lectures"
                    value={stats.totalLectures}
                    icon={Video}
                    color="bg-orange-500 text-orange-600"
                    delay={0.2}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8 text-center"
            >
                <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <Activity size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Recent Activity</h3>
                <p className="text-slate-500 mt-2">No recent activity to display.</p>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;