import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';

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

            toast.success(data.message);
            navigate('/login');
        } catch (error) {
            // API might return validation errors in error.response.data.errors
            const errors = error.response?.data?.errors;
            if (errors) {
                Object.values(errors).forEach(errArray => {
                    errArray.forEach(msg => toast.error(msg));
                });
            } else {
                toast.error(error.response?.data?.message || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <Card className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
                            Create Account
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Join our learning platform</p>
                    </div>

                    <div className="flex bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg mb-6">
                        <button
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'student'
                                    ? 'bg-white dark:bg-dark-surface text-primary-600 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                            onClick={() => setRole('student')}
                        >
                            Student
                        </button>
                        <button
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === 'admin'
                                    ? 'bg-white dark:bg-dark-surface text-primary-600 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                            onClick={() => setRole('admin')}
                        >
                            Admin
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
                        />
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimum 8 characters"
                            required
                            minLength={8}
                        />

                        <div className="pt-4">
                            <Button type="submit" className="w-full" isLoading={loading}>
                                Register
                            </Button>
                        </div>

                        <div className="text-center mt-4">
                            <span className="text-slate-500 text-sm">Already have an account? </span>
                            <Link to="/login" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                Sign In
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default Register;
