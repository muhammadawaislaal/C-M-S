import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    MessageSquare,
    Bell,
    TrendingUp,
    Globe,
    PieChart,
    Package,
    Menu,
    FileSpreadsheet,
    UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

    const adminLinks = [
        { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/courses', label: 'Courses', icon: <Package size={20} /> },
        { path: '/admin/students', label: 'Students', icon: <Users size={20} /> },
        { path: '/admin/assessments', label: 'Assessments', icon: <FileSpreadsheet size={20} /> },
        { path: '/admin/register-user', label: 'Register User', icon: <UserPlus size={20} /> },
        { path: '/admin/analytics', label: 'Analytics', icon: <PieChart size={20} /> },
        { path: '/admin/messages', label: 'Messages', icon: <MessageSquare size={20} /> },
        { path: '/admin/announcements', label: 'Announcements', icon: <Bell size={20} /> },
        { path: '/admin/forums', label: 'Community', icon: <Globe size={20} /> },
        { path: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> }
    ];

    return (
        <div className="flex h-screen bg-[#F8F9FD] dark:bg-slate-950 overflow-hidden font-sans">
            <Sidebar
                links={adminLinks}
                userRole="Administrator"
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
                    <span className="font-bold text-slate-800 dark:text-white">CMS Portal</span>
                    <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Awais" alt="avatar" />
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

export default AdminLayout;
