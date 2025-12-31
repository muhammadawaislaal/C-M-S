import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import Button from '../components/Button';
import Input from '../components/Input';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { GraduationCap, UserPlus, ArrowRight, Quote, CheckCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const registerFn = role === 'admin' ? authService.registerAdmin : authService.registerStudent;
            const data = await registerFn(formData);

            toast.success(data.message || 'Account created successfully! Please sign in.');
            navigate('/login');
        } catch (error) {
            const errors = error.response?.data?.errors;
            if (errors) {
                Object.values(errors).forEach(errArray => {
                    errArray.forEach(msg => toast.error(msg));
                });
            } else {
                toast.error(error.response?.data?.message || 'Registration failed. Please check your details.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row shadow-slate-200/50 dark:shadow-slate-900/50">

                {/* Information Pane */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="md:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 p-12 text-white flex flex-col justify-between relative overflow-hidden"
                >
                    <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-blue-500/30 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-8">
                            <GraduationCap size={40} className="text-white/90" />
                            <span className="text-2xl font-bold tracking-tight">CMS Portal</span>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold leading-tight">
                                Start Your <br />
                                <span className="text-indigo-200">Learning</span> Journey.
                            </h2>
                            <p className="text-indigo-100 text-lg leading-relaxed max-w-sm">
                                Join thousands of students and educators in a modern ecosystem designed for academic excellence.
                            </p>

                            <ul className="space-y-4 mt-8">
                                {[
                                    'Access to premium course materials',
                                    'Personalized learning dashboards',
                                    'Collaborative community forums',
                                    'Interactive assessments & tracking'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-indigo-50">
                                        <CheckCircle size={18} className="text-indigo-300" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                        <Quote size={24} className="text-indigo-300 mb-2 opacity-50" />
                        <p className="text-sm font-medium italic text-indigo-50">
                            "The beautiful thing about learning is that no one can take it away from you."
                        </p>
                        <cite className="block mt-2 text-xs text-indigo-200 not-italic font-semibold">— B.B. King</cite>
                    </div>
                </motion.div>

                {/* Registration Form Pane */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="md:w-1/2 p-12 flex flex-col justify-center"
                >
                    <div className="text-center md:text-left mb-8">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                            <UserPlus size={24} className="text-indigo-600" />
                            <h3 className="text-3xl font-bold text-slate-800 dark:text-white">Create Account</h3>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">Enter your details to register as a {role}.</p>
                    </div>

                    {/* Role Selector */}
                    <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex mb-8">
                        <button
                            type="button"
                            onClick={() => setRole('student')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${role === 'student'
                                ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm transform scale-[1.02]'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                                }`}
                        >
                            Student
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('admin')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${role === 'admin'
                                ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm transform scale-[1.02]'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                                }`}
                        >
                            Instructor/Admin
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-indigo-500"
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            required
                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-indigo-500"
                        />
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            minLength={8}
                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-indigo-500"
                        />

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full py-3.5 text-base bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-shadow"
                                isLoading={loading}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Register Now <ArrowRight size={18} />
                                </span>
                            </Button>
                        </div>

                        <div className="text-center mt-6">
                            <p className="text-sm text-slate-500">
                                Already have an account?{' '}
                                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold underline underline-offset-4">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
