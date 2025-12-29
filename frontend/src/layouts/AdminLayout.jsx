import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { LayoutDashboard, Users, BookOpen, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLayout = () => {
    const adminLinks = [
        { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={22} /> },
        { path: '/admin/courses', label: 'Manage Courses', icon: <BookOpen size={22} /> },
        { path: '/admin/students', label: 'Manage Students', icon: <Users size={22} /> },
        { path: '/admin/register-user', label: 'Register User', icon: <Users size={22} /> },
        // Placeholder for future use
        // { path: '/admin/settings', label: 'Settings', icon: <Settings size={22} /> },
    ];

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
            <Sidebar title="Admin Portal" links={adminLinks} userRole="Administrator" />

            <motion.main
                className="flex-1 overflow-y-auto p-8 relative"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Background Blobs for Aesthetics */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[100px] opacity-60 mix-blend-multiply dark:bg-purple-900/20"></div>
                    <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-[80px] opacity-60 mix-blend-multiply dark:bg-blue-900/20"></div>
                </div>

                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </motion.main>
        </div>
    );
};

export default AdminLayout;
