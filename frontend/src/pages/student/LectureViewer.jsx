import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import studentService from '../../services/studentService';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import { PlayCircle, FileText, Lock, CheckCircle, ChevronLeft, Download } from 'lucide-react';

const LectureViewer = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [lectures, setLectures] = useState([]);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLectures();
    }, [courseId]);

    const fetchLectures = async () => {
        try {
            const data = await studentService.getCourseLectures(courseId);
            setLectures(data);
            // Select the first unlocked lecture if none selected
            if (data.length > 0 && !currentLecture) {
                // Find first not completed or just the first one
                const firstActive = data.find(l => !l.is_locked) || data[0];
                setCurrentLecture(firstActive);
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to load lectures');
            // If unauthorized or not enrolled, maybe redirect
        } finally {
            setLoading(false);
        }
    };

    const handleLectureClick = (lecture) => {
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
            toast.success('Lecture completed!');
            // Refresh lectures to unlock next one and update status
            await fetchLectures();
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to complete lecture');
        }
    };

    // Helper to render content
    const renderContent = () => {
        if (!currentLecture || currentLecture.is_locked) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <Lock size={48} className="mb-4 opacity-50" />
                    <p>Content is locked or unavailable</p>
                </div>
            )
        }

        if (currentLecture.type === 'video') {
            // Helper to extract video ID and create embed URL
            const getEmbedUrl = (url) => {
                if (!url) return '';

                // Handle standard YouTube links: https://www.youtube.com/watch?v=VIDEO_ID
                const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
                const match = url.match(youtubeRegex);

                if (match && match[1]) {
                    return `https://www.youtube.com/embed/${match[1]}?autoplay=0`;
                }

                // If it's already an embed link or not youtube, return as is
                return url;
            };

            const embedUrl = getEmbedUrl(currentLecture.content_url);

            return (
                <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg relative group">
                    <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        allowFullScreen
                        title={currentLecture.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                </div>
            );
        } else if (currentLecture.type === 'pdf') {
            // Normalize the path: replace backslashes with forward slashes (common in Windows backends)
            let rawPath = currentLecture.content_url || '';
            rawPath = rawPath.replace(/\\/g, '/').replace(/^\/+/, '');

            // Build a robust URL for different stored formats:
            // - Full URL (http...)
            // - static/pdf_lectures/filename.pdf (already stored path)
            // - plain filename.pdf (older DB entries)
            let pdfUrl = '';
            if (rawPath.startsWith('http')) {
                pdfUrl = rawPath;
            } else if (rawPath.startsWith('static/')) {
                pdfUrl = `http://localhost:5000/${rawPath}`;
            } else if (rawPath.includes('/')) {
                // If someone stored 'src/static/pdf_lectures/filename.pdf' or similar
                const p = rawPath.replace(/^src\//, '');
                if (p.startsWith('static/')) {
                    pdfUrl = `http://localhost:5000/${p}`;
                } else {
                    // Fallback: use basename as filename
                    const filename = p.split('/').pop();
                    pdfUrl = `http://localhost:5000/static/pdf_lectures/${filename}`;
                }
            } else {
                // Plain filename like 'my_doc.pdf'
                pdfUrl = `http://localhost:5000/static/pdf_lectures/${rawPath}`;
            }

            return (
                <div className="flex flex-col items-center justify-center h-64 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <div className="bg-orange-100 p-4 rounded-full mb-4">
                        <FileText size={40} className="text-orange-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">PDF Resource Available</h3>
                    <p className="text-slate-500 mb-6 text-center max-w-md">
                        This lecture contains a downloadable PDF file. Click the button below to access the content.
                    </p>
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-primary-500/30"
                    >
                        <Download size={20} />
                        Download PDF
                    </a>
                </div>
            );
        }
        return <div>Unsupported content type</div>;
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex items-center gap-4 mb-6">
                <Button variant="secondary" onClick={() => navigate('/student')} className="!p-2">
                    <ChevronLeft size={20} />
                </Button>
                <h1 className="text-2xl font-bold">Course Content</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar - Lecture List */}
                <div className="lg:col-span-1 space-y-2 h-[calc(100vh-12rem)] overflow-y-auto pr-2">
                    {lectures.map((lecture, index) => (
                        <div
                            key={lecture.id}
                            onClick={() => handleLectureClick(lecture)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${currentLecture?.id === lecture.id
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                } ${lecture.is_locked ? 'opacity-60 grayscale' : ''}`}
                        >
                            <div className="flex-shrink-0">
                                {lecture.is_completed ? (
                                    <CheckCircle size={20} className="text-green-500" />
                                ) : lecture.is_locked ? (
                                    <Lock size={20} className="text-slate-400" />
                                ) : lecture.type === 'video' ? (
                                    <PlayCircle size={20} className="text-primary-500" />
                                ) : (
                                    <FileText size={20} className="text-orange-500" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${currentLecture?.id === lecture.id ? 'text-primary-700 dark:text-primary-300' : ''}`}>
                                    {index + 1}. {lecture.title}
                                </p>
                                <p className="text-xs text-slate-500 uppercase">{lecture.type}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    {currentLecture ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-bold">{currentLecture.title}</h2>
                                {!currentLecture.is_completed && !currentLecture.is_locked && (
                                    <Button onClick={handleMarkComplete}>Mark as Complete</Button>
                                )}
                                {currentLecture.is_completed && (
                                    <span className="flex items-center gap-2 text-green-500 font-medium">
                                        <CheckCircle size={20} /> Completed
                                    </span>
                                )}
                            </div>

                            {renderContent()}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-300 rounded-xl">
                            Select a lecture to start learning
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default LectureViewer;
