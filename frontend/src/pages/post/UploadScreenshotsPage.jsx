import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { postsAPI } from '@/api/posts'
import PostScreenshotsUpload from '@/components/post/PostScreenshotsUpload'
import { ArrowLeft } from 'lucide-react'

const UploadScreenshotsPage = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPost = async () => {
    try {
      const data = await postsAPI.getPostById(postId)
      setPost(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load post',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSuccess = (updatedPost) => {
    setPost(updatedPost)
    toast({
      title: 'Success',
      description: 'Screenshots uploaded successfully!',
    })
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!post) {
    return <div className="text-center py-8">Post not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(`/posts/${postId}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Post
      </Button>

      {/* Post Info */}
      <Card>
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Current screenshots: {post.screenshotUrls?.length || 0}
          </p>
          {post.screenshotUrls && post.screenshotUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {post.screenshotUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-24 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Component */}
      <PostScreenshotsUpload
        postId={postId}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  )
}

export default UploadScreenshotsPage