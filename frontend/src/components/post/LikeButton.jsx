import { useState } from 'react'
import { Heart } from 'lucide-react'
import { likesAPI } from '@/api/likes'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

const LikeButton = ({ postId, initialLiked, initialCount }) => {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to like posts",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      if (liked) {
        await likesAPI.unlikePost(postId)
        setLiked(false)
        setCount(prev => prev - 1)
      } else {
        await likesAPI.likePost(postId)
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
    <button
      onClick={handleLike}
      disabled={loading}
      className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
    >
      <Heart 
        className={cn(
          "h-4 w-4",
          liked && "fill-red-500 text-red-500"
        )}
      />
      <span>{count}</span>
    </button>
  )
}

export default LikeButton