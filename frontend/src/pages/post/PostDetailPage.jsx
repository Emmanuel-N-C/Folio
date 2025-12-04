import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { postsAPI } from '@/api/posts'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import CommentList from '@/components/comment/CommentList'
import LikeButton from '@/components/post/LikeButton'
import LivePreview from '@/components/post/LivePreview'
import ProjectMediaViewer from '@/components/post/ProjectMediaViewer'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'
import { formatRelativeTime } from '@/lib/utils'
import { Edit, Trash2, ExternalLink, Github, ArrowLeft, Upload } from 'lucide-react'

const PostDetailPage = () => {
  const { postId } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPost = async () => {
    try {
      const data = await postsAPI.getPostById(postId)
      setPost(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Post not found",
        variant: "destructive"
      })
      navigate('/feed')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await postsAPI.deletePost(postId)
      toast({
        title: "Success",
        description: "Post deleted successfully",
      })
      navigate('/feed')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto">Loading...</div>
  }

  if (!post) {
    return <div className="max-w-4xl mx-auto">Post not found</div>
  }

  // Check permissions
  const isOwner = user?.id === post.userId
  const canEdit = isOwner
  const canDelete = isOwner || isAdmin()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {post.userProfileImageUrl ? (
                  <img 
                    src={post.userProfileImageUrl} 
                    alt={post.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold text-primary">
                    {post.username?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <Link 
                  to={`/profile/${post.userId}`}
                  className="font-semibold text-lg hover:underline"
                >
                  {post.displayName || post.username}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {formatRelativeTime(post.createdAt)}
                  {post.updatedAt !== post.createdAt && ' (edited)'}
                </p>
              </div>
            </div>

            {(canEdit || canDelete) && (
              <div className="flex gap-2">
                {canEdit && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/posts/${postId}/upload-screenshots`)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Screenshots
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/posts/${postId}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </>
                )}
                {canDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <p className="text-lg text-muted-foreground whitespace-pre-wrap">
              {post.description}
            </p>
          </div>

          {/* Media Viewer Section */}
          {(post.liveDemoUrl || (post.screenshotUrls && post.screenshotUrls.length > 0)) && (
            <ProjectMediaViewer
              liveDemoUrl={post.liveDemoUrl}
              screenshots={post.screenshotUrls}
              title={post.title}
              size="large"
            />
          )}

          {/* No media message for owner */}
          {isOwner && !post.liveDemoUrl && (!post.screenshotUrls || post.screenshotUrls.length === 0) && (
            <div className="bg-muted p-6 rounded-lg text-center">
              <Images className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-3">No preview available yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add a live demo URL or upload screenshots to showcase your project
              </p>
              <Button
                variant="outline"
                onClick={() => navigate(`/posts/${postId}/upload-screenshots`)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Screenshots
              </Button>
            </div>
            )}

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Tech Stack</h3>
              <p className="text-muted-foreground">{post.techStack}</p>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Link key={index} to={`/search?tag=${tag}`}>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 pt-4 border-t">
              <LikeButton 
                postId={post.id}
                initialLiked={post.likedByCurrentUser}
                initialCount={post.likesCount}
              />

              <span className="text-sm text-muted-foreground">
                {post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}
              </span>

              {post.liveDemoUrl && (
                <a
                  href={post.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              )}

              {post.githubUrl && (
                <a
                  href={post.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Github className="h-4 w-4" />
                  View Code
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <CommentList postId={postId} postOwnerId={post.userId} />
        </CardContent>
      </Card>
    </div>
  )
}

export default PostDetailPage