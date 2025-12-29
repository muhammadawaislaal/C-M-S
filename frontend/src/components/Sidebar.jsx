import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogOut,
    Menu,
    X,
    ChevronRight,
    GraduationCap
} from 'lucide-react';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const Sidebar = ({ title, links, userRole }) => {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        toast.info('Logged out successfully 👋');
        navigate('/login');
    };

    const sidebarVariants = {
        open: {
            width: '280px',
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        },
        closed: {
            width: '80px',
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        }
    };

    const linkVariants = {
        hover: { x: 5, transition: { duration: 0.2 } },
        tap: { scale: 0.95 }
    };

    return (
        <>
            <motion.div
                className="h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xl z-50 flex flex-col sticky top-0 font-sans"
                initial="open"
                animate={isOpen ? "open" : "closed"}
                variants={sidebarVariants}
            >
                {/* Header */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-3"
                            >
                                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                                    <GraduationCap size={24} />
                                </div>
                                <div>
                                    <h1 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">
                                        CMS Portal
                                    </h1>
                                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{userRole}</span>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mx-auto"
                            >
                                <GraduationCap size={28} className="text-primary-600" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden
                ${isActive
                                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-primary-600 dark:hover:text-primary-400'
                                }
              `}
                        >
                            <div className="relative z-10 flex items-center gap-4">
                                <span className="text-xl">{link.icon}</span>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="font-medium whitespace-nowrap"
                                        >
                                            {link.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>

                            {isOpen && (
                                <ChevronRight
                                    size={16}
                                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                            )}
                        </NavLink>
                    ))}
                </div>

                {/* User Profile & Logout */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              text-slate-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10
              ${!isOpen && 'justify-center'}
            `}
                    >
                        <LogOut size={20} />
                        {isOpen && <span className="font-medium">Sign Out</span>}
                    </motion.button>
                </div>
            </motion.div>
        </>
    );
};

export default Sidebar;
