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
  LogOut,
  Shield
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { notificationsAPI } from '@/api/notifications'

const Sidebar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
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

  const navItems =[
  { icon: Home, label: 'Home', path: '/feed', show: true },
  { icon: Compass, label: 'Explore', path: '/trending', show: true },
  { icon: Search, label: 'Search', path: '/search', show: true },
  { icon: Bell, label: 'Notifications', path: '/notifications', show: isAuthenticated, badge: unreadCount },
  { icon: Shield, label: 'Admin Dashboard', path: '/admin', show: isAuthenticated && isAdmin() },
]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Get profile image URL - handle both possible field names
  const profileImageUrl = user?.profileImageUrl || user?.profilePictureUrl || null

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r-2 border-black bg-white">
      {/* Logo - Monochrome Style */}
      <div className="p-6 border-b-2 border-black">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-black flex items-center justify-center">
            <span className="font-serif font-bold text-xl">F</span>
          </div>
          <span className="text-2xl font-serif font-bold">
            Folio
          </span>
        </Link>
      </div>

      {/* User Profile Card */}
      {isAuthenticated && user && (
        <div className="p-4 border-b-2 border-black">
          <Link to={`/profile/${user.id}`} className="flex items-center gap-3 p-3 hover:bg-black hover:text-white transition-colors duration-100 group">
            <Avatar className="w-12 h-12 border-2 border-black">
              <AvatarImage 
                src={profileImageUrl} 
                alt={user.username || 'User'} 
              />
              <AvatarFallback className="bg-black text-white font-semibold font-serif">
                {user.username?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">
                {user.displayName || user.username}
              </p>
              <p className="text-xs text-muted-foreground truncate font-mono">@{user.username?.toLowerCase()}</p>
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
                variant="ghost"
                className={`w-full justify-start gap-3 h-12 text-base relative uppercase tracking-widest text-xs font-mono transition-colors duration-100 ${
                  active ? 'bg-black text-white hover:bg-black' : 'hover:bg-black hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5`} strokeWidth={1.5} />
                <span className="font-medium">{item.label}</span>
                {item.badge > 0 && (
                  <span className="ml-auto bg-black text-white border border-black text-xs font-bold px-2 py-0.5 min-w-[20px] text-center">
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
            className="w-full justify-start gap-3 h-12 text-base uppercase tracking-widest text-xs font-mono hover:bg-black hover:text-white transition-colors duration-100"
          >
            <Palette className="h-5 w-5" strokeWidth={1.5} />
            <span className="font-medium">Customize</span>
            <div className="ml-auto">
              {theme === 'dark' ? (
                <Moon className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Sun className="h-4 w-4" strokeWidth={1.5} />
              )}
            </div>
          </Button>
        </div>

        {isAuthenticated && (
          <Link to="/settings">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 h-12 text-base uppercase tracking-widest text-xs font-mono transition-colors duration-100 ${
                isActive('/settings') ? 'bg-black text-white hover:bg-black' : 'hover:bg-black hover:text-white'
              }`}
            >
              <Settings className={`h-5 w-5`} strokeWidth={1.5} />
              <span className="font-medium">Settings</span>
            </Button>
          </Link>
        )}
      </nav>

      {/* Create Post Button */}
      {isAuthenticated && (
        <div className="p-4 border-t-2 border-black space-y-2">
          <Link to="/posts/create">
            <Button className="w-full gap-2 h-12 text-base bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors duration-100 uppercase tracking-widest text-xs font-mono">
              <PlusCircle className="h-5 w-5" strokeWidth={1.5} />
              Create Post
            </Button>
          </Link>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="w-full gap-2 h-12 text-base border-2 border-black hover:bg-black hover:text-white transition-colors duration-100 uppercase tracking-widest text-xs font-mono"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.5} />
            Logout
          </Button>
        </div>
      )}
    </aside>
  )
}

export default Sidebar