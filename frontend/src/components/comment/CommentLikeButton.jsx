import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { commentsAPI } from '@/api/comments'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'

const CommentLikeButton = ({ comment, postId }) => {
  const [liked, setLiked] = useState(comment.likedByCurrentUser)
  const [count, setCount] = useState(comment.likesCount)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  const handleLike = async (e) => {
    e.stopPropagation()
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to like comments",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      if (liked) {
        await commentsAPI.unlikeComment(postId, comment.id)
        setLiked(false)
        setCount(prev => prev - 1)
      } else {
        await commentsAPI.likeComment(postId, comment.id)
        setLiked(true)
        setCount(prev => prev + 1)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update like",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={loading}
      className={`h-6 px-2 text-xs gap-1 ${liked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
    >
      <Heart className={`h-3 w-3 ${liked ? 'fill-current' : ''}`} />
      <span>{count}</span>
    </Button>
  )
}

export default CommentLikeButton