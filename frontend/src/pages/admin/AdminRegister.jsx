import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import { toast } from 'react-toastify';
import { UserPlus, Shield, User } from 'lucide-react';

const AdminRegister = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'student' // default
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
            if (formData.role === 'admin') {
                await authService.registerAdmin(formData);
            } else {
                await authService.registerStudent(formData);
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
        <div className="flex justify-center">
            <Card className="w-full max-w-lg">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary-100 rounded-xl text-primary-600">
                        <UserPlus size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Register New User</h1>
                        <p className="text-slate-500">Create account for student or administrator</p>
                    </div>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg mb-6">
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${formData.role === 'student'
                            ? 'bg-white dark:bg-dark-surface text-primary-600 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                            }`}
                        onClick={() => setFormData({ ...formData, role: 'student' })}
                        type="button"
                    >
                        <User size={16} /> Student Account
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${formData.role === 'admin'
                            ? 'bg-white dark:bg-dark-surface text-purple-600 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                            }`}
                        onClick={() => setFormData({ ...formData, role: 'admin' })}
                        type="button"
                    >
                        <Shield size={16} /> Admin Account
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Username"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="johndoe"
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                    />
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="••••••••"
                        minLength={6}
                    />

                    <div className="pt-4">
                        <Button type="submit" className="w-full" isLoading={loading}>
                            Create Account
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AdminRegister;
