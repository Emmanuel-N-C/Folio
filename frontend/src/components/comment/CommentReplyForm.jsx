import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { commentsAPI } from '@/api/comments'
import { useToast } from '@/components/ui/use-toast'

const CommentReplyForm = ({ postId, commentId, onReplyAdded, onCancel }) => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) return

    setLoading(true)
    try {
      const newReply = await commentsAPI.addReply(postId, commentId, content)
      onReplyAdded(newReply)
      setContent('')
      toast({
        title: "Success",
        description: "Reply added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add reply",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-2">
      <Textarea
        placeholder="Write a reply..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
        rows={2}
        className="text-sm"
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={loading || !content.trim()}>
          {loading ? 'Replying...' : 'Reply'}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default CommentReplyForm
