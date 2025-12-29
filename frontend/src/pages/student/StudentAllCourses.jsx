import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Clock, BarChart } from 'lucide-react';
import { toast } from 'react-toastify';
import studentService from '../../services/studentService';
import Card from '../../components/Card';
import Button from '../../components/Button';

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
            // Check enrollment logic...
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
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Explore Courses</h1>
                    <p className="text-slate-500 mt-1">Find your next skill to master</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for topic..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    <AnimatePresence>
                        {filteredCourses.map((course) => {
                            const courseId = course.id || course._id || course.course_id;
                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={courseId}
                                >
                                    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-800 group h-full flex flex-col">
                                        <div className="h-48 bg-slate-900 relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                                            {/* Decorative gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent opacity-80"></div>

                                            <div className="absolute bottom-4 left-4 right-4">
                                                <span className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-xs rounded-lg mb-2 inline-block">
                                                    Development
                                                </span>
                                                <h3 className="text-xl font-bold text-white leading-tight shadow-black drop-shadow-md">
                                                    {course.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} className="text-primary-500" /> 2h 45m
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <BarChart size={14} className="text-primary-500" /> Beginner
                                                </span>
                                            </div>

                                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2 flex-1">
                                                {course.description || 'Dive into this comprehensive course designed to master the fundamentals.'}
                                            </p>

                                            {course.is_enrolled ? (
                                                <Link to={`/student/course/${courseId}`}>
                                                    <Button variant="secondary" className="w-full">
                                                        Go to Course
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button onClick={() => handleEnroll(courseId)} className="w-full shadow-lg shadow-primary-500/30">
                                                    Enroll Now
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default StudentAllCourses;
