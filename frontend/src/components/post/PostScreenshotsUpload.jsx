import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { postsAPI } from '@/api/posts'
import { Upload, Loader2, X, Image as ImageIcon } from 'lucide-react'

const PostScreenshotsUpload = ({ postId, onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const { toast } = useToast()

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Validate files
    const validFiles = []
    const validPreviews = []

    files.forEach((file) => {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: `${file.name} is not a valid image format`,
          variant: 'destructive',
        })
        return
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `${file.name} exceeds 5MB limit`,
          variant: 'destructive',
        })
        return
      }

      validFiles.push(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        validPreviews.push({
          file: file,
          url: reader.result,
          name: file.name,
          size: file.size,
        })

        if (validPreviews.length === validFiles.length) {
          setPreviews(validPreviews)
        }
      }
      reader.readAsDataURL(file)
    })

    setSelectedFiles(validFiles)
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setUploading(true)
    try {
      const updatedPost = await postsAPI.uploadPostScreenshots(postId, selectedFiles)
      
      toast({
        title: 'Success',
        description: `${selectedFiles.length} screenshot(s) uploaded successfully!`,
      })

      // Clear selection
      setSelectedFiles([])
      setPreviews([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess(updatedPost)
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error.response?.data?.message || 'Failed to upload screenshots',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const handleCancel = () => {
    setSelectedFiles([])
    setPreviews([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Upload Screenshots
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Preview Grid */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 rounded-b-lg">
                  <p className="truncate">{preview.name}</p>
                  <p className="text-muted-foreground">
                    {(preview.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Actions */}
        {selectedFiles.length > 0 ? (
          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading {selectedFiles.length} file(s)...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload {selectedFiles.length} Screenshot(s)
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={uploading}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose Screenshots
            </Button>
            <p className="text-xs text-muted-foreground">
              Select multiple images • JPEG, PNG, or WEBP • Max 5MB each
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PostScreenshotsUpload