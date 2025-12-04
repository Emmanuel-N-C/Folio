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
        return <Heart className="h-4 w-4 text-red-500" />
      case 'POST_COMMENT':
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case 'COMMENT_REPLY':
        return <Reply className="h-4 w-4 text-green-500" />
      case 'COMMENT_LIKE':
        return <Heart className="h-4 w-4 text-pink-500" />
      default:
        return <Bell className="h-4 w-4" />
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
    <aside className="hidden xl:flex flex-col w-80 h-screen sticky top-0 border-l bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {/* Notifications Section */}
          {isAuthenticated && (
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Notifications
                  </CardTitle>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="rounded-full">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <>
                    {notifications.map((notification) => (
                      <Link
                        key={notification.id}
                        to={`/posts/${notification.postId}`}
                        className={`flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-primary/5' : ''
                        }`}
                      >
                        <Avatar className="w-10 h-10 ring-2 ring-background">
                          <AvatarImage src={notification.actor.profileImageUrl} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white text-xs">
                            {notification.actor.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <p className="text-sm">
                                <span className="font-semibold">{notification.actor.username}</span>
                                {' '}
                                <span className="text-muted-foreground">
                                  {getNotificationText(notification)}
                                </span>
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                {!notification.read && (
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
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
                      <Button variant="ghost" className="w-full text-primary hover:text-primary text-sm">
                        View all notifications
                      </Button>
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}

export default RightSidebar