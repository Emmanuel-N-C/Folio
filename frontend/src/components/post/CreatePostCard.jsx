import { useAuth } from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Image, Video, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CreatePostCard = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated) return null

  const handleStartPost = () => {
    navigate('/posts/create')
  }

  // Get profile image URL - handle both possible field names
  const profileImageUrl = user?.profileImageUrl || user?.profilePictureUrl || null

  return (
    <Card className="p-4 bg-card border shadow-sm hover:shadow-md transition-shadow">
      {/* Start a post input */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-12 h-12 ring-2 ring-primary/10">
          <AvatarImage 
            src={profileImageUrl} 
            alt={user?.username || 'User'} 
          />
          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <button
          onClick={handleStartPost}
          className="flex-1 px-4 py-3 rounded-full border-2 border-muted hover:bg-muted/50 transition-colors text-left text-muted-foreground font-medium hover:border-primary/30"
        >
          Create a post
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex-1 gap-2 text-muted-foreground hover:text-foreground"
          onClick={handleStartPost}
        >
          <Image className="h-4 w-4" />
          <span className="hidden sm:inline">Photo</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex-1 gap-2 text-muted-foreground hover:text-foreground"
          onClick={handleStartPost}
        >
          <Video className="h-4 w-4" />
          <span className="hidden sm:inline">Live Preview</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex-1 gap-2 text-muted-foreground hover:text-foreground"
          onClick={handleStartPost}
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Article</span>
        </Button>
      </div>
    </Card>
  )
}

export default CreatePostCard