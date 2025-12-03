import { useAuth } from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Image, Video, FileText, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CreatePostCard = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated) return null

  const handleStartPost = () => {
    navigate('/posts/create')
  }

  return (
    <Card className="p-4 bg-card border shadow-sm hover:shadow-md transition-shadow">
      {/* Start a post input */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-12 h-12 ring-2 ring-primary/10">
          <AvatarImage src={user?.profileImageUrl} alt={user?.username} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white font-semibold">
            {user?.username?.charAt(0).toUpperCase()}
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
          onClick={handleStartPost}
          className="flex-1 gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
        >
          <Image className="h-5 w-5" />
          <span className="hidden sm:inline font-semibold">Photo</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleStartPost}
          className="flex-1 gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950"
        >
          <Video className="h-5 w-5" />
          <span className="hidden sm:inline font-semibold">Live Preview</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleStartPost}
          className="flex-1 gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950"
        >
          <FileText className="h-5 w-5" />
          <span className="hidden sm:inline font-semibold">Article</span>
        </Button>
      </div>
    </Card>
  )
}

export default CreatePostCard