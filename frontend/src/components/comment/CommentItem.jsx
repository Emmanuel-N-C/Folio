import { Button } from '@/components/ui/button'
import { commentsAPI } from '@/api/comments'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'
import { formatRelativeTime } from '@/lib/utils'
import { Trash2 } from 'lucide-react'

const CommentItem = ({ comment, postId, onDeleted }) => {
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()

  const canDelete = user?.id === comment.userId || isAdmin()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      await commentsAPI.deleteComment(postId, comment.id)
      onDeleted(comment.id)
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="flex gap-3 p-4 border rounded-lg">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-primary">
          {comment.username?.charAt(0).toUpperCase()}
        </span>
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-sm">{comment.username}</span>
            <span className="text-xs text-muted-foreground ml-2">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <p className="text-sm">{comment.content}</p>
      </div>
    </div>
  )
}

export default CommentItem