import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminService from '../../services/adminService';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import { ChevronLeft, Upload } from 'lucide-react';

const AddLecture = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('video'); // 'video' or 'pdf'

    const [formData, setFormData] = useState({
        title: '',
        content_url: '',
        order_number: '',
        type: 'video'
    });
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (type === 'video') {
                if (!formData.content_url) {
                    toast.error('Please enter a video URL');
                    setLoading(false);
                    return;
                }
                await adminService.addLectureVideo({
                    ...formData,
                    course_id: courseId,
                    type: 'video'
                });
            } else {
                if (!file) {
                    toast.error('Please select a PDF file to upload');
                    setLoading(false);
                    return;
                }

                // Visual feedback for large files
                if (file.size > 10 * 1024 * 1024) {
                    toast.info('Uploading large file, please wait...');
                }

                const data = new FormData();
                data.append('course_id', courseId);
                data.append('title', formData.title);
                data.append('type', 'pdf');
                data.append('order_number', formData.order_number);
                data.append('file', file); // Trying standard 'file' key. `content` and `pdf` were previous attempts.

                await adminService.addLecturePdf(data);
            }

            toast.success('Lecture content added successfully! 🎉');
            navigate('/admin');
        } catch (error) {
            console.error(error);
            // Check all common backend error keys
            const errorMsg = error.response?.data?.message ||
                error.response?.data?.msg ||
                error.response?.data?.error ||
                'Failed to add lecture. Please check input.';

            toast.error(`${errorMsg} (Status: ${error.response?.status || 'Unknown'})`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Button variant="secondary" onClick={() => navigate('/admin')} className="mb-6 w-fit">
                <ChevronLeft size={20} /> Back
            </Button>

            <div className="flex justify-center">
                <Card className="w-full max-w-2xl">
                    <h1 className="text-2xl font-bold mb-6">Add Lecture to Course</h1>

                    <div className="flex bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg mb-6">
                        <button
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'video'
                                ? 'bg-white dark:bg-dark-surface text-primary-600 shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                                }`}
                            onClick={() => setType('video')}
                        >
                            Video URL
                        </button>
                        <button
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'pdf'
                                ? 'bg-white dark:bg-dark-surface text-primary-600 shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                                }`}
                            onClick={() => setType('pdf')}
                        >
                            PDF Upload
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Lecture Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="Introduction to..."
                        />

                        <Input
                            label="Order Number"
                            type="number"
                            value={formData.order_number}
                            onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                            required
                            placeholder="1"
                        />

                        {type === 'video' ? (
                            <Input
                                label="Video URL (YouTube/Vimeo/MP4)"
                                value={formData.content_url}
                                onChange={(e) => setFormData({ ...formData, content_url: e.target.value })}
                                required
                                placeholder="https://www.youtube.com/embed/..."
                            />
                        ) : (
                            <div className="flex flex-col gap-1 w-full">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">PDF File</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50 dark:bg-slate-800/50">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="hidden"
                                        id="pdf-upload"
                                    />
                                    <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                                        <Upload size={32} className="text-slate-400 mb-2" />
                                        <span className="text-sm text-slate-600 dark:text-slate-300">
                                            {file ? file.name : "Click to upload PDF"}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" isLoading={loading}>
                                Add Lecture
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default AddLecture;
