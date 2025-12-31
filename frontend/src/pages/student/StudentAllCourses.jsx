import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Search,
    BookOpen,
    Clock,
    BarChart,
    ArrowRight,
    Star,
    Layers,
    Filter
} from 'lucide-react';
import { toast } from 'react-toastify';
import studentService from '../../services/studentService';

const StudentAllCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await studentService.getActiveCourses();
            const coursesWithStatus = await Promise.all(data.map(async (course) => {
                try {
                    const safeId = course.id || course._id || course.course_id;
                    await studentService.getCourseLectures(safeId);
                    return { ...course, is_enrolled: true };
                } catch (err) {
                    return { ...course, is_enrolled: false };
                }
            }));
            setCourses(coursesWithStatus);
        } catch (error) {
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId) => {
        try {
            await studentService.enrollCourse(courseId);
            toast.success('Enrolled successfully! 🎉');
            setCourses(prev => prev.map(c => {
                const id = c.id || c._id || c.course_id;
                return id === courseId ? { ...c, is_enrolled: true } : c;
            }));
        } catch (error) {
            toast.error('Enrollment failed - ' + (error.response?.data?.msg || 'Unknown error'));
        }
    };

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pb-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">Explore Knowledge</h1>
                    <p className="text-slate-400 text-sm mt-1 font-medium italic">Discover your next obsession from our curated catalog</p>
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative group flex-1 lg:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find a course or skill..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
                        />
                    </div>
                    <button className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-colors shadow-sm">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse">Scanning Course Galaxy...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredCourses.map((course, index) => {
                            const courseId = course.id || course._id || course.course_id;
                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={courseId}
                                    className="premium-card p-0 overflow-hidden group flex flex-col h-full bg-white dark:bg-slate-900"
                                >
                                    <div className="relative h-52 bg-slate-900 overflow-hidden">
                                        <img
                                            src={`https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60&seed=${courseId}`}
                                            alt={course.title}
                                            className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[9px] font-bold rounded-lg uppercase tracking-widest flex items-center gap-1.5 ring-1 ring-white/30">
                                                <Layers size={10} /> {course.category || 'Premium'}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 right-4 flex items-center gap-1">
                                            <Star size={12} className="text-orange-400 fill-orange-400" />
                                            <span className="text-white text-[10px] font-bold">4.9</span>
                                        </div>
                                    </div>

                                    <div className="p-7 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 line-clamp-1 group-hover:text-indigo-600 transition-colors tracking-tight">
                                            {course.title}
                                        </h3>

                                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-indigo-500" /> 2h 45m
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <BarChart size={14} className="text-indigo-500" /> Beginner
                                            </span>
                                        </div>

                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 line-clamp-2 leading-relaxed flex-1">
                                            {course.description || 'Dive into this comprehensive course designed to master the fundamentals and advanced topics.'}
                                        </p>

                                        {course.is_enrolled ? (
                                            <Link to={`/student/course/${courseId}`} className="w-full">
                                                <button className="w-full py-3.5 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2 group/btn">
                                                    Go to Learning Hub <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={() => handleEnroll(courseId)}
                                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 hover:bg-indigo-500 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                Enroll Now +
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {filteredCourses.length === 0 && !loading && (
                <div className="py-24 text-center">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                        <Search size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">No courses match your search</h3>
                    <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                </div>
            )}
        </div>
    );
};

export default StudentAllCourses;
