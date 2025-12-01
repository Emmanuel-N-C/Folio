import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, PlusCircle, User, LogOut, Settings, Shield, Home, TrendingUp } from 'lucide-react'

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="glass sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:inline">
              Folio
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/feed">
              <Button variant="ghost" className="gap-2">
                <Home className="h-4 w-4" />
                Feed
              </Button>
            </Link>
            <Link to="/trending">
              <Button variant="ghost" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Search Button */}
          <Link to="/search">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-5 w-5" />
            </Button>
          </Link>

          {isAuthenticated ? (
            <>
              {/* Create Post Button */}
              <Link to="/posts/create">
                <Button className="gap-2 rounded-full shadow-md hover:shadow-lg transition-all">
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Create</span>
                </Button>
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={user?.profileImageUrl} alt={user?.username} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white">
                        {user?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <p className="text-sm font-semibold">{user?.username}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/profile/${user?.id}`)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  {isAdmin() && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="rounded-full">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="rounded-full shadow-md hover:shadow-lg transition-all">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar