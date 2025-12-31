import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogOut,
    Menu,
    X,
    ChevronRight,
    LayoutDashboard,
    PieChart,
    Users,
    Package,
    Settings,
    MessageSquare,
    HelpCircle,
    Bell,
    Mail,
    X as CloseIcon
} from 'lucide-react';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const Sidebar = ({ links, userRole, isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) setIsOpen(false);
            else setIsOpen(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setIsOpen]);

    const handleLogout = () => {
        authService.logout();
        toast.info('Logged out successfully 👋');
        navigate('/login');
    };

    const sidebarVariants = {
        open: {
            x: 0,
            width: isMobile ? '100%' : '280px',
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        },
        closed: {
            x: isMobile ? '-100%' : 0,
            width: isMobile ? '0px' : '88px',
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.div
                className={`h-screen bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 shadow-sm z-[70] flex flex-col sticky top-0 font-sans ${isMobile ? 'fixed inset-y-0 left-0' : ''}`}
                initial={isMobile ? "closed" : "open"}
                animate={isOpen ? "open" : "closed"}
                variants={sidebarVariants}
            >
                {/* Logo Section */}
                <div className="h-24 flex items-center justify-between px-6">
                    <AnimatePresence mode="wait">
                        {(isOpen || !isMobile) && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-3 overflow-hidden"
                            >
                                <div className="shrink-0 w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                                    <Mail size={20} fill="currentColor" />
                                </div>
                                {isOpen && (
                                    <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight whitespace-nowrap">
                                        CMS Portal
                                    </span>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isMobile && (
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400 focus:outline-none ml-auto"
                        >
                            {isOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    )}
                    {isMobile && isOpen && (
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Navigation Links */}
                <div className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar pt-6">
                    <div>
                        {isOpen && <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Menu</p>}
                        <div className="space-y-1.5">
                            {links.slice(0, 4).map((link) => (
                                <SidebarLink key={link.path} link={link} isOpen={isOpen} onClick={() => isMobile && setIsOpen(false)} />
                            ))}
                        </div>
                    </div>

                    <div>
                        {isOpen && <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Utility</p>}
                        <div className="space-y-1.5">
                            {links.slice(4).map((link) => (
                                <SidebarLink key={link.path} link={link} isOpen={isOpen} onClick={() => isMobile && setIsOpen(false)} />
                            ))}
                        </div>
                    </div>

                    {/* Pro Card */}
                    {isOpen && (
                        <div className="px-4 pt-4 pb-8">
                            <div className="bg-slate-900 rounded-[1.5rem] p-5 relative overflow-hidden group">
                                <div className="absolute top-2 right-2 w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/50">
                                    <Package size={14} />
                                </div>
                                <h4 className="text-white font-semibold text-sm mb-1 relative z-10">Academic Pro</h4>
                                <p className="text-slate-400 text-[11px] leading-relaxed mb-4 relative z-10">
                                    Get advanced features for students and instructors
                                </p>
                                <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all relative z-10 shadow-lg shadow-indigo-600/20">
                                    Upgrade to Pro
                                </button>

                                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Section */}
                <div className="p-4 border-t border-slate-50 dark:border-slate-800">
                    <button
                        onClick={handleLogout}
                        className={`
                            w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                            text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10
                            ${!isOpen && !isMobile && 'justify-center'}
                        `}
                    >
                        <LogOut size={20} />
                        {(isOpen || isMobile) && <span className="font-medium text-sm">Sign Out</span>}
                    </button>
                </div>
            </motion.div>
        </>
    );
};

const SidebarLink = ({ link, isOpen, onClick }) => (
    <NavLink
        to={link.path}
        onClick={onClick}
        className={({ isActive }) => `
            flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
            ${isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600'
            }
        `}
    >
        <span className="shrink-0">{link.icon}</span>
        <AnimatePresence>
            {isOpen && (
                <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-semibold text-sm whitespace-nowrap"
                >
                    {link.label}
                </motion.span>
            )}
        </AnimatePresence>
    </NavLink>
);

export default Sidebar;
