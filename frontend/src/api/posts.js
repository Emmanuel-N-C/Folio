import axiosInstance from './axios'

export const postsAPI = {
  createPost: async (data) => {
    const response = await axiosInstance.post('/posts', data)
    return response.data
  },

  getPostById: async (postId) => {
    const response = await axiosInstance.get(`/posts/${postId}`)
    return response.data
  },

  getFeed: async (page = 0, size = 10) => {
    const response = await axiosInstance.get(`/feed?page=${page}&size=${size}`)
    return response.data
  },

  getTrendingPosts: async (page = 0, size = 10) => {
    const response = await axiosInstance.get(`/posts/trending?page=${page}&size=${size}`)
    return response.data
  },

  getPostsByUser: async (userId) => {
    const response = await axiosInstance.get(`/posts/user/${userId}`)
    return response.data
  },

  searchPosts: async (keyword, page = 0, size = 10) => {
    const response = await axiosInstance.get(
      `/posts/search?keyword=${keyword}&page=${page}&size=${size}`
    )
    return response.data
  },

  getPostsByTag: async (tag, page = 0, size = 10) => {
    const response = await axiosInstance.get(
      `/posts/tag/${tag}?page=${page}&size=${size}`
    )
    return response.data
  },

  updatePost: async (postId, data) => {
    const response = await axiosInstance.put(`/posts/${postId}`, data)
    return response.data
  },

  deletePost: async (postId) => {
    const response = await axiosInstance.delete(`/posts/${postId}`)
    return response.data
  },

  // Upload screenshots to S3
  uploadPostScreenshots: async (postId, files) => {
    const formData = new FormData()
    
    // Append multiple files
    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await axiosInstance.post(
      `/posts/${postId}/screenshots`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },
}