import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Home, 
  Compass, 
  Bell, 
  Search,
  Palette, 
  Settings, 
  PlusCircle,
  Moon,
  Sun,
  LogOut
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { notificationsAPI } from '@/api/notifications'

const Sidebar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [theme, setTheme] = useState('light')
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  useEffect(() => {
    // Fetch unread notification count
    if (isAuthenticated) {
      fetchUnreadCount()
      // Poll every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationsAPI.getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const navItems = [
    { icon: Home, label: 'Home', path: '/feed', show: true },
    { icon: Compass, label: 'Explore', path: '/trending', show: true },
    { icon: Search, label: 'Search', path: '/search', show: true },
    { icon: Bell, label: 'Notifications', path: '/notifications', show: isAuthenticated, badge: unreadCount },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Get profile image URL - handle both possible field names
  const profileImageUrl = user?.profileImageUrl || user?.profilePictureUrl || null

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="text-2xl font-bold gradient-text">
            Folio
          </span>
        </Link>
      </div>

      {/* User Profile Card */}
      {isAuthenticated && user && (
        <div className="p-4 border-b">
          <Link to={`/profile/${user.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all group">
            <Avatar className="w-12 h-12 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <AvatarImage 
                src={profileImageUrl} 
                alt={user.username || 'User'} 
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white font-semibold">
                {user.username?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user.username}</p>
              <p className="text-xs text-muted-foreground truncate">@{user.username?.toLowerCase()}</p>
            </div>
          </Link>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (!item.show) return null
          
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={active ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 h-12 text-base relative ${
                  active ? 'bg-primary/10 text-primary hover:bg-primary/20' : ''
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-primary' : ''}`} />
                <span className="font-medium">{item.label}</span>
                {item.badge > 0 && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Button>
            </Link>
          )
        })}

        {/* Customize Section */}
        <div className="pt-2">
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className="w-full justify-start gap-3 h-12 text-base"
          >
            <Palette className="h-5 w-5" />
            <span className="font-medium">Customize</span>
            <div className="ml-auto">
              {theme === 'dark' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </div>
          </Button>
        </div>

        {isAuthenticated && (
          <Link to="/settings">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 h-12 text-base ${
                isActive('/settings') ? 'bg-primary/10 text-primary' : ''
              }`}
            >
              <Settings className={`h-5 w-5 ${isActive('/settings') ? 'text-primary' : ''}`} />
              <span className="font-medium">Settings</span>
            </Button>
          </Link>
        )}
      </nav>

      {/* Create Post Button */}
      {isAuthenticated && (
        <div className="p-4 border-t space-y-2">
          <Link to="/posts/create">
            <Button className="w-full gap-2 h-12 text-base shadow-lg hover:shadow-xl transition-all">
              <PlusCircle className="h-5 w-5" />
              Create Post
            </Button>
          </Link>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="w-full gap-2 h-12 text-base hover:bg-destructive hover:text-destructive-foreground transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      )}
    </aside>
  )
}

export default Sidebar