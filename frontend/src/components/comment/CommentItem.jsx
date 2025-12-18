import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { commentsAPI } from '@/api/comments'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'
import { formatRelativeTime } from '@/lib/utils'
import { Trash2, Edit2, X, Check, MessageCircle, ChevronDown, ChevronUp, MoreVertical } from 'lucide-react'
import CommentLikeButton from './CommentLikeButton'
import CommentReplyForm from './CommentReplyForm'
import { Link } from 'react-router-dom'
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const CommentItem = ({ comment, postId, postOwnerId, onDeleted, onUpdated }) => {
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replies, setReplies] = useState([])
  const [showReplies, setShowReplies] = useState(false)
  const [loadingReplies, setLoadingReplies] = useState(false)
  const [replyCount, setReplyCount] = useState(comment.repliesCount || 0)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const canEdit = user?.userId === comment.userId
  const canDelete = user?.userId === comment.userId || user?.userId === postOwnerId || isAdmin()

  // Helper function to check if comment was edited (accounting for timestamp differences)
  const isEdited = (createdAt, updatedAt) => {
    if (!createdAt || !updatedAt) return false
    const created = new Date(createdAt).getTime()
    const updated = new Date(updatedAt).getTime()
    // Consider edited if difference is more than 2 seconds
    return Math.abs(updated - created) > 2000
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await commentsAPI.deleteComment(postId, comment.id)
      onDeleted(comment.id)
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      })
      setShowDeleteDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdate = async () => {
    if (!editContent.trim()) return

    setIsSubmitting(true)
    try {
      const updated = await commentsAPI.updateComment(postId, comment.id, editContent)
      onUpdated(updated)
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

  const loadReplies = async () => {
    if (replies.length > 0) {
      setShowReplies(!showReplies)
      return
    }

    setLoadingReplies(true)
    try {
      const data = await commentsAPI.getReplies(postId, comment.id)
      setReplies(data)
      setShowReplies(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load replies",
        variant: "destructive"
      })
    } finally {
      setLoadingReplies(false)
    }
  }

  const handleReplyAdded = (newReply) => {
    setReplies([newReply, ...replies])
    setReplyCount(prev => prev + 1)
    setShowReplyForm(false)
    setShowReplies(true)
  }

  const handleReplyDeleted = (replyId) => {
    setReplies(replies.filter(r => r.id !== replyId))
    setReplyCount(prev => prev - 1)
  }

  const handleReplyUpdated = (updatedReply) => {
    setReplies(replies.map(r => r.id === updatedReply.id ? updatedReply : r))
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <Link to={`/profile/${comment.userId}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.userProfileImageUrl} />
            <AvatarFallback>{comment.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link 
                to={`/profile/${comment.userId}`}
                className="font-semibold text-sm hover:underline"
              >
                {comment.displayName || comment.username}
              </Link>
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(comment.createdAt)}
                {isEdited(comment.createdAt, comment.updatedAt) && ' (edited)'}
              </span>
            </div>

            {(canEdit || canDelete) && !isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canEdit && (
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit2 className="h-3 w-3 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <>
                      {canEdit && <DropdownMenuSeparator />}
                      <DropdownMenuItem 
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="text-sm"
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
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent(comment.content)
                  }}
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

          <div className="flex items-center gap-4 pt-1">
            <CommentLikeButton
              postId={postId}
              comment={comment}
            />

            {user && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
          </div>

          {replyCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground"
              onClick={loadReplies}
              disabled={loadingReplies}
            >
              {showReplies ? (
                <ChevronUp className="h-3 w-3 mr-1" />
              ) : (
                <ChevronDown className="h-3 w-3 mr-1" />
              )}
              {loadingReplies ? 'Loading...' : `${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}`}
            </Button>
          )}
        </div>
      </div>

      {showReplyForm && (
        <div className="ml-11">
          <CommentReplyForm
            postId={postId}
            commentId={comment.id}
            onReplyAdded={handleReplyAdded}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {showReplies && replies.length > 0 && (
        <div className="ml-11 space-y-3 pt-2 border-l-2 border-muted pl-4">
          {replies.map(reply => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              postId={postId}
              postOwnerId={postOwnerId}
              parentCommentUserId={comment.userId}
              onDeleted={handleReplyDeleted}
              onUpdated={handleReplyUpdated}
            />
          ))}
        </div>
      )}

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        itemName={comment.content.length > 50 ? comment.content.substring(0, 50) + '...' : comment.content}
        isDeleting={isDeleting}
      />
    </div>
  )
}

// Reply Item Component
const ReplyItem = ({ reply, postId, postOwnerId, parentCommentUserId, onDeleted, onUpdated }) => {
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(reply.content)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const canEdit = user?.userId === reply.userId
  const canDelete = user?.userId === reply.userId || 
                   user?.userId === postOwnerId || 
                   user?.userId === parentCommentUserId || 
                   isAdmin()

  // Helper function to check if reply was edited
  const isEdited = (createdAt, updatedAt) => {
    if (!createdAt || !updatedAt) return false
    const created = new Date(createdAt).getTime()
    const updated = new Date(updatedAt).getTime()
    // Consider edited if difference is more than 2 seconds
    return Math.abs(updated - created) > 2000
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await commentsAPI.deleteComment(postId, reply.id)
      onDeleted(reply.id)
      toast({
        title: "Success",
        description: "Reply deleted successfully",
      })
      setShowDeleteDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete reply",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdate = async () => {
    if (!editContent.trim()) return

    setIsSubmitting(true)
    try {
      const updated = await commentsAPI.updateComment(postId, reply.id, editContent)
      onUpdated(updated)
      setIsEditing(false)
      toast({
        title: "Success",
        description: "Reply updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reply",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="flex gap-3">
        <Link to={`/profile/${reply.userId}`}>
          <Avatar className="h-7 w-7">
            <AvatarImage src={reply.userProfileImageUrl} />
            <AvatarFallback>{reply.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link 
                to={`/profile/${reply.userId}`}
                className="font-semibold text-sm hover:underline"
              >
                {reply.displayName || reply.username}
              </Link>
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(reply.createdAt)}
                {isEdited(reply.createdAt, reply.updatedAt) && ' (edited)'}
              </span>
            </div>

            {(canEdit || canDelete) && !isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canEdit && (
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit2 className="h-3 w-3 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <>
                      {canEdit && <DropdownMenuSeparator />}
                      <DropdownMenuItem 
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="text-sm"
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
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent(reply.content)
                  }}
                  disabled={isSubmitting}
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm">{reply.content}</p>
          )}

          <div className="flex items-center gap-4 pt-1">
            <CommentLikeButton
              postId={postId}
              comment={reply}
            />
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Reply"
        description="Are you sure you want to delete this reply? This action cannot be undone."
        itemName={reply.content.length > 50 ? reply.content.substring(0, 50) + '...' : reply.content}
        isDeleting={isDeleting}
      />
    </>
  )
}

export default CommentItem