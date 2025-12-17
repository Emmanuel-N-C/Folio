import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'
import { usersAPI } from '@/api/users'
import { Trash2, Upload, Loader2, Image as ImageIcon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const ProfilePhotoSettings = () => {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a JPEG, PNG, or WEBP image',
        variant: 'destructive',
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
        variant: 'destructive',
      })
      return
    }

    setSelectedFile(file)
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
      const updatedUser = await usersAPI.uploadProfilePicture(user.id, selectedFile)
      updateUser(updatedUser)
      setSelectedFile(null)
      setPreviewUrl(null)
      toast({
        title: 'Success',
        description: 'Profile picture updated successfully!',
      })
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

  const handleRemove = async () => {
    setRemoving(true)
    try {
      const updatedUser = await usersAPI.removeProfilePicture()
      updateUser(updatedUser)
      setShowRemoveDialog(false)
      toast({
        title: 'Success',
        description: 'Profile picture removed successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to remove profile picture',
        variant: 'destructive',
      })
    } finally {
      setRemoving(false)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Photo</CardTitle>
        <CardDescription>
          Upload a photo to personalize your profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current/Preview Photo */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-40 w-40 border-2 border-border">
              <AvatarImage 
                src={previewUrl || user?.profileImageUrl} 
                alt="Profile"
                className="object-cover"
              />
              <AvatarFallback className="text-5xl bg-gradient-to-br from-primary/10 to-primary/5">
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            {previewUrl && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                  <ImageIcon className="h-3 w-3" />
                  Preview
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Upload Section */}
        {selectedFile ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium truncate max-w-[250px]">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpload} disabled={uploading} className="flex-1">
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Save Photo
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={uploading}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={() => document.getElementById('photo-upload').click()}
                className="flex-1"
                variant="outline"
              >
                <Upload className="mr-2 h-4 w-4" />
                {user?.profileImageUrl ? 'Change Photo' : 'Upload Photo'}
              </Button>
              {user?.profileImageUrl && (
                <Button
                  variant="destructive"
                  onClick={() => setShowRemoveDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              )}
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, or WEBP • Max 5MB
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Your photo will be cropped to fit a circle
              </p>
            </div>
          </div>
        )}

        <input
          id="photo-upload"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Remove Confirmation Dialog */}
        <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Profile Picture?</AlertDialogTitle>
              <AlertDialogDescription>
                Your profile will display your username initial instead. You can upload a new picture anytime.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={removing}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRemove}
                disabled={removing}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {removing ? 'Removing...' : 'Remove'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

export default ProfilePhotoSettings