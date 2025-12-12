import axiosInstance from './axios'

export const authAPI = {
  register: async (data) => {
    const response = await axiosInstance.post('/auth/register', {
      ...data,
      acceptedTerms: true  // Always true when form is submitted
    })
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

  // OAuth endpoints
  checkOAuthUser: async (data) => {
    const response = await axiosInstance.post('/auth/oauth/check', data)
    return response.data
  },

  loginOAuthUser: async (data) => {
    const response = await axiosInstance.post('/auth/oauth/login', data)
    return response.data
  },

  registerOAuthUser: async (data) => {
    const response = await axiosInstance.post('/auth/oauth/register', {
      ...data,
      acceptedTerms: true  // Always true when form is submitted
    })
    return response.data
  },

  checkUsernameAvailability: async (username) => {
    const response = await axiosInstance.get(`/users/check-username?username=${username}`)
    return response.data
  },

  // GitHub: Exchange authorization code for access token
  exchangeGitHubCode: async (data) => {
    const response = await axiosInstance.post('/auth/oauth/github/exchange-code', data)
    return response.data
  },
}