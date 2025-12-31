import React from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Bell,
    Shield,
    Smartphone,
    Globe,
    Save,
    Camera,
    Mail,
    Lock
} from 'lucide-react';

const AdminSettings = () => {
    return (
        <div className="pb-10">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">System Settings</h1>
                <p className="text-slate-400 text-sm mt-1 font-medium">Manage your personal profile and system preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="premium-card p-8 text-center"
                    >
                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <div className="w-full h-full rounded-[2.5rem] bg-indigo-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden ring-4 ring-white dark:ring-slate-900 shadow-xl">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Awais" alt="Admin Avatar" className="w-full h-full object-cover" />
                            </div>
                            <button className="absolute bottom-1 right-1 p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-500 transition-colors">
                                <Camera size={18} />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Awais laal</h2>
                        <p className="text-sm text-slate-400 font-medium mb-6 text-uppercase tracking-wider">Head Administrator</p>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-left border border-slate-100 dark:border-slate-800">
                                <Mail size={16} className="text-indigo-600" />
                                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">awais@cms.com</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-left border border-slate-100 dark:border-slate-800">
                                <Smartphone size={16} className="text-indigo-600" />
                                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">+92 300 1234567</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Settings Form */}
                <div className="lg:col-span-2 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="premium-card p-8"
                    >
                        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                            <User className="text-indigo-600" size={24} />
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Profile Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 text-left">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                                <input type="text" defaultValue="Awais laal" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20" />
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Job Title</label>
                                <input type="text" defaultValue="Head Administrator" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20" />
                            </div>
                            <div className="space-y-2 text-left md:col-span-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                                <input type="email" defaultValue="awais@cms.com" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ delay: 0.1 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="premium-card p-8"
                    >
                        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                            <Shield className="text-indigo-600" size={24} />
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">System Preferences</h3>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Two-Factor Authentication', desc: 'Secure your account with 2FA verification.', icon: Lock, status: true },
                                { label: 'Notification Alerts', desc: 'Receive real-time alerts for system events.', icon: Bell, status: true },
                                { label: 'Dark Mode', desc: 'Auto-switch between light and dark themes.', icon: Globe, status: false }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl group-hover:shadow-md transition-all">
                                            <item.icon size={20} className="text-slate-400 group-hover:text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">{item.label}</p>
                                            <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full relative transition-colors ${item.status ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${item.status ? 'left-7' : 'left-1'}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="flex justify-end gap-4">
                        <button className="px-8 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all">Discard Changes</button>
                        <button className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:-translate-y-1 transition-all">
                            <Save size={18} /> Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
