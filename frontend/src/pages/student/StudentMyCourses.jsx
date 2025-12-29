import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, Clock } from 'lucide-react';
import studentService from '../../services/studentService';
import Card from '../../components/Card';
import Button from '../../components/Button';

const StudentMyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEnrolledCourses();
    }, []);

    const fetchEnrolledCourses = async () => {
        try {
            const data = await studentService.getActiveCourses();

            // Filter only enrolled courses
            // Since API doesn't differ, we will assume for this demo that checking access works
            // In a real app, we'd use a dedicated endpoint /my-courses or similar
            const enrolled = await Promise.all(data.map(async (c) => {
                try {
                    const id = c.id || c._id || c.course_id;
                    await studentService.getCourseLectures(id);
                    return { ...c, is_enrolled: true };
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
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">My Learning</h1>
                <p className="text-slate-500 mt-1">Pick up where you left off</p>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, index) => (
                        <motion.div
                            key={course.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300">
                                <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 flex items-center justify-center">
                                    <PlayCircle size={40} className="text-primary-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 line-clamp-1">{course.title}</h3>
                                <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-2">{course.description}</p>

                                <div className="mt-auto">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                                        <Clock size={12} />
                                        <span>Last accessed 2 days ago</span>
                                    </div>
                                    <Link to={`/student/course/${course.id || course._id || course.course_id}`}>
                                        <Button className="w-full">Continue Learning</Button>
                                    </Link>
                                </div>
                            </Card>
                        </motion.div>
                    ))}

                    {courses.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-slate-500 mb-4">You haven't enrolled in any courses yet.</p>
                            <Link to="/student/courses">
                                <Button variant="secondary">Browse Courses</Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentMyCourses;
