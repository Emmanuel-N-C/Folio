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

  updateComment: async (postId, commentId, content) => {
    const response = await axiosInstance.put(`/posts/${postId}/comments/${commentId}`, { content })
    return response.data
  },

  deleteComment: async (postId, commentId) => {
    const response = await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`)
    return response.data
  },

  // Like/Unlike
  likeComment: async (postId, commentId) => {
    const response = await axiosInstance.post(`/posts/${postId}/comments/${commentId}/like`)
    return response.data
  },

  unlikeComment: async (postId, commentId) => {
    const response = await axiosInstance.delete(`/posts/${postId}/comments/${commentId}/like`)
    return response.data
  },

  // Replies
  addReply: async (postId, commentId, content) => {
    const response = await axiosInstance.post(`/posts/${postId}/comments/${commentId}/replies`, { content })
    return response.data
  },

  getReplies: async (postId, commentId) => {
    const response = await axiosInstance.get(`/posts/${postId}/comments/${commentId}/replies`)
    return response.data
  },
}