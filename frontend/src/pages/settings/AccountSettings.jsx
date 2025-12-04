import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { usersAPI } from '@/api/users'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

const AccountSettings = () => {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Manage your basic profile information
        </CardDescription>
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
        <div className="flex gap-4 pt-4">
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
  )
}

export default AccountSettings