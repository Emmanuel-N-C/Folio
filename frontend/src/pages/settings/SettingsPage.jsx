import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'
import { usersAPI } from '@/api/users'
import { CheckCircle2, XCircle, Loader2, Upload, Trash2, AlertTriangle } from 'lucide-react'
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

const SettingsPage = () => {
  const { user, updateUser, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  
  // Profile form state
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState(null)
  
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    bio: '',
    githubUrl: '',
    websiteUrl: '',
    location: '',
    profession: '',
  })
  const [originalData, setOriginalData] = useState({})

  // Photo upload state
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)

  // Delete account state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (user) {
      const data = {
        displayName: user.displayName || '',
        username: user.username || '',
        bio: user.bio || '',
        githubUrl: user.githubUrl || '',
        websiteUrl: user.websiteUrl || '',
        location: user.location || '',
        profession: user.profession || '',
      }
      setFormData(data)
      setOriginalData(data)
    }
  }, [user])

  // Check username availability with debounce
  useEffect(() => {
    if (!isEditing || formData.username === originalData.username) {
      setUsernameAvailable(null)
      return
    }

    const timeoutId = setTimeout(async () => {
      if (formData.username.length < 3) {
        setUsernameAvailable(null)
        return
      }

      setCheckingUsername(true)
      try {
        const result = await usersAPI.checkUsernameAvailability(formData.username)
        setUsernameAvailable(result.available)
      } catch (error) {
        console.error('Error checking username:', error)
      } finally {
        setCheckingUsername(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [formData.username, isEditing, originalData.username])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData(originalData)
    setIsEditing(false)
    setUsernameAvailable(null)
  }

  const handleSave = async () => {
    if (usernameAvailable === false) {
      toast({
        title: 'Username unavailable',
        description: 'Please choose a different username',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const updatedProfile = await usersAPI.updateProfile(formData)
      updateUser(updatedProfile)
      setOriginalData(formData)
      setIsEditing(false)
      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Photo upload handlers
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

  const handleRemovePhoto = async () => {
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

  const handleCancelUpload = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  // Delete account handler
  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      toast({
        title: 'Confirmation required',
        description: 'Please type DELETE to confirm',
        variant: 'destructive',
      })
      return
    }

    setDeleting(true)
    try {
      await usersAPI.deleteAccount()
      toast({
        title: 'Account deleted',
        description: 'Your account has been permanently deleted',
      })
      logout()
      navigate('/login')
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete account',
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and profile information</p>
      </div>

      {/* Profile Picture Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Update your profile photo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <Avatar className="h-32 w-32">
              <AvatarImage src={previewUrl || user?.profileImageUrl} alt="Profile" />
              <AvatarFallback className="text-4xl">
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            {/* Upload Controls */}
            <div className="flex-1 space-y-4 w-full">
              {previewUrl && (
                <p className="text-sm text-muted-foreground">Preview of new photo</p>
              )}

              {selectedFile ? (
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
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
                    <Button variant="outline" onClick={handleCancelUpload} disabled={uploading}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={() => document.getElementById('photo-upload').click()}
                    variant="outline"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {user?.profileImageUrl ? 'Change Photo' : 'Add Photo'}
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
              )}
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, or WEBP • Max 5MB
              </p>
            </div>
          </div>

          <input
            id="photo-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Profile Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Display Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Display Name</label>
            <Input
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              disabled={!isEditing}
              placeholder="Your display name"
            />
            <p className="text-xs text-muted-foreground">
              This is how your name will appear across the site
            </p>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <div className="relative">
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={!isEditing}
                placeholder="username"
                className="pr-10"
              />
              {isEditing && formData.username !== originalData.username && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {checkingUsername ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : usernameAvailable === true ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : usernameAvailable === false ? (
                    <XCircle className="h-4 w-4 text-destructive" />
                  ) : null}
                </div>
              )}
            </div>
            {isEditing && formData.username !== originalData.username && (
              <p className={`text-xs ${usernameAvailable ? 'text-green-500' : 'text-destructive'}`}>
                {checkingUsername
                  ? 'Checking availability...'
                  : usernameAvailable
                  ? '✓ Username available'
                  : '✗ Username already taken'}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Your unique identifier. Must be unique.
            </p>
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input value={user?.email || ''} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>

          {/* Profession */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Profession</label>
            <Input
              value={formData.profession}
              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
              disabled={!isEditing}
              placeholder="e.g., Full-Stack Developer"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              disabled={!isEditing}
              placeholder="e.g., San Francisco, CA"
            />
          </div>

          {/* GitHub URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">GitHub URL</label>
            <Input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              disabled={!isEditing}
              placeholder="https://github.com/username"
            />
          </div>

          {/* Website URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Website URL</label>
            <Input
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              disabled={!isEditing}
              placeholder="https://yourwebsite.com"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            {!isEditing ? (
              <Button onClick={handleEdit}>Edit Profile</Button>
            ) : (
              <>
                <Button onClick={handleSave} disabled={loading || usernameAvailable === false}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={loading}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone Section */}
      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border border-destructive rounded-lg bg-destructive/5 space-y-3">
            <div>
              <h3 className="font-semibold text-destructive mb-2">Delete Account</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Once you delete your account, there is no going back. This will permanently delete:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside mb-4">
                <li>Your profile and account information</li>
                <li>All your posts and content</li>
                <li>All your likes and comments</li>
                <li>Your profile picture and uploaded images</li>
              </ul>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="w-full"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Delete My Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Remove Photo Dialog */}
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
              onClick={handleRemovePhoto}
              disabled={removing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removing ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                This action cannot be undone. This will permanently delete your account
                and remove all your data from our servers.
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Type <span className="font-bold">DELETE</span> to confirm:
                </label>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="font-mono"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              onClick={() => {
                setConfirmText('')
                setShowDeleteDialog(false)
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleting || confirmText !== 'DELETE'}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete Account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default SettingsPage