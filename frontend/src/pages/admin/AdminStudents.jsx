import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    MoreVertical,
    Mail,
    CheckCircle,
    XCircle,
    User,
    Activity,
    RefreshCw,
    AlertCircle,
    Terminal
} from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import adminService from '../../services/adminService';

const AdminStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [debugError, setDebugError] = useState(null);
    const [diagInfo, setDiagInfo] = useState(null);
    const [showDiag, setShowDiag] = useState(false);

    
    const mockStudents = [
        { id: 1, name: 'Alice Johnson', username: 'alice', email: 'alice@example.com', role: 'student', status: 'Active', enrolled_courses: ['Math 101', 'Physics 202'] },
        { id: 2, name: 'Bob Smith', username: 'bob', email: 'bob@example.com', role: 'student', status: 'Inactive', enrolled_courses: ['History 303'] },
        { id: 3, name: 'Charlie Brown', username: 'charlie', email: 'charlie@example.com', role: 'student', status: 'Active', enrolled_courses: [] },
        { id: 4, name: 'Diana Prince', username: 'diana', email: 'diana@example.com', role: 'student', status: 'Active', enrolled_courses: ['Computer Science 101'] },
        { id: 5, name: 'Evan Wright', username: 'evan', email: 'evan@example.com', role: 'student', status: 'Active', enrolled_courses: ['Art 101', 'Music 202', 'Drama 303'] },
    ];

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            console.log('Fetching students from: /admin/students');
            const response = await adminService.getAllStudents();
            console.log('Success! API response:', response);

            
            let studentList = Array.isArray(response) ? response :
                (response.students && Array.isArray(response.students)) ? response.students :
                    (response.users && Array.isArray(response.users)) ? response.users :
                        (response.data && Array.isArray(response.data)) ? response.data :
                            [];

            
            studentList = studentList.filter(s => s && typeof s === 'object');
            setStudents(studentList);
            setDebugError(null);

            if (studentList.length === 0) {
                console.log('Database is empty. Showing empty state.');
            }

            setDiagInfo({ status: 'Connected', timestamp: new Date().toLocaleTimeString() });
        } catch (error) {
            console.error('API Error details:', error);

            
            setStudents(mockStudents);
            setDebugError(`Connection Error: ${error.message}. Showing MOCK data for demo.`);
            setDiagInfo({
                status: 'Error',
                code: error.response?.status,
                msg: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [editingStudent, setEditingStudent] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '' });

    const openEdit = (student) => {
        setEditingStudent(student);
        setEditForm({ name: student.name || student.username || '', email: student.email || '' });
    };

    const closeEdit = () => {
        setEditingStudent(null);
        setEditForm({ name: '', email: '' });
    };

    const saveEdit = async () => {
        if (!editingStudent) return;
        try {
            const payload = { name: editForm.name, email: editForm.email };
            await adminService.updateStudent(editingStudent.id || editingStudent._id, payload);
            await fetchStudents();
            closeEdit();
            toast.success('Student updated');
        } catch (err) {
            console.error(err);
            toast.error('Failed to update student');
        }
    };

    const handleDeleteStudent = async (student) => {
        if (!window.confirm(`Delete ${student.name || student.username}? This cannot be undone.`)) return;
        try {
            await adminService.deleteStudent(student.id || student._id);
            await fetchStudents();
            toast.success('Student deleted');
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete student');
        }
    };

    const filteredStudents = (students || []).filter(student => {
        if (!student) return false;
        const name = student.name || student.username || '';
        const email = student.email || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                        Students Directory
                    </h1>
                    <p className="text-slate-500 mt-1">Manage system users and access levels</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search directory..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none w-full md:w-64 transition-all shadow-sm"
                        />
                    </div>
                    <button
                        onClick={fetchStudents}
                        className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-slate-600"
                        title="Reload Data"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={() => setShowDiag(!showDiag)}
                        className={`p-2.5 border rounded-xl transition-colors ${showDiag ? 'bg-primary-50 border-primary-200 text-primary-600' : 'bg-white border-slate-200 text-slate-600'}`}
                        title="Diagnostic Tools"
                    >
                        <Terminal size={20} />
                    </button>
                </div>
            </div>

            
            {showDiag && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-slate-900 text-slate-300 p-5 rounded-2xl font-mono text-xs overflow-hidden shadow-2xl border border-slate-700"
                >
                    <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                        <span className="flex items-center gap-2 text-primary-400 font-bold">
                            <Activity size={14} /> CONNECTION DIAGNOSTICS
                        </span>
                        <span className="text-[10px] opacity-50 uppercase tracking-widest">v1.0.4-stable</span>
                    </div>
                    <div className="space-y-2">
                        <p><span className="text-blue-400">Target Endpoint:</span> GET http://localhost:5000/admin/students</p>
                        <p><span className="text-blue-400">Current Status:</span> <span className={diagInfo?.status === 'Connected' ? 'text-green-400' : 'text-red-400'}>{diagInfo?.status || 'Unknown'}</span></p>
                        {diagInfo?.code && <p><span className="text-blue-400">Last HTTP Code:</span> {diagInfo.code}</p>}
                        {diagInfo?.msg && <p><span className="text-blue-400">Error Stack:</span> {diagInfo.msg}</p>}
                        <div className="mt-4 pt-4 border-t border-slate-800 text-slate-500 italic">
                            Tip: If status is '404', check if you restarted your Flask server after adding the 'admin_students_bp' blueprint.
                        </div>
                    </div>
                </motion.div>
            )}

            
            {debugError && !showDiag && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center gap-4 text-amber-900 shadow-sm"
                >
                    <div className="p-2 bg-amber-100/50 rounded-full text-amber-600">
                        <AlertCircle size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold">Demo Mode Active</p>
                        <p className="text-xs opacity-80">{debugError}</p>
                    </div>
                    <Button
                        variant="secondary"
                        className="text-xs py-1.5 h-auto bg-amber-100/50 hover:bg-amber-100 border-none"
                        onClick={fetchStudents}
                    >
                        Try Again
                    </Button>
                </motion.div>
            )}

            <Card className="overflow-hidden border-0 shadow-xl shadow-slate-100/50 dark:shadow-slate-900/50 p-0 rounded-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Student Info</th>
                                <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Account Role</th>
                                <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Activity Status</th>
                                <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Enrolled</th>
                                <th className="px-6 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan="5" className="px-6 py-6">
                                            <div className="h-14 bg-slate-50 dark:bg-slate-800/40 animate-pulse rounded-2xl"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => (
                                    <motion.tr
                                        key={student.id || index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-primary-500/20">
                                                    {(student.name || student.username || '?').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                                                        {student.name || student.username || 'Anonymous'}
                                                    </div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                                        <Mail size={12} className="opacity-70" /> {student.email || 'no-email-provided'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 inline-flex text-[11px] font-bold uppercase tracking-wider rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                                {student.role || 'Student'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {(!student.status || student.status === 'Active') ? (
                                                <span className="flex items-center text-emerald-500 text-sm font-bold">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div> Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-slate-400 text-sm font-medium">
                                                    <div className="w-2 h-2 rounded-full bg-slate-400 mr-2"></div> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                                            <span className="bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                                                {student.enrolled_courses ? student.enrolled_courses.length : (student.enrolled || 0)} Classes
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(student)}
                                                    className="text-slate-400 hover:text-blue-600 transition-all p-2 hover:bg-blue-50 rounded-xl"
                                                    title="Edit student"
                                                >
                                                    <MoreVertical size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteStudent(student)}
                                                    className="text-slate-400 hover:text-red-600 transition-all p-2 hover:bg-red-50 rounded-xl"
                                                    title="Delete student"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-slate-500">
                                        <div className="flex flex-col items-center">
                                            <div className="p-4 bg-slate-50 rounded-3xl mb-4">
                                                <User size={48} className="text-slate-300" />
                                            </div>
                                            <p className="font-bold text-xl text-slate-700">No matches found</p>
                                            <p className="text-sm mt-1">Try refining your search or adding a new student.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Edit Student Modal */}
            {editingStudent && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-bold mb-4">Edit Student</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-slate-500">Name</label>
                                <Input value={editForm.name} onChange={(e) => setEditForm(prev=>({...prev, name: e.target.value}))} />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500">Email</label>
                                <Input value={editForm.email} onChange={(e) => setEditForm(prev=>({...prev, email: e.target.value}))} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <Button variant="secondary" onClick={closeEdit}>Cancel</Button>
                            <Button onClick={saveEdit}>Save</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStudents;
