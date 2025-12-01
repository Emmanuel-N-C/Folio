import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { usersAPI } from '@/api/users'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload'

const EditProfilePage = () => {
  const [formData, setFormData] = useState({
    bio: '',
    githubUrl: '',
    websiteUrl: ''
  })
  const [loading, setLoading] = useState(false)
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || '',
        githubUrl: user.githubUrl || '',
        websiteUrl: user.websiteUrl || ''
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updatedProfile = await usersAPI.updateProfile(formData)
      updateUser(updatedProfile)
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })
      navigate(`/profile/${user.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleProfilePictureUploadSuccess = (updatedUser) => {
    // Update user in context with new profile picture
    updateUser(updatedUser)
    
    toast({
      title: "Profile picture updated",
      description: "Your profile picture has been updated everywhere!",
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Picture Upload */}
      <ProfilePictureUpload
        userId={user?.id}
        username={user?.username}
        currentImageUrl={user?.profileImageUrl}
        onUploadSuccess={handleProfilePictureUploadSuccess}
      />

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">GitHub URL</label>
              <Input
                type="url"
                placeholder="https://github.com/username"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Website URL</label>
              <Input
                type="url"
                placeholder="https://yourwebsite.com"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/profile/${user.id}`)}
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

export default EditProfilePage