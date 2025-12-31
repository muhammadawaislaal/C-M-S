import api from '../api/axios';

const adminService = {
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

    getAllStudents: async () => {
        const response = await api.get('/admin/students');
        return response.data;
    },

    updateStudent: async (studentId, data) => {
        const response = await api.put(`/admin/students/${studentId}`, data);
        return response.data;
    },

    deleteStudent: async (studentId) => {
        const response = await api.delete(`/admin/students/${studentId}`);
        return response.data;
    },

    getStudentById: async (studentId) => {
        const response = await api.get(`/admin/students/${studentId}`);
        return response.data;
    },

    searchStudents: async (query) => {
        const response = await api.get(`/admin/students/search?q=${query}`);
        return response.data;
    },

    addLectureVideo: async (data) => {
        const response = await api.post('/lecture/add', data);
        return response.data;
    },

    addLecturePdf: async (formData) => {
        const response = await api.post('/lecture/add', formData);
        return response.data;
    }
};

export default adminService;
