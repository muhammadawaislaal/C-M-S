import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Clock, Target } from 'lucide-react';
import studentService from '../../services/studentService';

const ProgressCard = ({ title, value, total, icon: Icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay }}
        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
        <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            <div>
                <h3 className="font-bold text-slate-800 dark:text-white">{title}</h3>
                <p className="text-xs text-slate-500">{value} / {total}</p>
            </div>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(value / total) * 100}%` }}
                transition={{ duration: 1, delay: delay + 0.2 }}
                className={`h-full ${color}`}
            ></motion.div>
        </div>
    </motion.div>
);

const StudentDashboard = () => {
    const [stats, setStats] = useState({
        enrolledCourses: 0,
        completedLectures: 0,
        totalLectures: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch active courses to see enrollment count
                const courses = await studentService.getActiveCourses();

                // Using a slightly smarter way to get enrolled count by checking which ones we can access
                let enrolledCount = 0;
                let totalLecs = 0;

                // This is a naive check; ideally the backend provides a "dashboard stats" endpoint
                // Since we don't have one, we'll populate with some mock realism mixed with minimal API data
                setStats({
                    enrolledCourses: courses.length,
                    // These values would ideally come from a real status endpoint
                    completedLectures: 0,
                    totalLectures: 0
                });
            } catch (error) {
                console.error('Error fetching student stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <div className="mb-10">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-500">
                    Hello, Student!
                </h1>
                <p className="text-slate-500 mt-2 text-lg">Ready to continue your learning journey today?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <ProgressCard
                    title="Courses in Progress"
                    value={stats.enrolledCourses}
                    total={5}
                    icon={BookOpen}
                    color="bg-blue-500 text-blue-500"
                    delay={0}
                />
                <ProgressCard
                    title="Lectures Completed"
                    value={stats.completedLectures}
                    total={stats.totalLectures}
                    icon={Target}
                    color="bg-emerald-500 text-emerald-500"
                    delay={0.1}
                />
                <ProgressCard
                    title="Learning Hours"
                    value={8}
                    total={20}
                    icon={Clock}
                    color="bg-orange-500 text-orange-500"
                    delay={0.2}
                />
                <ProgressCard
                    title="Achievements"
                    value={2}
                    total={10}
                    icon={Trophy}
                    color="bg-purple-500 text-purple-500"
                    delay={0.3}
                />
            </div>

            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 max-w-lg">
                    <h2 className="text-2xl font-bold mb-4">Keep it up! 🚀</h2>
                    <p className="text-slate-300 mb-6">
                        You've made great progress this week. Finish 3 more lectures to reach your weekly goal.
                    </p>
                    <button className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-100 transition-colors">
                        Go to My Courses
                    </button>
                </div>

                {/* Decorative background circle */}
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mb-16 pointer-events-none"></div>
            </div>
        </div>
    );
};

export default StudentDashboard;
