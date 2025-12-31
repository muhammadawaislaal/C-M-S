import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    Users,
    Target,
    Clock,
    ChevronDown,
    Download,
    Filter
} from 'lucide-react';

const Analytics = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulated API fetch
        setTimeout(() => {
            setSummary({
                completionRate: '78%',
                avgScore: '84%',
                activeUsers: 1420,
                engagementRate: '+12.4%',
                weeklyData: [45, 62, 58, 75, 90, 82, 95]
            });
            setLoading(false);
        }, 800);
    }, []);

    const MetricCard = ({ title, value, detail, icon: Icon, trend, colorClass, delay }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="premium-card p-6"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10`}>
                    <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">
                        <TrendingUp size={12} /> {trend}
                    </div>
                )}
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">{value}</h3>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">{detail}</p>
        </motion.div>
    );

    return (
        <div className="pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Learning Analytics</h1>
                    <p className="text-slate-400 text-sm mt-1 font-medium">Detailed insights into student performance and engagement</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        <Filter size={16} /> Filter <ChevronDown size={14} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    title="Completion Rate"
                    value={summary?.completionRate || '0%'}
                    detail="Average student course completion"
                    icon={Target}
                    trend="+5.2%"
                    colorClass="bg-indigo-600"
                    delay={0}
                />
                <MetricCard
                    title="Average Score"
                    value={summary?.avgScore || '0%'}
                    detail="Final assessment performance"
                    icon={BarChart3}
                    trend="+2.1%"
                    colorClass="bg-purple-600"
                    delay={0.1}
                />
                <MetricCard
                    title="Active Users"
                    value={summary?.activeUsers?.toLocaleString() || '0'}
                    detail="Unique learners this month"
                    icon={Users}
                    trend="+14.5%"
                    colorClass="bg-green-600"
                    delay={0.2}
                />
                <MetricCard
                    title="Learning Time"
                    value="4.2h"
                    detail="Average daily platform usage"
                    icon={Clock}
                    colorClass="bg-orange-600"
                    delay={0.3}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="premium-card p-8 lg:col-span-2"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Engagement Trend</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-[9px]">Activity</span>
                            </div>
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">Last 7 Days</span>
                        </div>
                    </div>

                    <div className="h-64 w-full flex items-end justify-between gap-3 px-4">
                        {summary?.weeklyData.map((h, i) => (
                            <div key={i} className="flex-1 max-w-[40px] flex flex-col items-center gap-3 group">
                                <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl h-full relative overflow-hidden group-hover:bg-slate-100 transition-colors">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                        className="absolute bottom-0 w-full bg-indigo-600 rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity"
                                    ></motion.div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 capitalize">{['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][i]}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="premium-card p-8"
                >
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Device Distribution</h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Desktop App', perc: 65, color: 'bg-indigo-600' },
                            { label: 'Mobile Web', perc: 25, color: 'bg-purple-500' },
                            { label: 'Tablet Viewer', perc: 10, color: 'bg-orange-400' }
                        ].map((device, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-600">{device.label}</span>
                                    <span className="text-slate-800">{device.perc}%</span>
                                </div>
                                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${device.perc}%` }}
                                        className={`h-full ${device.color}`}
                                    ></motion.div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Analytics;
