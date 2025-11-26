import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { commentsAPI } from '@/api/comments'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'
import { formatRelativeTime } from '@/lib/utils'
import { Trash2, Edit2, X, Check } from 'lucide-react'

const CommentItem = ({ comment, postId, onDeleted, onUpdated }) => {
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canEdit = user?.userId === comment.userId
  const canDelete = user?.userId === comment.userId || isAdmin()

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

  const handleUpdate = async () => {
    if (!editContent.trim()) return
    
    setIsSubmitting(true)
    try {
      const updatedComment = await commentsAPI.updateComment(postId, comment.id, editContent)
      onUpdated(updatedComment)
      setIsEditing(false)
      toast({
        title: "Success",
        description: "Comment updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelEdit = () => {
    setEditContent(comment.content)
    setIsEditing(false)
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
              {comment.updatedAt !== comment.createdAt && ' (edited)'}
            </span>
          </div>
          
          <div className="flex gap-1">
            {canEdit && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            
            {canDelete && !isEditing && (
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
        </div>
        
        {isEditing ? (
          <div className="space-y-2 pt-2">
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              disabled={isSubmitting}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleUpdate()
                } else if (e.key === 'Escape') {
                  handleCancelEdit()
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleUpdate}
                disabled={isSubmitting || !editContent.trim()}
              >
                <Check className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm">{comment.content}</p>
        )}
      </div>
    </div>
  )
}

export default CommentItem