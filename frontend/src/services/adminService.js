import api from '../api/axios';

const adminService = {
    // Course Management
    getAllCourses: async () => {
        const response = await api.get('/admin/courses');
        return response.data;
    },

    addCourse: async (data) => {
        const response = await api.post('/admin/add_course', data);
        return response.data;
    },

    updateCourse: async (courseId, data) => {
        const response = await api.put(`/admin/update_course/${courseId}`, data);
        return response.data;
    },

    deleteCourse: async (courseId) => {
        const response = await api.delete(`/admin/delete_course/${courseId}`);
        return response.data;
    },

    // Student Management
    getAllStudents: async () => {
        // Assuming the backend route matches the pattern of getAllCourses (/admin/courses)
        // Adjust endpoint if backend is different (e.g. /admin/get_students)
        const response = await api.get('/admin/students');
        return response.data;
    },

    // Lecture Management
    addLectureVideo: async (data) => {
        const response = await api.post('/lecture/add', data);
        return response.data;
    },

    addLecturePdf: async (formData) => {
        // For FormData, axios automatically sets Content-Type to multipart/form-data with the correct boundary
        const response = await api.post('/lecture/add', formData);
        return response.data;
    }
};

export default adminService;
