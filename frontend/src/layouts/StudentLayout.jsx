import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { LayoutDashboard, BookOpen, PlayCircle, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentLayout = () => {
    const studentLinks = [
        { path: '/student', label: 'My Dashboard', icon: <LayoutDashboard size={22} /> },
        { path: '/student/my-courses', label: 'My Learning', icon: <PlayCircle size={22} /> },
        { path: '/student/courses', label: 'Browse Courses', icon: <BookOpen size={22} /> },
        // Placeholder for future gamification
        // { path: '/student/achievements', label: 'Achievements', icon: <Trophy size={22} /> },
    ];

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
            <Sidebar title="Student Portal" links={studentLinks} userRole="Student" />

            <motion.main
                className="flex-1 overflow-y-auto p-8 relative"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Background Blobs for Aesthetics */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-5%] right-[10%] w-[500px] h-[500px] bg-green-200/30 rounded-full blur-[100px] opacity-60 mix-blend-multiply dark:bg-green-900/20"></div>
                    <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-teal-200/30 rounded-full blur-[80px] opacity-60 mix-blend-multiply dark:bg-teal-900/20"></div>
                </div>

                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </motion.main>
        </div>
    );
};

export default StudentLayout;
