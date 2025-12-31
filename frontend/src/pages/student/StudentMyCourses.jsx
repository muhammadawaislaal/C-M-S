import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    PlayCircle,
    Clock,
    MoreHorizontal,
    BookOpen,
    ChevronRight,
    Search,
    Filter
} from 'lucide-react';
import studentService from '../../services/studentService';

const StudentMyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEnrolledCourses();
    }, []);

    const fetchEnrolledCourses = async () => {
        try {
            const data = await studentService.getActiveCourses();
            const enrolled = await Promise.all(data.map(async (c) => {
                try {
                    const id = c.id || c._id || c.course_id;
                    await studentService.getCourseLectures(id);
                    return { ...c, is_enrolled: true, progress: Math.floor(Math.random() * 100) }; // Random progress for UI demo
                } catch {
                    return null;
                }
            }));
            setCourses(enrolled.filter(Boolean));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">My Learning Journey</h1>
                    <p className="text-slate-400 text-sm mt-1 font-medium italic">Continue mastering your skills where you left off</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search my courses..."
                            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-10 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all w-64"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing your progress...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {courses.map((course, index) => (
                        <motion.div
                            key={course.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="premium-card p-0 overflow-hidden group flex flex-col h-full"
                        >
                            <div className="relative h-40 bg-slate-100 overflow-hidden">
                                <img
                                    src={`https://images.unsplash.com/photo-1542744094-3a31f08e78ec?w=600&auto=format&fit=crop&q=60&seed=${index}`}
                                    alt={course.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <span className="px-2 py-0.5 bg-indigo-600 text-[9px] font-bold text-white rounded-md uppercase tracking-wider">In Progress</span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1">{course.title}</h3>
                                    <button className="text-slate-400 hover:text-indigo-600"><MoreHorizontal size={18} /></button>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mb-6 flex-1">
                                    {course.description || "Dive back into the core concepts and master this topic with our expert-led materials."}
                                </p>

                                <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-[10px] font-bold">
                                            <span className="text-slate-400 uppercase tracking-widest">Progress</span>
                                            <span className="text-indigo-600">{course.progress || 0}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${course.progress || 0}%` }}
                                                className="h-full bg-indigo-600"
                                            ></motion.div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase italic">
                                            <Clock size={12} /> Last accessed 2d ago
                                        </div>
                                        <Link
                                            to={`/student/course/${course.id || course._id || course.course_id}`}
                                            className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95"
                                        >
                                            <ChevronRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {courses.length === 0 && (
                        <div className="col-span-full py-20 text-center space-y-6">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-sm">
                                <BookOpen size={32} className="text-slate-300" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Your library is empty</h3>
                                <p className="text-slate-400 text-sm mt-2">Discover curated content and start your learning today.</p>
                            </div>
                            <Link to="/student/courses" className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-500 transition-all">
                                Browse Catalog
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentMyCourses;
