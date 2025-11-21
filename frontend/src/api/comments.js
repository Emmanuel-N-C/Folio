import axiosInstance from './axios'

export const commentsAPI = {
  addComment: async (postId, content) => {
    const response = await axiosInstance.post(`/posts/${postId}/comments`, { content })
    return response.data
  },

  getComments: async (postId) => {
    const response = await axiosInstance.get(`/posts/${postId}/comments`)
    return response.data
  },

  deleteComment: async (postId, commentId) => {
    const response = await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`)
    return response.data
  },
}