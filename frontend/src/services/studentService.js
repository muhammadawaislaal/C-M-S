import api from '../api/axios';

const studentService = {
    // Get all active courses available for enrollment
    getActiveCourses: async () => {
        const response = await api.get('/api/student/view_active/courses');
        return response.data;
    },

    // Enroll in a course
    enrollCourse: async (courseId) => {
        const response = await api.post(`/enroll/${courseId}`);
        return response.data;
    },

    // Get lectures for a specific course (My Courses -> Lectures)
    // Note: The API docs say GET /get_course/lectures/<course_id>
    // This likely returns lectures for a course the student is enrolled in.
    getCourseLectures: async (courseId) => {
        const response = await api.get(`/get_course/lectures/${courseId}`);
        return response.data;
    },

    // Mark lecture as complete
    completeLecture: async (lectureId) => {
        const response = await api.post(`/lecture/complete/${lectureId}`);
        return response.data;
    }
};

export default studentService;
