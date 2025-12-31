import React from 'react';
import { motion } from 'framer-motion';
import {
    Trophy,
    Star,
    Zap,
    Award,
    Target,
    TrendingUp,
    ChevronRight
} from 'lucide-react';

const AchievementCard = ({ title, desc, icon: Icon, progress, colorClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="premium-card p-6 flex flex-col h-full group"
    >
        <div className={`w-14 h-14 rounded-2xl ${colorClass} bg-opacity-10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
            <Icon size={28} className={colorClass.replace('bg-', 'text-')} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 font-medium mb-6 flex-1">{desc}</p>

        <div className="space-y-2 pt-4 border-t border-slate-50 dark:border-slate-800">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1.5">
                <span className="text-slate-400">Progress</span>
                <span className={colorClass.replace('bg-', 'text-')}>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full ${colorClass.replace('bg-opacity-10', '')}`}
                ></motion.div>
            </div>
        </div>
    </motion.div>
);

const StudentAchievements = () => {
    return (
        <div className="pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        My Achievements <Trophy className="text-orange-500" size={32} />
                    </h1>
                    <p className="text-slate-400 text-sm mt-1 font-medium italic">Unlock badges and rewards by completing milestones in your learning journey</p>
                </div>
                <div className="px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Points</p>
                        <p className="text-xl font-black text-slate-800 dark:text-white">2,450 XP</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                        <Star size={20} fill="currentColor" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AchievementCard
                    title="Early Bird"
                    desc="Finish your first lecture within 24 hours of enrollment."
                    icon={Zap}
                    progress={100}
                    colorClass="bg-orange-500"
                    delay={0}
                />
                <AchievementCard
                    title="Course Master"
                    desc="Complete a full course with an average quiz score of 90% or higher."
                    icon={Award}
                    progress={65}
                    colorClass="bg-indigo-600"
                    delay={0.1}
                />
                <AchievementCard
                    title="Fast Learner"
                    desc="Watch 10 hours of video content in a single week."
                    icon={TrendingUp}
                    progress={40}
                    colorClass="bg-green-600"
                    delay={0.2}
                />
                <AchievementCard
                    title="Community Hub"
                    desc="Post your first question in the community forum."
                    icon={Target}
                    progress={0}
                    colorClass="bg-purple-600"
                    delay={0.3}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 p-8 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10"
            >
                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">Claim Your Expert Badge</h3>
                    <p className="text-white/60 text-sm font-medium">You are only one course away from receiving your certificate of excellence!</p>
                </div>
                <button className="px-8 py-3.5 bg-white text-indigo-900 rounded-2xl text-sm font-bold shadow-xl hover:bg-slate-50 hover:-translate-y-1 transition-all flex items-center gap-2">
                    View My Certificates <ChevronRight size={18} />
                </button>
            </motion.div>
        </div>
    );
};

export default StudentAchievements;
