import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
    LayoutDashboard,
    BookOpen,
    PlayCircle,
    Trophy,
    Menu,
    Search,
    Bell,
    Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

const StudentLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

    const studentLinks = [
        { path: '/student', label: 'My Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/student/my-courses', label: 'My Learning', icon: <PlayCircle size={20} /> },
        { path: '/student/courses', label: 'Browse Courses', icon: <BookOpen size={20} /> },
        { path: '/student/achievements', label: 'Achievements', icon: <Trophy size={20} /> },
        { path: '/student/community', label: 'Community', icon: <Search size={20} /> },
        { path: '/student/settings', label: 'Settings', icon: <Settings size={20} /> }
    ];

    return (
        <div className="flex h-screen bg-[#F8F9FD] dark:bg-slate-950 overflow-hidden font-sans">
            <Sidebar
                links={studentLinks}
                userRole="Student"
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Mobile Top Bar */}
                <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0 z-40">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                        <Menu size={20} />
                    </button>
                    <span className="font-bold text-slate-800 dark:text-white">Student Portal</span>
                    <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Student" alt="avatar" />
                    </div>
                </div>

                <motion.main
                    className="flex-1 overflow-y-auto px-4 md:px-8 py-6 relative"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </motion.main>
            </div>
        </div>
    );
};

export default StudentLayout;
