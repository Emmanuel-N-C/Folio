import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { commentsAPI } from '@/api/comments'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'

const CommentForm = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to comment",
        variant: "destructive"
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "Validation error",
        description: "Comment cannot be empty",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const newComment = await commentsAPI.addComment(postId, content)
      setContent('')
      onCommentAdded(newComment)
      toast({
        title: "Success",
        description: "Comment added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add comment",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="p-4 border rounded-lg text-center text-muted-foreground">
        Please login to leave a comment
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />
      <Button type="submit" disabled={loading || !content.trim()}>
        {loading ? 'Posting...' : 'Post Comment'}
      </Button>
    </form>
  )
}

export default CommentForm