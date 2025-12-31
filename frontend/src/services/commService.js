import api from '../api/axios';

const commService = {
    listForums: async (courseId) => {
        const r = await api.get(`/comm/forums/${courseId}`);
        return r.data;
    },
    createForum: async (courseId, data) => {
        const r = await api.post(`/comm/forums/${courseId}/create`, data);
        return r.data;
    },
    getPosts: async (forumId) => {
        const r = await api.get(`/comm/forums/${forumId}/posts`);
        return r.data;
    },
    createPost: async (forumId, data) => {
        const r = await api.post(`/comm/forums/${forumId}/posts`, data);
        return r.data;
    },
    sendMessage: async (data) => {
        const r = await api.post('/comm/messages', data);
        return r.data;
    },
    createAnnouncement: async (courseId, data) => {
        const r = await api.post(`/comm/announcements/${courseId}`, data);
        return r.data;
    },
    listAnnouncements: async (courseId) => {
        const r = await api.get(`/comm/announcements/${courseId}`);
        return r.data;
    }
    ,
    deleteForum: async (forumId) => {
        const r = await api.delete(`/comm/forums/${forumId}`);
        return r.data;
    },
    deletePost: async (postId) => {
        const r = await api.delete(`/comm/posts/${postId}`);
        return r.data;
    },
    deleteMessage: async (messageId) => {
        const r = await api.delete(`/comm/messages/${messageId}`);
        return r.data;
    },
    deleteAnnouncement: async (announcementId) => {
        const r = await api.delete(`/comm/announcements/${announcementId}`);
        return r.data;
    }
};

export default commService;
