import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    MoreVertical,
    Mail,
    Shield,
    CheckCircle,
    XCircle,
    User
} from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import adminService from '../../services/adminService';

const AdminStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await adminService.getAllStudents();
            // Ensure we extract an array, handling various potential API response structures
            const studentList = Array.isArray(response) ? response :
                (response.users && Array.isArray(response.users)) ? response.users :
                    (response.data && Array.isArray(response.data)) ? response.data :
                        [];
            setStudents(studentList);
        } catch (error) {
            console.error('Failed to fetch students:', error);
            setStudents([]); // Fallback to empty array on error
        } finally {
            setLoading(false);
        }
    };

    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = (students || []).filter(student =>
        (student.name || student.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                        Students Directory
                    </h1>
                    <p className="text-slate-500 mt-1">Manage student accounts and enrollments</p>
                </div>

                {/* Debug View - Remove after fixing */}
                {(debugError || (students.length === 0 && rawData)) && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-xs font-mono mb-4 w-full">
                        <p className="font-bold text-red-600">Debug Info:</p>
                        {debugError && <p>Error: {debugError}</p>}
                        <p>Raw Data Type: {typeof rawData}</p>
                        <p>Is Array? {Array.isArray(rawData) ? 'Yes' : 'No'}</p>
                        <details>
                            <summary>View Raw Data JSON</summary>
                            <pre className="mt-2 whitespace-pre-wrap">
                                {JSON.stringify(rawData, null, 2)}
                            </pre>
                        </details>
                    </div>
                )}

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none w-full md:w-64 transition-all"
                    />
                </div>
            </div>

            <Card className="overflow-hidden border-0 shadow-lg shadow-slate-100/50 dark:shadow-slate-900/50">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled Courses</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => (
                                    <motion.tr
                                        key={student.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary-500/20">
                                                    {(student.name || student.username || '?').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {student.name || student.username || 'Unknown User'}
                                                    </div>
                                                    <div className="text-sm text-slate-500 flex items-center gap-1">
                                                        <Mail size={12} /> {student.email || 'No Email'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {student.role || 'Student'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {(!student.status || student.status === 'Active') ? (
                                                <span className="flex items-center text-green-500 text-sm font-medium">
                                                    <CheckCircle size={14} className="mr-1.5" /> Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-slate-400 text-sm font-medium">
                                                    <XCircle size={14} className="mr-1.5" /> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {student.enrolled_courses ? student.enrolled_courses.length : (student.enrolled || 0)} courses
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-slate-400 hover:text-primary-600 transition-colors">
                                                <MoreVertical size={20} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colspan="5" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center">
                                            <User size={48} className="text-slate-300 mb-4" />
                                            <p className="font-medium">No students found.</p>
                                            <p className="text-sm">Register new users via the sidebar.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AdminStudents;
