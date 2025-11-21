import { useEffect, useState } from 'react'
import { commentsAPI } from '@/api/comments'
import CommentItem from './CommentItem'
import CommentForm from './CommentForm'
import { useToast } from '@/components/ui/use-toast'

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchComments = async () => {
    try {
      const data = await commentsAPI.getComments(postId)
      setComments(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  const handleCommentAdded = (newComment) => {
    setComments(prev => [newComment, ...prev])
  }

  const handleCommentDeleted = (commentId) => {
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  if (loading) {
    return <div>Loading comments...</div>
  }

  return (
    <div className="space-y-6">
      <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
      
      <div className="space-y-4">
        <h3 className="font-semibold">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h3>
        {comments.map(comment => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            postId={postId}
            onDeleted={handleCommentDeleted}
          />
        ))}
      </div>
    </div>
  )
}

export default CommentList