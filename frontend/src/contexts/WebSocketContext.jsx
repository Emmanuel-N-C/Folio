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
    } else {
      websocketService.disconnect()
      setConnected(false)
      setUnreadCount(0)
    }

    return () => {
      websocketService.disconnect()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!connected) return

    const unsubscribeNotification = websocketService.onNotification((notification) => {
      setNotifications(prev => [notification, ...prev])
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

  useEffect(() => {
    if (!usePolling || !isAuthenticated) return

    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [usePolling, isAuthenticated])

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationsAPI.getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      // Silent fail
    }
  }

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
    refreshUnreadCount: fetchUnreadCount
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