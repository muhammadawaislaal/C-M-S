import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import { ChevronLeft } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:5000';

const AddEditCourse = () => {
    const { state } = useLocation();
    const { courseId } = useParams();
    const navigate = useNavigate();
    const isEdit = !!courseId;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'inactive'
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    
    useEffect(() => {
        if (isEdit && !state?.course) {
            fetchCourse();
        } else if (state?.course) {
            setFormData({
                title: state.course.title || '',
                description: state.course.description || '',
                status: state.course.status || 'inactive'
            });
            setFetching(false);
        }
    }, [isEdit, state?.course]);

    const fetchCourse = async () => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('access_token');
            
            if (!token) {
                toast.error('Authentication required. Please login again.');
                navigate('/login');
                return;
            }

            
            const response = await fetch(`${API_BASE_URL}/admin/courses`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    toast.error('Session expired. Please login again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('access_token');
                    navigate('/login');
                    return;
                }
                
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.msg || `Failed to fetch course: ${response.status}`);
            }

            const data = await response.json();
            
            const course = data.courses?.find(c => {
                const idFields = ['id', '_id', 'course_id', 'courseId'];
                for (const field of idFields) {
                    if (c[field]?.toString() === courseId) {
                        return true;
                    }
                }
                return false;
            });

            if (course) {
                setFormData({
                    title: course.title || '',
                    description: course.description || '',
                    status: course.status || 'inactive'
                });
            } else {
                toast.error('Course not found');
                navigate('/admin');
            }
        } catch (error) {
            console.error('Fetch course error:', error);
            toast.error(error.message || 'Failed to load course data');
        } finally {
            setFetching(false);
        }
    };

    const addCourse = async (courseData) => {
        const token = localStorage.getItem('token') || localStorage.getItem('access_token');
        
        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await fetch(`${API_BASE_URL}/admin/add_course`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(courseData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const error = new Error(errorData.msg || `Failed to add course: ${response.status}`);
            error.response = { data: errorData };
            throw error;
        }

        return await response.json();
    };

    const updateCourse = async (courseId, courseData) => {
        const token = localStorage.getItem('token') || localStorage.getItem('access_token');
        
        if (!token) {
            throw new Error('Authentication required');
        }

        const payload = {
            title: courseData.title.trim(),
            description: courseData.description.trim(),
            status: courseData.status
        };

        console.log('Update payload:', payload);

        const response = await fetch(`${API_BASE_URL}/admin/update_course/${courseId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Update error response:', errorData); // Debug log
            const error = new Error(errorData.msg || errorData.message || `Failed to update course: ${response.status}`);
            error.response = { data: errorData };
            throw error;
        }

        return await response.json();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
            if (!formData.title.trim()) {
            toast.error('Course title is required');
            return;
        }

        if (formData.title.trim().length < 3) {
            toast.error('Course title must be at least 3 characters long');
            return;
        }

        if (formData.title.trim().length > 200) {
            toast.error('Course title must not exceed 200 characters');
            return;
        }

        if (formData.description.trim().length > 1000) {
            toast.error('Description must not exceed 1000 characters');
            return;
        }

        setLoading(true);

        try {
            if (isEdit) {
                await updateCourse(courseId, formData);
                toast.success('Course updated successfully');
            } else {
                await addCourse(formData);
                toast.success('Course created successfully');
            }
            navigate('/admin');
        } catch (error) {
            console.error('Submit error:', error);
            
            const errors = error.response?.data?.errors;
            if (errors) {
                if (typeof errors === 'object') {
                    Object.entries(errors).forEach(([field, errArray]) => {
                        if (Array.isArray(errArray)) {
                            errArray.forEach(msg => toast.error(`${field}: ${msg}`));
                        } else if (typeof errArray === 'string') {
                            toast.error(`${field}: ${errArray}`);
                        }
                    });
                } else {
                    toast.error(String(errors));
                }
            } else if (error.response?.data?.msg || error.response?.data?.message) {
                toast.error(error.response.data.msg || error.response.data.message);
            } else {
                toast.error(error.message || 'Operation failed');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (fetching) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                    <p className="mt-4 text-slate-500">Loading course data...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Button 
                variant="secondary" 
                onClick={() => navigate('/admin')} 
                className="mb-6 w-fit flex items-center gap-2"
                disabled={loading}
            >
                <ChevronLeft size={20} /> 
                Back to Dashboard
            </Button>

            <div className="flex justify-center">
                <Card className="w-full max-w-2xl">
                    <h1 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">
                        {isEdit ? 'Edit Course' : 'Create New Course'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        {isEdit ? 'Update your course details' : 'Fill in the details to create a new course'}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Course Title *
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-dark-surface dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all border-slate-300"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="e.g., Advanced React Patterns"
                                required
                                disabled={loading}
                                maxLength={200}
                            />
                            <p className="text-xs text-slate-400 mt-1">
                                {formData.title.length}/200 characters
                            </p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Description
                            </label>
                            <textarea
                                className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-dark-surface dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all border-slate-300 min-h-[120px] resize-y"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Describe what students will learn in this course..."
                                disabled={loading}
                                maxLength={1000}
                            />
                            <p className="text-xs text-slate-400 mt-1">
                                {formData.description.length}/1000 characters
                            </p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Status
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-dark-surface dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none border-slate-300"
                                    value={formData.status}
                                    onChange={(e) => handleChange('status', e.target.value)}
                                    disabled={loading}
                                >
                                    <option value="inactive">Inactive</option>
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                                • Active: Course is visible to students<br />
                                • Inactive: Course is hidden from students<br />
                                • Draft: Course is still being prepared
                            </p>
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-center">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => navigate('/admin')}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    isLoading={loading}
                                    className="min-w-[140px]"
                                >
                                    {isEdit ? (
                                        <>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Save Changes
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Create Course
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default AddEditCourse;