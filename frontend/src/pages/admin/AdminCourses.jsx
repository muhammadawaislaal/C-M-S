import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Video,
    BookOpen,
    MoreVertical,
    Calendar
} from 'lucide-react';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';
import Button from '../../components/Button';
import Card from '../../components/Card';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        const results = courses.filter(course =>
            course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCourses(results);
    }, [searchTerm, courses]);

    const fetchCourses = async () => {
        try {
            const data = await adminService.getAllCourses();
            setCourses(data.courses || []);
            setFilteredCourses(data.courses || []);
        } catch (error) {
            toast.error('Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (courseId, courseTitle) => {
        if (window.confirm(`Are you sure you want to delete "${courseTitle}"?`)) {
            try {
                await adminService.deleteCourse(courseId);
                toast.success('Course deleted successfully');
                fetchCourses();
            } catch (error) {
                toast.error('Failed to delete course');
            }
        }
    };

    const getCourseId = (course) => course.id || course._id || course.course_id;

    return (
        <div>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                        My Courses
                    </h1>
                    <p className="text-slate-500 mt-1">Manage and organize your course content</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none w-64 transition-all"
                        />
                    </div>
                    <Link to="/admin/add-course">
                        <Button className="flex items-center gap-2 rounded-xl shadow-lg shadow-primary-500/20">
                            <Plus size={20} />
                            Create Course
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Mobile Search - Visible only on small screens */}
            <div className="md:hidden relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
                >
                    <AnimatePresence>
                        {filteredCourses.map((course) => {
                            const courseId = getCourseId(course);
                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    key={courseId}
                                >
                                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                        {/* Course Image / Placeholder */}
                                        <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 bg-primary-500/5 group-hover:bg-primary-500/10 transition-colors"></div>
                                            <BookOpen size={48} className="text-slate-300 dark:text-slate-600 group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-purple-600 shadow-sm">
                                                {course.category || 'Development'}
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 line-clamp-1">
                                                {course.title}
                                            </h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                                                {course.description || 'No description provided.'}
                                            </p>

                                            <div className="flex items-center gap-4 text-xs text-slate-500 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                                                <span className="flex items-center gap-1.5">
                                                    <Video size={14} className="text-primary-500" />
                                                    {course.lecture_count || 0} Lectures
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar size={14} className="text-primary-500" />
                                                    Updated Recently
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between gap-2">
                                                <Link to={`/admin/add-lecture/${courseId}`} className="flex-1">
                                                    <Button variant="secondary" className="w-full text-xs font-semibold flex items-center justify-center gap-2">
                                                        <Plus size={14} /> Add Content
                                                    </Button>
                                                </Link>
                                                <div className="flex gap-2">
                                                    <Link to={`/admin/edit-course/${courseId}`} state={{ course }}>
                                                        <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                                            <Edit size={18} />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(courseId, course.title)}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            )}

            {!loading && filteredCourses.length === 0 && (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6">
                        <BookOpen size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No courses found</h3>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">
                        {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first course content.'}
                    </p>
                    <Link to="/admin/add-course">
                        <Button className="px-8 flex items-center gap-2 mx-auto">
                            <Plus size={20} />
                            Create New Course
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default AdminCourses;
