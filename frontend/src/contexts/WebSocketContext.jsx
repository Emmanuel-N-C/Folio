import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { websocketService } from '@/services/websocket'
import { useAuth } from '@/hooks/useAuth'
import { notificationsAPI } from '@/api/notifications'

const WebSocketContext = createContext(null)

export const WebSocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [connected, setConnected] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [usePolling, setUsePolling] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token')
      
      websocketService.connect(token)
        .then(() => {
          setConnected(true)
          setUsePolling(false)
        })
        .catch(() => {
          setConnected(false)
          setUsePolling(true)
        })

      fetchUnreadCount()
      fetchRecentNotifications()
    } else {
      websocketService.disconnect()
      setConnected(false)
      setUnreadCount(0)
      setNotifications([])
    }

    return () => {
      websocketService.disconnect()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!connected) return

    const unsubscribeNotification = websocketService.onNotification((notification) => {
      setNotifications(prev => [notification, ...prev])
      // Increment unread count when new notification arrives
      setUnreadCount(prev => prev + 1)
      showBrowserNotification(notification)
    })

    const unsubscribeUnreadCount = websocketService.onUnreadCount((count) => {
      setUnreadCount(count)
    })

    return () => {
      unsubscribeNotification()
      unsubscribeUnreadCount()
    }
  }, [connected])

  // Polling fallback
  useEffect(() => {
    if (!usePolling || !isAuthenticated) return

    const interval = setInterval(() => {
      fetchUnreadCount()
      fetchRecentNotifications()
    }, 30000) // Poll every 30 seconds
    
    return () => clearInterval(interval)
  }, [usePolling, isAuthenticated])

  // Sync on tab focus (for multi-tab support)
  useEffect(() => {
    if (!isAuthenticated) return

    const handleFocus = () => {
      fetchUnreadCount()
      fetchRecentNotifications()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isAuthenticated])

  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await notificationsAPI.getUnreadCount()
      setUnreadCount(count || 0)
    } catch (error) {
      // If API fails, keep existing count (don't reset to 0)
      console.error('Failed to fetch unread count:', error)
    }
  }, [])

  const fetchRecentNotifications = useCallback(async () => {
    try {
      const data = await notificationsAPI.getNotifications(0, 20)
      setNotifications(data.content)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }, [])

  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }, [])

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const decrementUnreadCount = useCallback(() => {
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  const resetUnreadCount = useCallback(() => {
    setUnreadCount(0)
  }, [])

  const showBrowserNotification = (notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = getNotificationTitle(notification)
      const body = getNotificationBody(notification)
      
      new Notification(title, {
        body,
        icon: notification.actor?.profileImageUrl || '/logo.png',
        tag: `notification-${notification.id}`
      })
    }
  }

  const getNotificationTitle = (notification) => {
    switch (notification.type) {
      case 'POST_LIKE':
        return 'New Like'
      case 'POST_COMMENT':
        return 'New Comment'
      case 'COMMENT_REPLY':
        return 'New Reply'
      case 'COMMENT_LIKE':
        return 'New Like on Comment'
      default:
        return 'New Notification'
    }
  }

  const getNotificationBody = (notification) => {
    const actor = notification.actor?.username || 'Someone'
    switch (notification.type) {
      case 'POST_LIKE':
        return `${actor} liked your post`
      case 'POST_COMMENT':
        return `${actor} commented on your post`
      case 'COMMENT_REPLY':
        return `${actor} replied to your comment`
      case 'COMMENT_LIKE':
        return `${actor} liked your comment`
      default:
        return 'You have a new notification'
    }
  }

  const requestNotificationPermission = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const value = {
    connected,
    unreadCount,
    notifications,
    usePolling,
    requestNotificationPermission,
    refreshUnreadCount: fetchUnreadCount,
    refreshNotifications: fetchRecentNotifications,
    decrementUnreadCount,
    resetUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
  }

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider')
  }
  return context
}