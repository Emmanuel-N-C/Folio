import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { commentsAPI } from '@/api/comments'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'
import { formatRelativeTime } from '@/lib/utils'
import { Trash2, Edit2, X, Check, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'
import CommentLikeButton from './CommentLikeButton'
import CommentReplyForm from './CommentReplyForm'
import { Link } from 'react-router-dom'

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

  const canEdit = user?.userId === comment.userId
  const canDelete = user?.userId === comment.userId || user?.userId === postOwnerId || isAdmin()

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

  const loadReplies = async () => {
    setLoadingReplies(true)
    try {
      const repliesData = await commentsAPI.getReplies(postId, comment.id)
      setReplies(repliesData)
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
    setReplies([...replies, newReply])
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

  const toggleReplies = () => {
    if (!showReplies && replies.length === 0) {
      loadReplies()
    } else {
      setShowReplies(!showReplies)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-3 p-4 border rounded-lg">
        {/* Clickable Profile Picture */}
        <Link to={`/profile/${comment.userId}`} className="flex-shrink-0">
          <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
            <AvatarImage src={comment.userProfileImageUrl} alt={comment.username} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {comment.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              {/* Clickable Username */}
              <Link 
                to={`/profile/${comment.userId}`}
                className="font-semibold text-sm hover:underline cursor-pointer"
              >
                {comment.displayName || comment.username}
              </Link>
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
            <>
              <p className="text-sm">{comment.content}</p>
              
              <div className="flex items-center gap-2 pt-1">
                <CommentLikeButton
                  commentId={comment.id}
                  postId={postId}
                  initialLiked={comment.likedByCurrentUser}
                  initialCount={comment.likesCount}
                />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="gap-1 text-muted-foreground hover:text-foreground"
                >
                  <MessageCircle className="h-4 w-4" />
                  Reply
                </Button>

                {replyCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleReplies}
                    className="gap-1 text-muted-foreground hover:text-foreground"
                  >
                    {showReplies ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                  </Button>
                )}
              </div>
            </>
          )}

          {showReplyForm && (
            <CommentReplyForm
              postId={postId}
              commentId={comment.id}
              onReplyAdded={handleReplyAdded}
              onCancel={() => setShowReplyForm(false)}
            />
          )}
        </div>
      </div>

      {/* Replies Section */}
      {showReplies && (
        <div className="ml-12 space-y-2">
          {loadingReplies ? (
            <div className="text-sm text-muted-foreground">Loading replies...</div>
          ) : (
            replies.map(reply => (
              <div key={reply.id} className="flex gap-3 p-3 border rounded-lg bg-muted/30">
                {/* Clickable Reply Profile Picture */}
                <Link to={`/profile/${reply.userId}`} className="flex-shrink-0">
                  <Avatar className="w-7 h-7 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                    <AvatarImage src={reply.userProfileImageUrl} alt={reply.username} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {reply.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                
                <ReplyItem
                  reply={reply}
                  postId={postId}
                  postOwnerId={postOwnerId}
                  onDeleted={handleReplyDeleted}
                  onUpdated={handleReplyUpdated}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// Reply Item Component (nested inside same file)
const ReplyItem = ({ reply, postId, postOwnerId, onDeleted, onUpdated }) => {
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(reply.content)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canEdit = user?.userId === reply.userId
  const canDelete = user?.userId === reply.userId || user?.userId === postOwnerId || isAdmin()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this reply?')) return

    try {
      await commentsAPI.deleteComment(postId, reply.id)
      onDeleted(reply.id)
      toast({
        title: "Success",
        description: "Reply deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete reply",
        variant: "destructive"
      })
    }
  }

  const handleUpdate = async () => {
    if (!editContent.trim()) return
    
    setIsSubmitting(true)
    try {
      const updatedReply = await commentsAPI.updateComment(postId, reply.id, editContent)
      onUpdated(updatedReply)
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
    <div className="flex-1 space-y-1">
      <div className="flex items-center justify-between">
        <div>
          {/* Clickable Reply Username */}
          <Link 
            to={`/profile/${reply.userId}`}
            className="font-semibold text-sm hover:underline cursor-pointer"
          >
            {reply.displayName || reply.username}
          </Link>
          <span className="text-xs text-muted-foreground ml-2">
            {formatRelativeTime(reply.createdAt)}
            {reply.updatedAt !== reply.createdAt && ' (edited)'}
          </span>
        </div>
        
        <div className="flex gap-1">
          {canEdit && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          )}
          
          {canDelete && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-2">
          <Input
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            disabled={isSubmitting}
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
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting}
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm">{reply.content}</p>
          <div className="flex items-center gap-2 pt-1">
            <CommentLikeButton
              commentId={reply.id}
              postId={postId}
              initialLiked={reply.likedByCurrentUser}
              initialCount={reply.likesCount}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default CommentItem