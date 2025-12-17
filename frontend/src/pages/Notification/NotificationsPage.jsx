import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { notificationsAPI } from '@/api/notifications'
import { useAuth } from '@/hooks/useAuth'
import { useWebSocket } from '@/contexts/WebSocketContext'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Reply, Bell, ArrowLeft } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const NotificationsPage = () => {
  const { isAuthenticated } = useAuth()
  const { 
    notifications: contextNotifications,
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    decrementUnreadCount, 
    resetUnreadCount,
    refreshNotifications
  } = useWebSocket()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [allNotifications, setAllNotifications] = useState([])

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications()
    }
  }, [isAuthenticated])

  // Sync with context notifications
  useEffect(() => {
    if (page === 0 && contextNotifications.length > 0) {
      setAllNotifications(contextNotifications)
    }
  }, [contextNotifications, page])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const data = await notificationsAPI.getNotifications(page, 20)
      
      if (page === 0) {
        setAllNotifications(data.content)
      } else {
        setAllNotifications(prev => [...prev, ...data.content])
      }
      
      setHasMore(!data.last)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      const notification = allNotifications.find(n => n.id === notificationId)
      const wasUnread = notification && !notification.read

      await notificationsAPI.markAsRead(notificationId)
      
      // Update local state
      setAllNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
      
      // Update context (syncs with sidebar)
      markNotificationAsRead(notificationId)

      if (wasUnread) {
        decrementUnreadCount()
      }
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead()
      
      // Update local state
      setAllNotifications(prev => prev.map(n => ({ ...n, read: true })))
      
      // Update context (syncs with sidebar)
      markAllNotificationsAsRead()
      resetUnreadCount()
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'POST_LIKE':
        return <Heart className="h-5 w-5 text-red-500 fill-red-500" />
      case 'POST_COMMENT':
        return <MessageCircle className="h-5 w-5 text-blue-500" />
      case 'COMMENT_REPLY':
        return <Reply className="h-5 w-5 text-green-500" />
      case 'COMMENT_LIKE':
        return <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'POST_LIKE':
        return (
          <>
            <span className="font-semibold">{notification.actor.username}</span>
            {' liked your post '}
            <span className="font-medium">"{notification.postTitle}"</span>
          </>
        )
      case 'POST_COMMENT':
        return (
          <>
            <span className="font-semibold">{notification.actor.username}</span>
            {' commented on your post '}
            <span className="font-medium">"{notification.postTitle}"</span>
          </>
        )
      case 'COMMENT_REPLY':
        return (
          <>
            <span className="font-semibold">{notification.actor.username}</span>
            {' replied to your comment'}
          </>
        )
      case 'COMMENT_LIKE':
        return (
          <>
            <span className="font-semibold">{notification.actor.username}</span>
            {' liked your comment'}
          </>
        )
      default:
        return 'New notification'
    }
  }

  const getNotificationLink = (notification) => {
    if (notification.postId) {
      return `/posts/${notification.postId}`
    }
    return '#'
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Login Required</h2>
        <p className="text-muted-foreground mb-6">
          Please login to view your notifications
        </p>
        <Link to="/login">
          <Button>Go to Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your latest activity
          </p>
        </div>
        {allNotifications.some(n => !n.read) && (
          <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {loading && page === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : allNotifications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No notifications yet</h3>
            <p className="text-muted-foreground">
              When someone interacts with your posts, you'll see it here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {allNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md ${
                !notification.read ? 'bg-primary/5 border-primary/20' : ''
              }`}
            >
              <CardContent className="p-4">
                <Link
                  to={getNotificationLink(notification)}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  className="flex gap-4 items-start group"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="w-12 h-12 ring-2 ring-background group-hover:ring-primary/20 transition-all">
                      <AvatarImage
                        src={notification.actor.profileImageUrl}
                        alt={notification.actor.username}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
                        {notification.actor.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 shadow-sm">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed">
                      {getNotificationText(notification)}
                    </p>
                    {notification.commentContent && (
                      <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted/50 rounded-lg line-clamp-2">
                        "{notification.commentContent}"
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      {!notification.read && (
                        <span className="inline-block w-2 h-2 rounded-full bg-primary" />
                      )}
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}

          {/* Load More */}
          {hasMore && (
            <div className="text-center pt-4">
              <Button
                onClick={() => {
                  setPage(p => p + 1)
                  loadNotifications()
                }}
                variant="outline"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationsPage