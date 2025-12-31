import api from '../api/axios';

const studentService = {
    getActiveCourses: async () => {
        const response = await api.get('/api/student/view_active/courses');
        return response.data;
    },

    enrollCourse: async (courseId) => {
        const response = await api.post(`/enroll/${courseId}`);
        return response.data;
    },

    getCourseLectures: async (courseId) => {
        const response = await api.get(`/get_course/lectures/${courseId}`);
        return response.data;
    },

    completeLecture: async (lectureId) => {
        const response = await api.post(`/lecture/complete/${lectureId}`);
        return response.data;
    }
};

export default studentService;
