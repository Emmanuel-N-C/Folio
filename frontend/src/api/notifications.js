import axiosInstance from './axios'

export const notificationsAPI = {
  // Get user notifications with pagination
  getNotifications: async (page = 0, size = 20) => {
    const response = await axiosInstance.get('/notifications', {
      params: { page, size }
    })
    return response.data
  },

  // Get unread notification count
  getUnreadCount: async () => {
    const response = await axiosInstance.get('/notifications/unread-count')
    // Handle both direct number and object with count property
    return typeof response.data === 'number' ? response.data : response.data.count
  },

  // Mark a single notification as read
  markAsRead: async (notificationId) => {
    const response = await axiosInstance.put(`/notifications/${notificationId}/read`)
    return response.data
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await axiosInstance.put('/notifications/read-all')
    return response.data
  }
}