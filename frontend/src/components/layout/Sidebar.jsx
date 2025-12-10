import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Home, 
  Compass, 
  Bell, 
  Search,
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
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount()
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
    { icon: Shield, label: 'Admin', path: '/admin', show: isAuthenticated && isAdmin() },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const profileImageUrl = user?.profileImageUrl || user?.profilePictureUrl || null

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
            <span className="font-bold text-xl text-white">F</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">Folio</span>
        </Link>
      </div>

      {/* User Profile Card */}
      {isAuthenticated && user && (
        <div className="p-4 border-b border-gray-200">
          <Link 
            to={`/profile/${user.id}`} 
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group"
          >
            <Avatar className="w-12 h-12 ring-2 ring-gray-200 group-hover:ring-gray-300 transition-all">
              <AvatarImage src={profileImageUrl} alt={user.username || 'User'} />
              <AvatarFallback className="bg-gradient-to-br from-gray-900 to-gray-700 text-white font-semibold">
                {user.username?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate text-gray-900">
                {user.displayName || user.username}
              </p>
              <p className="text-xs text-gray-500 truncate">
                @{user.username?.toLowerCase()}
              </p>
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
                className={`w-full justify-start gap-3 h-11 text-sm font-medium rounded-xl ${
                  active 
                    ? 'bg-gray-100 text-gray-900 hover:bg-gray-100' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="ml-auto bg-gray-900 text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Button>
            </Link>
          )
        })}

        {/* Theme Toggle */}
        <div className="pt-2">
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className="w-full justify-start gap-3 h-11 text-sm font-medium rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            {theme === 'dark' ? (
              <Moon className="h-5 w-5" strokeWidth={2} />
            ) : (
              <Sun className="h-5 w-5" strokeWidth={2} />
            )}
            <span>Theme</span>
            <span className="ml-auto text-xs text-gray-500 capitalize">{theme}</span>
          </Button>
        </div>

        {isAuthenticated && (
          <Link to="/settings">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 h-11 text-sm font-medium rounded-xl ${
                isActive('/settings')
                  ? 'bg-gray-100 text-gray-900 hover:bg-gray-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Settings className="h-5 w-5" strokeWidth={2} />
              <span>Settings</span>
            </Button>
          </Link>
        )}
      </nav>

      {/* Action Buttons */}
      {isAuthenticated && (
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link to="/posts/create">
            <Button className="w-full gap-2 h-11 text-sm font-medium rounded-xl bg-gray-900 hover:bg-gray-800 shadow-md hover:shadow-lg transition-all">
              <PlusCircle className="h-5 w-5" strokeWidth={2} />
              Create Post
            </Button>
          </Link>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="w-full gap-2 h-11 text-sm font-medium rounded-xl border-gray-300 hover:bg-gray-50"
          >
            <LogOut className="h-5 w-5" strokeWidth={2} />
            Sign Out
          </Button>
        </div>
      )}
    </aside>
  )
}

export default Sidebar