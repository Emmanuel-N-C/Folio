import axiosInstance from './axios'

export const likesAPI = {
  likePost: async (postId) => {
    const response = await axiosInstance.post(`/posts/${postId}/likes`)
    return response.data
  },

  unlikePost: async (postId) => {
    const response = await axiosInstance.delete(`/posts/${postId}/likes`)
    return response.data
  },

  getLikesCount: async (postId) => {
    const response = await axiosInstance.get(`/posts/${postId}/likes/count`)
    return response.data
  },
}