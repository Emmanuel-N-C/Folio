import axiosInstance from './axios'

export const adminAPI = {
  getAllUsers: async (page = 0, size = 20) => {
    const response = await axiosInstance.get(`/admin/users?page=${page}&size=${size}`)
    return response.data
  },

  deleteUser: async (userId) => {
    const response = await axiosInstance.delete(`/admin/users/${userId}`)
    return response.data
  },

  deleteAnyPost: async (postId) => {
    const response = await axiosInstance.delete(`/admin/posts/${postId}`)
    return response.data
  },

  deleteAnyComment: async (commentId) => {
    const response = await axiosInstance.delete(`/admin/comments/${commentId}`)
    return response.data
  },

  getDashboardStats: async () => {
    const response = await axiosInstance.get('/admin/dashboard/stats')
    return response.data
  },
}