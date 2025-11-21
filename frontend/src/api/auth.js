import axiosInstance from './axios'

export const authAPI = {
  register: async (data) => {
    const response = await axiosInstance.post('/auth/register', data)
    return response.data
  },

  login: async (data) => {
    const response = await axiosInstance.post('/auth/login', data)
    return response.data
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get('/users/me')
    return response.data
  },
}