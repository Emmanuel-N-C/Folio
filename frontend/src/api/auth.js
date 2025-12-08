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

  verifyEmail: async (data) => {
    const response = await axiosInstance.post('/auth/verify-email', data)
    return response.data
  },

  resendVerification: async (data) => {
    const response = await axiosInstance.post('/auth/resend-verification', data)
    return response.data
  },

  forgotPassword: async (data) => {
    const response = await axiosInstance.post('/auth/forgot-password', data)
    return response.data
  },

  resetPassword: async (data) => {
    const response = await axiosInstance.post('/auth/reset-password', data)
    return response.data
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get('/users/me')
    return response.data
  },
}