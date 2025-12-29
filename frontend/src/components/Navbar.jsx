import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import { Menu, X, LogOut, User, BookOpen, Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(false); // In a real app, use a theme context

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleTheme = () => {
        const html = document.documentElement;
        if (isDark) {
            html.classList.remove('dark');
        } else {
            html.classList.add('dark');
        }
        setIsDark(!isDark);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            C
                        </div>
                        <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
                            CMS
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden md:block">
                                    {user.email} ({user.role})
                                </span>
                                <Button variant="secondary" onClick={handleLogout} className="!px-3 !py-1.5 text-sm">
                                    <LogOut size={16} />
                                    <span className="hidden sm:inline">Logout</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login">
                                    <Button variant="secondary" className="!px-4 !py-1.5">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="!px-4 !py-1.5">Register</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
