import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { postsAPI } from '@/api/posts'
import { useToast } from '@/components/ui/use-toast'
import { X, Sparkles } from 'lucide-react'
import AIGenerateProjectFields from '@/components/ai/AIGenerateProjectFields'

const CreatePostPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    liveDemoUrl: '',
    githubUrl: '',
    screenshotUrls: [''],
    tags: ['']
  })
  const [showAIGenerator, setShowAIGenerator] = useState(true)
  const [aiGenerated, setAiGenerated] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleAIGenerate = (aiResult) => {
    // Populate form with AI-generated data
    setFormData({
      ...formData,
      title: aiResult.projectTitle || formData.title,
      description: aiResult.description || formData.description,
      techStack: Array.isArray(aiResult.techStack) 
        ? aiResult.techStack.join(', ') 
        : aiResult.techStack || formData.techStack,
      tags: Array.isArray(aiResult.tags) && aiResult.tags.length > 0
        ? aiResult.tags
        : formData.tags,
    })
    
    setAiGenerated(true)
    setShowAIGenerator(false)
    
    // Scroll to form
    setTimeout(() => {
      document.getElementById('project-form')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const postData = {
        ...formData,
        screenshotUrls: formData.screenshotUrls.filter(url => url.trim()),
        tags: formData.tags.filter(tag => tag.trim())
      }

      const newPost = await postsAPI.createPost(postData)
      toast({
        title: "Success",
        description: "Post created successfully!",
      })
      navigate(`/posts/${newPost.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create post",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addScreenshotUrl = () => {
    setFormData({ ...formData, screenshotUrls: [...formData.screenshotUrls, ''] })
  }

  const removeScreenshotUrl = (index) => {
    setFormData({ 
      ...formData, 
      screenshotUrls: formData.screenshotUrls.filter((_, i) => i !== index) 
    })
  }

  const updateScreenshotUrl = (index, value) => {
    const newUrls = [...formData.screenshotUrls]
    newUrls[index] = value
    setFormData({ ...formData, screenshotUrls: newUrls })
  }

  const addTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, ''] })
  }

  const removeTag = (index) => {
    setFormData({ 
      ...formData, 
      tags: formData.tags.filter((_, i) => i !== index) 
    })
  }

  const updateTag = (index, value) => {
    const newTags = [...formData.tags]
    newTags[index] = value
    setFormData({ ...formData, tags: newTags })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* AI Generator Section */}
      {showAIGenerator && (
        <AIGenerateProjectFields
          onGenerate={handleAIGenerate}
          initialData={{
            githubUrl: formData.githubUrl,
            liveDemoUrl: formData.liveDemoUrl,
            screenshotUrls: formData.screenshotUrls,
          }}
        />
      )}

      {/* Manual Form */}
      <Card id="project-form">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {aiGenerated ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  AI Generated - Review & Edit
                </span>
              ) : (
                'Create New Post'
              )}
            </CardTitle>
            {!showAIGenerator && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAIGenerator(true)}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Use AI Again
              </Button>
            )}
          </div>
          {aiGenerated && (
            <p className="text-sm text-gray-600">
              Review the AI-generated content below and make any adjustments before publishing.
            </p>
          )}
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
                rows={6}
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Screenshot URLs</label>
              {formData.screenshotUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://imgur.com/screenshot.png"
                    value={url}
                    onChange={(e) => updateScreenshotUrl(index, e.target.value)}
                  />
                  {formData.screenshotUrls.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeScreenshotUrl(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addScreenshotUrl}>
                Add Screenshot
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="react"
                    value={tag}
                    onChange={(e) => updateTag(index, e.target.value)}
                  />
                  {formData.tags.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeTag(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addTag}>
                Add Tag
              </Button>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Post'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
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

export default CreatePostPage