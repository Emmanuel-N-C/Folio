import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TrendingUp, Heart, MessageCircle, UserPlus, Bell } from 'lucide-react'

const RightSidebar = () => {
  const { isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'like',
      user: { name: 'Sarah Chen', avatar: null, username: 'sarachen' },
      post: 'QuickThoughts',
      time: '5m ago',
      read: false
    },
    {
      id: 2,
      type: 'comment',
      user: { name: 'Mike Ross', avatar: null, username: 'mikeross' },
      post: 'Portfolio Website',
      time: '1h ago',
      read: false
    },
    {
      id: 3,
      type: 'follow',
      user: { name: 'Emma Wilson', avatar: null, username: 'emmaw' },
      time: '3h ago',
      read: true
    },
  ])

  const trendingTags = [
    { tag: 'React', posts: 1234 },
    { tag: 'NextJS', posts: 892 },
    { tag: 'TailwindCSS', posts: 756 },
    { tag: 'TypeScript', posts: 645 },
    { tag: 'WebDev', posts: 523 },
  ]

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case 'follow':
        return <UserPlus className="h-4 w-4 text-green-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'like':
        return `liked your post "${notification.post}"`
      case 'comment':
        return `commented on "${notification.post}"`
      case 'follow':
        return 'started following you'
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
                  <Badge variant="secondary" className="rounded-full">
                    {notifications.filter(n => !n.read).length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.slice(0, 4).map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <Avatar className="w-10 h-10 ring-2 ring-background">
                      <AvatarImage src={notification.user.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white text-xs">
                        {notification.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-semibold">{notification.user.name}</span>
                            {' '}
                            <span className="text-muted-foreground">
                              {getNotificationText(notification)}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.time}
                          </p>
                        </div>
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Link to="/notifications">
                  <Button variant="ghost" className="w-full text-primary hover:text-primary text-sm">
                    View all notifications
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Trending Tags */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Trending Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingTags.map((item, index) => (
                <Link
                  key={item.tag}
                  to={`/search?tag=${item.tag}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-muted-foreground w-5">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                        #{item.tag}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.posts.toLocaleString()} posts
                      </p>
                    </div>
                  </div>
                  <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Suggested Users (if authenticated) */}
          {isAuthenticated && (
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold">Who to Follow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white">
                          U{i}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">User {i}</p>
                        <p className="text-xs text-muted-foreground">@user{i}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-full">
                      Follow
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}

export default RightSidebar
