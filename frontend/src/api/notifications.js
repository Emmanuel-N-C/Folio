import axiosInstance from './axios'

export const notificationsAPI = {
  // Get user notifications with pagination
  getNotifications: async (page = 0, size = 20) => {
    const response = await axiosInstance.get('/api/notifications', {
      params: { page, size }
    })
    return response.data
  },

  // Get unread notification count
  getUnreadCount: async () => {
    const response = await axiosInstance.get('/api/notifications/unread-count')
    return response.data.count
  },

  // Mark a single notification as read
  markAsRead: async (notificationId) => {
    const response = await axiosInstance.put(`/api/notifications/${notificationId}/read`)
    return response.data
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await axiosInstance.put('/api/notifications/read-all')
    return response.data
  }
}