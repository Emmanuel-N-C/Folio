import axiosInstance from './axios'

export const usersAPI = {
  getUserProfile: async (userId) => {
    const response = await axiosInstance.get(`/users/${userId}`)
    return response.data
  },

  getCurrentUserProfile: async () => {
    const response = await axiosInstance.get('/users/me')
    return response.data
  },

  updateProfile: async (data) => {
    const response = await axiosInstance.put('/users/me', data)
    return response.data
  },

  uploadProfilePicture: async (userId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await axiosInstance.post(`/users/${userId}/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  checkUsernameAvailability: async (username) => {
    const response = await axiosInstance.get(`/users/check-username/${username}`)
    return response.data
  },

  // NEW: Check email availability
  checkEmailAvailability: async (email) => {
    const response = await axiosInstance.get(`/users/check-email/${encodeURIComponent(email)}`)
    return response.data
  },

  removeProfilePicture: async () => {
    const response = await axiosInstance.delete('/users/me/profile-picture')
    return response.data
  },

  deleteAccount: async () => {
    const response = await axiosInstance.delete('/users/me')
    return response.data
  },
}