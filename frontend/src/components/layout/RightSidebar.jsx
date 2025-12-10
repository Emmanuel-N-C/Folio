import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
      // Poll every 15 seconds for live updates
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
        return <Heart className="h-4 w-4" strokeWidth={1.5} />
      case 'POST_COMMENT':
        return <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
      case 'COMMENT_REPLY':
        return <Reply className="h-4 w-4" strokeWidth={1.5} />
      case 'COMMENT_LIKE':
        return <Heart className="h-4 w-4" strokeWidth={1.5} />
      default:
        return <Bell className="h-4 w-4" strokeWidth={1.5} />
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
    <aside className="hidden xl:flex flex-col w-80 h-screen sticky top-0 border-l-2 border-black bg-white">
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {/* Notifications Section */}
          {isAuthenticated && (
            <div className="border-2 border-black">
              <div className="p-4 border-b-2 border-black">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-serif flex items-center gap-2">
                    <Bell className="h-5 w-5" strokeWidth={1.5} />
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="bg-black text-white border-2 border-black font-mono">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-4 space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" strokeWidth={1.5} />
                    <p className="text-sm font-mono">No notifications yet</p>
                  </div>
                ) : (
                  <>
                    {notifications.map((notification) => (
                      <Link
                        key={notification.id}
                        to={`/posts/${notification.postId}`}
                        className={`flex items-start gap-3 p-3 border-2 border-black hover:bg-black hover:text-white transition-colors duration-100 cursor-pointer group ${
                          !notification.read ? 'bg-gray-100' : ''
                        }`}
                      >
                        <Avatar className="w-10 h-10 border-2 border-black">
                          <AvatarImage src={notification.actor.profileImageUrl} />
                          <AvatarFallback className="bg-black text-white text-xs font-serif">
                            {notification.actor.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <p className="text-sm">
                                <span className="font-semibold">{notification.actor.username}</span>
                                {' '}
                                <span className="group-hover:text-white">
                                  {getNotificationText(notification)}
                                </span>
                              </p>
                              <p className="text-xs text-muted-foreground group-hover:text-white/70 mt-1 flex items-center gap-2 font-mono">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                {!notification.read && (
                                  <span className="inline-block w-1.5 h-1.5 bg-black group-hover:bg-white" />
                                )}
                              </p>
                            </div>
                            <div className="mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Link to="/notifications">
                      <Button variant="ghost" className="w-full border-2 border-black hover:bg-black hover:text-white text-sm uppercase tracking-widest font-mono transition-colors duration-100">
                        View all
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