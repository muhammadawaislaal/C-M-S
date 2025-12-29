import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import Button from '../components/Button';
import Input from '../components/Input';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { GraduationCap, Lock, ArrowRight, Quote } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [role, setRole] = useState('student'); // 'student' or 'admin'
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row shadow-slate-200/50 dark:shadow-slate-900/50">

                {/* Left Side - Inspirational Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="md:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-white flex flex-col justify-between relative overflow-hidden"
                >
                    {/* Abstract Shapes */}
                    <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-purple-500/30 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-8">
                            <GraduationCap size={40} className="text-white/90" />
                            <span className="text-2xl font-bold tracking-tight">CMS Portal</span>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold leading-tight">
                                Unlock Your <br />
                                <span className="text-primary-200">Potential</span> Today.
                            </h2>
                            <p className="text-primary-100 text-lg leading-relaxed max-w-sm">
                                Access world-class education and manage your learning journey with clear insights and seamless tools.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 mt-12">
                        <Quote size={32} className="text-primary-300 mb-4 opacity-50" />
                        <blockquote className="text-xl font-medium italic text-primary-50">
                            "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
                        </blockquote>
                        <cite className="block mt-4 text-primary-200 not-italic font-semibold">— Malcolm X</cite>
                    </div>
                </motion.div>

                {/* Right Side - Login Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:w-1/2 p-12 flex flex-col justify-center"
                >
                    <div className="text-center md:text-left mb-8">
                        <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Welcome Back</h3>
                        <p className="text-slate-500 dark:text-slate-400">Please enter your details to sign in.</p>
                    </div>

                    {/* Role Toggles */}
                    <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex mb-8">
                        <button
                            onClick={() => setRole('student')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${role === 'student'
                                    ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm transform scale-[1.02]'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                                }`}
                        >
                            Student Portal
                        </button>
                        <button
                            onClick={() => setRole('admin')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${role === 'admin'
                                    ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm transform scale-[1.02]'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                                }`}
                        >
                            Admin Access
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            required
                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-primary-500"
                        />
                        <div>
                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-primary-500"
                            />
                            <div className="flex justify-end mt-2">
                                <a href="#" className="text-xs font-medium text-primary-600 hover:text-primary-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-3.5 text-base shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-shadow"
                            isLoading={loading}
                        >
                            <span className="flex items-center justify-center gap-2">
                                Sign In <ArrowRight size={18} />
                            </span>
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-xs text-slate-400">
                        {role === 'student'
                            ? "Don't have an account? Contact your administrator."
                            : "Protected area. Authorized personnel only."
                        }
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
