import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import studentService from '../../services/studentService';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlayCircle,
    FileText,
    Lock,
    CheckCircle,
    ChevronLeft,
    Download,
    ChevronRight,
    BookOpen,
    Clock,
    RotateCcw
} from 'lucide-react';

const LectureViewer = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [lectures, setLectures] = useState([]);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        fetchLectures();
    }, [courseId]);

    const fetchLectures = async () => {
        try {
            const data = await studentService.getCourseLectures(courseId);
            setLectures(data || []);
            if (data && data.length > 0 && !currentLecture) {
                const firstActive = data.find(l => !l.is_locked) || data[0];
                setCurrentLecture(firstActive);
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to load lectures');
        } finally {
            setLoading(false);
        }
    };

    const handleLectureClick = lecture => {
        if (lecture.is_locked) {
            toast.info('Complete previous lectures to unlock this one.');
            return;
        }
        setCurrentLecture(lecture);
    };

    const handleMarkComplete = async () => {
        if (!currentLecture) return;
        try {
            await studentService.completeLecture(currentLecture.id);
            toast.success('Progress saved! Keep going! 🚀');
            await fetchLectures();
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to complete lecture');
        }
    };

    const getEmbedUrl = url => {
        if (!url) return '';
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(youtubeRegex);
        if (match && match[1]) return `https://www.youtube.com/embed/${match[1]}?autoplay=0&modestbranding=1&rel=0`;
        return url;
    };

    const renderContent = () => {
        if (!currentLecture || currentLecture.is_locked) {
            return (
                <div className="flex flex-col items-center justify-center h-[500px] bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                    <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
                        <Lock size={48} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Content Locked</h3>
                    <p className="text-slate-400 text-sm max-w-xs text-center">Please complete the preceding lectures to unlock this session.</p>
                </div>
            );
        }

        if (currentLecture.type === 'video') {
            const embedUrl = getEmbedUrl(currentLecture.content_url);
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl relative group ring-1 ring-slate-200 dark:ring-slate-800"
                >
                    <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        allowFullScreen
                        title={currentLecture.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                </motion.div>
            );
        }

        if (currentLecture.type === 'pdf') {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-[500px] bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 text-center"
                >
                    <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/20 rounded-[2rem] mb-8 flex items-center justify-center animate-bounce">
                        <FileText size={48} className="text-orange-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 tracking-tight">Reading Material Detected</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md font-medium">
                        This lecture includes a comprehensive PDF resource. Download it now to follow along or for offline reference.
                    </p>
                    <button className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-100 hover:-translate-y-1">
                        <Download size={20} /> Access Document
                    </button>
                </motion.div>
            );
        }

        return <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest">Unsupported Content Type</div>;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <RotateCcw size={40} className="text-indigo-600 animate-spin" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Preparing your Workspace...</p>
            </div>
        );
    }

    return (
        <div className="pb-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/student/my-courses')}
                        className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-colors shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">Learning Hub</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Course Experience</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Progress</span>
                        <span className="text-sm font-bold text-indigo-600">Step {lectures.filter(l => l.is_completed).length} of {lectures.length}</span>
                    </div>
                    <div className="h-10 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1">
                        <div
                            className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                            style={{ width: `${(lectures.filter(l => l.is_completed).length / (lectures.length || 1)) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
                {/* Main Content Area */}
                <div className={`${isSidebarCollapsed ? 'lg:col-span-11' : 'lg:col-span-8'} space-y-6 transition-all duration-500`}>
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white capitalize tracking-tight flex items-center gap-3">
                                    {currentLecture?.title}
                                    {currentLecture?.is_completed && <CheckCircle size={22} className="text-green-500" />}
                                </h2>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                                    <Clock size={12} /> {currentLecture?.type === 'video' ? '15 MIN DURATION' : 'PDF DOCUMENT'}
                                </p>
                            </div>

                            {!currentLecture?.is_completed && !currentLecture?.is_locked && (
                                <button
                                    onClick={handleMarkComplete}
                                    className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-500 hover:-translate-y-1 transition-all"
                                >
                                    Finish Lecture
                                </button>
                            )}
                        </div>

                        {renderContent()}

                        <div className="premium-card p-8">
                            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4">About this session</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                {currentLecture?.description || "In this session, we dive deep into core architectural patterns and implementation strategies. Pay close attention to the section on state management and rendering cycles."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Course Content Sidebar */}
                <div className={`${isSidebarCollapsed ? 'lg:col-span-1' : 'lg:col-span-4'} flex flex-col h-full transition-all duration-500`}>
                    <div className="premium-card flex flex-col h-full p-0 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center whitespace-nowrap overflow-hidden">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <BookOpen size={18} className="text-indigo-600" />
                                {!isSidebarCollapsed && "Course Content"}
                            </h3>
                            <button
                                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                            >
                                {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronRight size={20} className="rotate-180" />}
                            </button>
                        </div>

                        {!isSidebarCollapsed && (
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
                                {lectures.map((lecture, index) => (
                                    <motion.div
                                        key={lecture.id || index}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleLectureClick(lecture)}
                                        className={`p-4 rounded-2xl cursor-pointer transition-all border group relative ${currentLecture?.id === lecture.id
                                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10'
                                                : 'border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                            } ${lecture.is_locked ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${lecture.is_completed ? 'bg-green-100 text-green-600' :
                                                    lecture.is_locked ? 'bg-slate-100 text-slate-400' :
                                                        currentLecture?.id === lecture.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {lecture.is_completed ? <CheckCircle size={14} /> :
                                                    lecture.is_locked ? <Lock size={14} /> :
                                                        lecture.type === 'video' ? <PlayCircle size={14} /> : <FileText size={14} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-[11px] font-bold uppercase transition-colors ${currentLecture?.id === lecture.id ? 'text-indigo-600' : 'text-slate-800 dark:text-white'}`}>
                                                    {index + 1}. {lecture.title}
                                                </p>
                                                <p className="text-[9px] text-slate-400 font-medium tracking-[0.1em] mt-0.5">{lecture.type}</p>
                                            </div>
                                            <ChevronRight size={14} className={`text-slate-300 transition-transform group-hover:translate-x-1 ${currentLecture?.id === lecture.id ? 'text-indigo-600' : ''}`} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {isSidebarCollapsed && (
                            <div className="flex-1 flex flex-col items-center py-6 gap-6">
                                {lectures.map((l, i) => (
                                    <div
                                        key={i}
                                        onClick={() => handleLectureClick(l)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all ${currentLecture?.id === l.id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'}`}
                                    >
                                        <span className="text-[10px] font-bold">{i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LectureViewer;
