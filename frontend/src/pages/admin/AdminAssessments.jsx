import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import assessmentsService from '../../services/assessmentsService';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileSpreadsheet,
    Plus,
    Search,
    Filter,
    BookOpen,
    HelpCircle,
    Trash2,
    PlusCircle,
    ArrowRight,
    Save
} from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';

const AdminAssessments = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [quizzes, setQuizzes] = useState([]); // This would ideally fetch from backend if list exists
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newQuiz, setNewQuiz] = useState({ title: '', course_id: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await adminService.getAllCourses();
            setCourses(res.courses || []);
        } catch (e) {
            toast.error('Failed to load assessment data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateQuiz = async (e) => {
        e.preventDefault();
        if (!newQuiz.course_id) {
            toast.warning('Please select a course for this quiz');
            return;
        }
        try {
            await assessmentsService.createQuiz(newQuiz);
            toast.success('Assessment created successfully!');
            setShowCreateModal(false);
            setNewQuiz({ title: '', course_id: '' });
            // Refresh logic here if backend supports listing
        } catch (e) {
            toast.error('Failed to create assessment');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight text-center md:text-left">Assessment Center</h1>
                    <p className="text-slate-400 text-sm mt-1 font-medium text-center md:text-left">Design, assign, and track student performance through quizzes</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-100/50 hover:bg-indigo-500 hover:-translate-y-1 transition-all"
                >
                    <Plus size={18} /> New Assessment
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Course Selection & Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="premium-card p-6">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <Filter size={16} className="text-indigo-600" /> Filter by Course
                        </h3>
                        <div className="space-y-2">
                            {courses.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setSelectedCourse(c)}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border ${selectedCourse?.id === c.id
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                            : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    {c.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="premium-card p-6 bg-slate-900 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Insights</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Total Quizzes</span>
                                    <span className="font-bold">24</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Avg. Score</span>
                                    <span className="font-bold text-green-400">82%</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Pending Grades</span>
                                    <span className="font-bold text-orange-400">12</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
                    </div>
                </div>

                {/* Quizzes List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="premium-card p-8 min-h-[500px]">
                        {selectedCourse ? (
                            <div>
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600">
                                            <BookOpen size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-800 dark:text-white capitalize">{selectedCourse.title}</h2>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Assessments</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-black text-indigo-600">03</span>
                                        <p className="text-[10px] font-bold text-slate-400">TOTAL</p>
                                    </div>
                                </div>

                                {/* Placeholder for specific quiz listing */}
                                <div className="space-y-4">
                                    {[
                                        { id: 1, title: 'Midterm Evaluation', questions: 20, time: '60 min', status: 'Published' },
                                        { id: 2, title: 'Quick Knowledge Check', questions: 10, time: '15 min', status: 'Published' },
                                        { id: 3, title: 'Final Project Quiz', questions: 35, time: '120 min', status: 'Draft' }
                                    ].map(q => (
                                        <div key={q.id} className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-indigo-200 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm text-slate-400">
                                                    <HelpCircle size={18} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{q.title}</h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[10px] font-bold text-slate-400">{q.questions} Questions</span>
                                                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                                        <span className="text-[10px] font-bold text-slate-400">{q.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${q.status === 'Published' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'
                                                    }`}>
                                                    {q.status}
                                                </span>
                                                <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                                    <PlusCircle size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-50 space-y-6">
                                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-400">
                                    <FileSpreadsheet size={48} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No Course Selected</h3>
                                    <p className="text-xs font-medium text-slate-400 max-w-xs">Select a course from the sidebar to manage its assessments and quizzes.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600">
                                    <PlusCircle size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-800 dark:text-white">Create New Assessment</h4>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Assign quiz to a course</p>
                                </div>
                            </div>

                            <form onSubmit={handleCreateQuiz} className="space-y-6">
                                <Input
                                    label="Quiz Title"
                                    placeholder="e.g. Chapter 1: Introduction to React"
                                    value={newQuiz.title}
                                    onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                                    required
                                />

                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Target Course</label>
                                    <select
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-indigo-600/10 placeholder:text-slate-400 transition-all outline-none appearance-none"
                                        value={newQuiz.course_id}
                                        onChange={(e) => setNewQuiz({ ...newQuiz, course_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select a course...</option>
                                        {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                    </select>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Save size={16} /> Save & Open Designer
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminAssessments;
