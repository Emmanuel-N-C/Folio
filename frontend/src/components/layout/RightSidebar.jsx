import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Heart, MessageCircle, Reply, Bell } from 'lucide-react'
import { notificationsAPI } from '@/api/notifications'
import { formatDistanceToNow } from 'date-fns'

const RightSidebar = () => {
  const { isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 15000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const fetchNotifications = async () => {
    try {
      const [notifData, count] = await Promise.all([
        notificationsAPI.getNotifications(0, 5),
        notificationsAPI.getUnreadCount()
      ])
      setNotifications(notifData.content)
      setUnreadCount(count)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'POST_LIKE':
        return <Heart className="h-4 w-4 text-red-500" strokeWidth={2} />
      case 'POST_COMMENT':
        return <MessageCircle className="h-4 w-4 text-blue-500" strokeWidth={2} />
      case 'COMMENT_REPLY':
        return <Reply className="h-4 w-4 text-green-500" strokeWidth={2} />
      case 'COMMENT_LIKE':
        return <Heart className="h-4 w-4 text-pink-500" strokeWidth={2} />
      default:
        return <Bell className="h-4 w-4 text-gray-500" strokeWidth={2} />
    }
  }

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'POST_LIKE':
        return `liked your post "${notification.postTitle}"`
      case 'POST_COMMENT':
        return `commented on "${notification.postTitle}"`
      case 'COMMENT_REPLY':
        return 'replied to your comment'
      case 'COMMENT_LIKE':
        return 'liked your comment'
      default:
        return 'interacted with your content'
    }
  }

  return (
    <aside className="hidden xl:flex flex-col w-80 h-screen sticky top-0 border-l bg-card">
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {/* Notifications Section */}
          {isAuthenticated && (
            <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-muted">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Bell className="h-5 w-5" strokeWidth={2} />
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-3 space-y-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" strokeWidth={1.5} />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <>
                    {notifications.map((notification) => (
                      <Link
                        key={notification.id}
                        to={`/posts/${notification.postId}`}
                        className={`flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition-all cursor-pointer group ${
                          !notification.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                        }`}
                      >
                        <Avatar className="w-10 h-10 ring-2 ring-border">
                          <AvatarImage src={notification.actor.profileImageUrl} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xs font-semibold">
                            {notification.actor.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm text-foreground">
                                <span className="font-semibold">{notification.actor.username}</span>
                                {' '}
                                <span className="text-muted-foreground">
                                  {getNotificationText(notification)}
                                </span>
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </p>
                                {!notification.read && (
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
                                )}
                              </div>
                            </div>
                            <div>
                              {getNotificationIcon(notification.type)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Link to="/notifications" className="block pt-2">
                      <Button 
                        variant="ghost" 
                        className="w-full text-sm font-medium rounded-xl"
                      >
                        View All Notifications
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}

export default RightSidebar