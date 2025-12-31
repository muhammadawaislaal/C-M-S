import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { UserPlus, Shield, User } from 'lucide-react';

const AdminRegister = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Construct payload expected by backend: use `name` (not `username`) and omit `role`.
            const payload = {
                name: formData.username,
                email: formData.email,
                password: formData.password
            };

            if (formData.role === 'admin') {
                await authService.registerAdmin(payload);
            } else {
                await authService.registerStudent(payload);
            }

            toast.success(`Successfully registered new ${formData.role}!`);
            navigate('/admin/students');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card p-12"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                            <UserPlus size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Onboard New User</h1>
                            <p className="text-slate-400 font-medium text-sm mt-1">Create accounts for students or fellow administrators</p>
                        </div>
                    </div>

                    {/* Role Indicator */}
                    <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'student' })}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${formData.role === 'student'
                                ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm shadow-indigo-100/50'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <User size={16} /> Student
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'admin' })}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${formData.role === 'admin'
                                ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-sm shadow-purple-100/50'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Shield size={16} /> Admin
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Input
                            label="System Username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="e.g. john_doe"
                            className="bg-slate-50 border-slate-200 focus:ring-4 focus:ring-indigo-500/5"
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="john@university.edu"
                            className="bg-slate-50 border-slate-200 focus:ring-4 focus:ring-indigo-500/5"
                        />
                    </div>

                    <div className="max-w-md">
                        <Input
                            label="Initialize Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            minLength={6}
                            className="bg-slate-50 border-slate-200 focus:ring-4 focus:ring-indigo-500/5"
                        />
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-3 px-1">
                            Recommended: 8+ characters with mixed symbols
                        </p>
                    </div>

                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                        <Button
                            type="submit"
                            className={`px-12 py-4 shadow-xl transition-all ${formData.role === 'admin'
                                ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-100'
                                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                                }`}
                            isLoading={loading}
                        >
                            <span className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
                                Confirm & Create Account
                            </span>
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminRegister;
