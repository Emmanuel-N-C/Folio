import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useWebSocket } from '@/contexts/WebSocketContext'
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
  Shield,
  X,
  WifiOff
} from 'lucide-react'
import { useState, useEffect } from 'react'

const Sidebar = ({ isOpen, onClose }) => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const { unreadCount, connected, usePolling } = useWebSocket()
  const location = useLocation()
  const navigate = useNavigate()
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

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
    onClose?.()
  }

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      onClose?.()
    }
  }

  const profileImageUrl = user?.profileImageUrl || user?.profilePictureUrl || null

  return (
    <>
      <aside className={`
        fixed lg:sticky top-0 h-screen w-64 bg-background border-r
        transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-4 space-y-4">
          <div className="lg:hidden flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="pt-2 pb-2">
            <Link to="/" className="flex items-center gap-3 group" onClick={handleNavClick}>
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <span className="font-bold text-xl text-primary-foreground">F</span>
              </div>
              <span className="text-2xl font-bold text-foreground">Folio</span>
            </Link>
          </div>

          {isAuthenticated && usePolling && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs">
              <WifiOff className="h-4 w-4" />
              <span>Limited connectivity</span>
            </div>
          )}

          {isAuthenticated && user && (
            <Link 
              to={`/profile/${user.id}`} 
              className="flex items-center gap-3 p-4 rounded-2xl bg-card hover:bg-muted transition-all group shadow-sm"
              onClick={handleNavClick}
            >
              <Avatar className="w-12 h-12 ring-2 ring-border group-hover:ring-muted-foreground transition-all">
                <AvatarImage src={profileImageUrl} alt={user.username || 'User'} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
                  {user.username?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate text-foreground">
                  {user.displayName || user.username}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  @{user.username?.toLowerCase()}
                </p>
              </div>
            </Link>
          )}

          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              if (!item.show) return null
              
              const Icon = item.icon
              const active = isActive(item.path)
              
              return (
                <Link key={item.path} to={item.path} onClick={handleNavClick}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 h-11 text-sm font-medium rounded-xl ${
                      active 
                        ? 'bg-secondary text-foreground hover:bg-secondary' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-auto bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </Button>
                </Link>
              )
            })}

            <Button
              variant="ghost"
              onClick={toggleTheme}
              className="w-full justify-start gap-3 h-11 text-sm font-medium rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {theme === 'dark' ? (
                <Moon className="h-5 w-5" strokeWidth={2} />
              ) : (
                <Sun className="h-5 w-5" strokeWidth={2} />
              )}
              <span>Theme</span>
              <span className="ml-auto text-xs text-muted-foreground capitalize">{theme}</span>
            </Button>

            {isAuthenticated && (
              <Link to="/settings" onClick={handleNavClick}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 h-11 text-sm font-medium rounded-xl ${
                    isActive('/settings')
                      ? 'bg-secondary text-foreground hover:bg-secondary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Settings className="h-5 w-5" strokeWidth={2} />
                  <span>Settings</span>
                </Button>
              </Link>
            )}
          </nav>

          {isAuthenticated && (
            <div className="space-y-2 p-4 rounded-2xl bg-card shadow-sm">
              <Link to="/posts/create" onClick={handleNavClick}>
                <Button className="w-full gap-2 h-11 text-sm font-medium rounded-xl shadow-md hover:shadow-lg transition-all">
                  <PlusCircle className="h-5 w-5" strokeWidth={2} />
                  Create Post
                </Button>
              </Link>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="w-full gap-2 h-11 text-sm font-medium rounded-xl"
              >
                <LogOut className="h-5 w-5" strokeWidth={2} />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar