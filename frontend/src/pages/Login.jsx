import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import Button from '../components/Button';
import Input from '../components/Input';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, Eye, Globe } from 'lucide-react';
import loginIllustration from '../assets/login_illustration.png';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const loginFn = role === 'admin' ? authService.loginAdmin : authService.loginStudent;
            const data = await loginFn(formData);

            login(formData, data.token);
            toast.success(`Welcome back! Successfully logged in as ${role}.`);

            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/student');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F2EBFA] p-4 md:p-8 font-['Plus_Jakarta_Sans']">
            <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-12 lg:gap-24">

                {/* Form Side */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full md:w-[480px] bg-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-14 shadow-2xl shadow-purple-200/50"
                >
                    <div className="flex items-center justify-between mb-8 md:mb-10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                                <GraduationCap size={20} />
                            </div>
                            <span className="text-xl font-black text-slate-800 tracking-tight">CMS.</span>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-[44px] font-extrabold text-[#111] leading-tight mb-6 md:mb-8 text-center md:text-left">Sign in</h1>

                    <div className="flex flex-col sm:flex-row gap-3 mb-8 md:mb-10">
                        <button className="flex-1 flex items-center justify-center gap-3 py-3 px-4 bg-[#4A86E8] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all">
                            <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                <span className="text-blue-600 text-[10px] font-black">G</span>
                            </span>
                            Sign in with Google
                        </button>
                        <button className="w-full sm:w-12 h-12 bg-[#FF71A4] text-white rounded-xl flex items-center justify-center shadow-lg shadow-pink-100">
                            <Globe size={20} />
                        </button>
                    </div>

                    {/* Role Selection Tabs */}
                    <div className="flex gap-4 mb-6 md:mb-8 justify-center md:justify-start">
                        <button
                            onClick={() => setRole('student')}
                            className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${role === 'student' ? 'bg-black text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                            Student
                        </button>
                        <button
                            onClick={() => setRole('admin')}
                            className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${role === 'admin' ? 'bg-black text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                            Staff
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="katelova24@gmail.com"
                                required
                                className="w-full px-5 py-3.5 md:px-6 md:py-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold focus:border-[#42BB4E] transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between px-1">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                                <a href="#" className="text-[11px] font-black text-[#4A86E8] uppercase tracking-widest">Forgot password?</a>
                            </div>
                            <div className="relative group">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="•••••••••••••••"
                                    required
                                    className="w-full px-5 py-3.5 md:px-6 md:py-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold focus:border-[#42BB4E] transition-all outline-none"
                                />
                                <Eye className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-500" size={18} />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-center md:justify-start">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-[140px] py-4 bg-[#111] text-white rounded-2xl text-xs font-black uppercase tracking-[0.15em] shadow-2xl shadow-black/20 hover:-translate-y-1 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Checking...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 pt-10 border-t border-slate-50">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            Authorized access only. Logins are monitored.
                        </p>
                    </div>
                </motion.div>

                {/* Illustration Side */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="hidden md:block flex-1"
                >
                    <img
                        src={loginIllustration}
                        alt="3D Illustration"
                        className="w-full h-auto object-contain max-h-[700px] drop-shadow-2xl"
                    />
                </motion.div>

            </div>
        </div>
    );
};

export default Login;
