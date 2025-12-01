import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'

const ScreenshotUpload = ({ screenshots, onScreenshotsChange, maxFiles = 5 }) => {
  const [previews, setPreviews] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const { toast } = useToast()

  const validateFile = (file) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: `${file.name} is not a valid image. Please use JPEG, PNG, or WEBP.`,
        variant: 'destructive',
      })
      return false
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: `${file.name} is larger than 5MB. Please choose a smaller file.`,
        variant: 'destructive',
      })
      return false
    }

    return true
  }

  const handleFiles = (files) => {
    const fileArray = Array.from(files)
    
    // Check max files limit
    if (screenshots.length + fileArray.length > maxFiles) {
      toast({
        title: 'Too many files',
        description: `You can only upload up to ${maxFiles} screenshots.`,
        variant: 'destructive',
      })
      return
    }

    // Validate all files
    const validFiles = fileArray.filter(validateFile)
    
    if (validFiles.length === 0) return

    // Create previews
    const newPreviews = []
    validFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push({
          file,
          preview: reader.result,
          name: file.name,
          size: file.size,
        })
        
        if (newPreviews.length === validFiles.length) {
          setPreviews([...previews, ...newPreviews])
          onScreenshotsChange([...screenshots, ...validFiles])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }

  const removeScreenshot = (index) => {
    const newScreenshots = screenshots.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    
    setPreviews(newPreviews)
    onScreenshotsChange(newScreenshots)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 bg-muted rounded-full">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, or WEBP (max 5MB each, up to {maxFiles} files)
            </p>
          </div>
        </div>
      </div>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video relative bg-muted">
                  <img
                    src={preview.preview}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay with remove button */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeScreenshot(index)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* File info */}
                <div className="p-2 border-t">
                  <p className="text-xs font-medium truncate">{preview.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(preview.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info text */}
      {screenshots.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {screenshots.length} of {maxFiles} screenshots selected
        </p>
      )}
    </div>
  )
}

export default ScreenshotUpload