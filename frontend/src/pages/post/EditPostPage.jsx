import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { postsAPI } from '@/api/posts'
import { useToast } from '@/components/ui/use-toast'
import { X } from 'lucide-react'

const EditPostPage = () => {
  const { postId } = useParams()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    liveDemoUrl: '',
    githubUrl: '',
    screenshotUrls: [''],
    tags: ['']
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPost = async () => {
    try {
      const post = await postsAPI.getPostById(postId)
      setFormData({
        title: post.title || '',
        description: post.description || '',
        techStack: post.techStack || '',
        liveDemoUrl: post.liveDemoUrl || '',
        githubUrl: post.githubUrl || '',
        screenshotUrls: post.screenshotUrls?.length ? post.screenshotUrls : [''],
        tags: post.tags?.length ? post.tags : ['']
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load post",
        variant: "destructive"
      })
      navigate('/feed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const postData = {
        ...formData,
        screenshotUrls: formData.screenshotUrls.filter(url => url.trim()),
        tags: formData.tags.filter(tag => tag.trim())
      }

      await postsAPI.updatePost(postId, postData)
      toast({
        title: "Success",
        description: "Post updated successfully!",
      })
      navigate(`/posts/${postId}`)
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update post",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Title *</label>
              <Input
                placeholder="My Awesome Project"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                placeholder="Describe your project..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tech Stack *</label>
              <Input
                placeholder="React, Node.js, MongoDB"
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Live Demo URL</label>
              <Input
                type="url"
                placeholder="https://myproject.vercel.app"
                value={formData.liveDemoUrl}
                onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">GitHub URL</label>
              <Input
                type="url"
                placeholder="https://github.com/username/project"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Post'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/posts/${postId}`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditPostPage