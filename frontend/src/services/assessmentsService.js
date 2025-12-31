import api from '../api/axios';

const assessmentsService = {
    createQuiz: async (data) => {
        const resp = await api.post('/assess/quiz', data);
        return resp.data;
    },
    addQuestion: async (quizId, data) => {
        const resp = await api.post(`/assess/quiz/${quizId}/question`, data);
        return resp.data;
    },
    getQuiz: async (quizId) => {
        const resp = await api.get(`/assess/quiz/${quizId}`);
        return resp.data;
    },
    submitQuiz: async (quizId, data) => {
        const resp = await api.post(`/assess/quiz/${quizId}/submit`, data);
        return resp.data;
    }
    ,
    listSubmissions: async (quizId) => {
        const resp = await api.get(`/assess/quiz/${quizId}/submissions`);
        return resp.data;
    },
    getSubmission: async (submissionId) => {
        const resp = await api.get(`/assess/submission/${submissionId}`);
        return resp.data;
    },
    gradeSubmission: async (submissionId, answers) => {
        const resp = await api.put(`/assess/submission/${submissionId}/grade`, { answers });
        return resp.data;
    }
    ,
    deleteQuiz: async (quizId) => {
        const resp = await api.delete(`/assess/quiz/${quizId}`);
        return resp.data;
    },
    deleteQuestion: async (questionId) => {
        const resp = await api.delete(`/assess/question/${questionId}`);
        return resp.data;
    },
    deleteOption: async (optionId) => {
        const resp = await api.delete(`/assess/option/${optionId}`);
        return resp.data;
    },
    deleteSubmission: async (submissionId) => {
        const resp = await api.delete(`/assess/submission/${submissionId}`);
        return resp.data;
    },
    deleteAnswer: async (answerId) => {
        const resp = await api.delete(`/assess/answer/${answerId}`);
        return resp.data;
    }
};

export default assessmentsService;
