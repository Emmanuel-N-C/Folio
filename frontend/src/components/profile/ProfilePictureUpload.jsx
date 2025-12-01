import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/use-toast'
import { usersAPI } from '@/api/users'
import { Upload, Loader2, X, Camera } from 'lucide-react'

const ProfilePictureUpload = ({ userId, currentImageUrl, username, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const { toast } = useToast()

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a JPEG, PNG, or WEBP image',
        variant: 'destructive',
      })
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
        variant: 'destructive',
      })
      return
    }

    setSelectedFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    try {
      const updatedUser = await usersAPI.uploadProfilePicture(userId, selectedFile)
      
      toast({
        title: 'Success',
        description: 'Profile picture updated successfully!',
      })

      // Clear selection
      setSelectedFile(null)
      setPreviewUrl(null)
      
      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess(updatedUser)
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error.response?.data?.message || 'Failed to upload profile picture',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Avatar Preview */}
          <div className="relative">
            <Avatar className="h-32 w-32">
              <AvatarImage src={previewUrl || currentImageUrl} alt="Profile" />
              <AvatarFallback className="text-4xl">
                {username?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          {/* File Input (Hidden) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Selected File Info */}
          {selectedFile && (
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Upload Button */}
              <div className="flex gap-2">
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Picture
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
            </div>
          )}

          {/* Instructions */}
          {!selectedFile && (
            <div className="text-center space-y-1">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose Image
              </Button>
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, or WEBP • Max 5MB
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfilePictureUpload