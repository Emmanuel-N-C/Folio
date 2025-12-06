import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { postsAPI } from '@/api/posts'
import { useToast } from '@/components/ui/use-toast'
import { X, Loader2, AlertCircle } from 'lucide-react'
import AIGenerateProjectFields from '@/components/ai/AIGenerateProjectFields'
import ScreenshotUpload from '@/components/post/ScreenshotUpload'

const CreatePostPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    liveDemoUrl: '',
    githubUrl: '',
    tags: ['']
  })
  const [screenshotFiles, setScreenshotFiles] = useState([])
  const [showAIGenerator, setShowAIGenerator] = useState(true)
  const [aiGenerated, setAiGenerated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  // Real-time validation - clear errors as user types
  useEffect(() => {
    if (touched) {
      const newErrors = {}
      
      if (!formData.title.trim()) {
        newErrors.title = 'Project title is required'
      }
      
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required'
      }
      
      if (!formData.techStack.trim()) {
        newErrors.techStack = 'Tech stack is required'
      }
      
      // Validate that user has provided either live demo URL or screenshots
      const hasLiveDemoUrl = formData.liveDemoUrl && formData.liveDemoUrl.trim() !== ''
      const hasScreenshots = screenshotFiles.length > 0
      
      if (!hasLiveDemoUrl && !hasScreenshots) {
        newErrors.media = 'Either a live demo URL or at least one screenshot is required'
      }
      
      setErrors(newErrors)
    }
  }, [formData, screenshotFiles, touched])

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

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (!formData.techStack.trim()) {
      newErrors.techStack = 'Tech stack is required'
    }
    
    // Validate that user has provided either live demo URL or screenshots
    const hasLiveDemoUrl = formData.liveDemoUrl && formData.liveDemoUrl.trim() !== ''
    const hasScreenshots = screenshotFiles.length > 0
    
    if (!hasLiveDemoUrl && !hasScreenshots) {
      newErrors.media = 'Either a live demo URL or at least one screenshot is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }
    
    setLoading(true)

    try {
      // Step 1: Create the post without screenshots
      const postData = {
        ...formData,
        screenshotUrls: [], // Empty initially
        tags: formData.tags.filter(tag => tag.trim())
      }

      const newPost = await postsAPI.createPost(postData)
      
      // Step 2: Upload screenshots if any
      if (screenshotFiles.length > 0) {
        toast({
          title: "Uploading screenshots...",
          description: `Uploading ${screenshotFiles.length} screenshot(s)`,
        })
        
        try {
          await postsAPI.uploadPostScreenshots(newPost.id, screenshotFiles)
        } catch (uploadError) {
          console.error('Screenshot upload failed:', uploadError)
          toast({
            title: "Warning",
            description: "Post created but some screenshots failed to upload",
            variant: "destructive"
          })
        }
      }

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
          }}
        />
      )}

      {/* Manual Form */}
      <Card id="project-form" className="hover:shadow-lg transition-all">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {aiGenerated ? 'AI Generated - Review & Edit' : 'Create New Post'}
              </CardTitle>
              {aiGenerated && (
                <p className="text-sm text-muted-foreground mt-1">
                  Review the AI-generated content below and make any adjustments before publishing.
                </p>
              )}
            </div>
            {!showAIGenerator && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAIGenerator(true)}
              >
                Use AI Again
              </Button>
            )}
          </div>
          {aiGenerated && (
            <Badge variant="secondary" className="w-fit">
              AI Generated
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Title *</label>
              <Input
                placeholder="My Awesome Project"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={touched && errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {touched && errors.title && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                placeholder="Describe your project..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className={touched && errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {touched && errors.description && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tech Stack *</label>
              <Input
                placeholder="React, Node.js, MongoDB"
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                className={touched && errors.techStack ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {touched && errors.techStack && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.techStack}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Live Demo URL <span className="text-muted-foreground">(Required if no screenshots)</span>
              </label>
              <Input
                type="url"
                placeholder="https://myproject.vercel.app"
                value={formData.liveDemoUrl}
                onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                className={touched && errors.media && !formData.liveDemoUrl ? 'border-red-500 focus-visible:ring-red-500' : ''}
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

            {/* Screenshot Upload Component */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Project Screenshots <span className="text-muted-foreground">(Required if no live demo URL)</span>
              </label>
              <div className={touched && errors.media && screenshotFiles.length === 0 ? 'border-2 border-red-500 rounded-lg p-1' : ''}>
                <ScreenshotUpload
                  screenshots={screenshotFiles}
                  onScreenshotsChange={setScreenshotFiles}
                  maxFiles={5}
                />
              </div>
              {touched && errors.media && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.media}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                At least one screenshot or a live demo URL is required
              </p>
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
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Post'
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
                disabled={loading}
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