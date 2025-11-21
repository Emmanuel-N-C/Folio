import axiosInstance from './axios'

export const usersAPI = {
  getUserProfile: async (userId) => {
    const response = await axiosInstance.get(`/users/${userId}`)
    return response.data
  },

  updateProfile: async (data) => {
    const response = await axiosInstance.put('/users/me', data)
    return response.data
  },
}