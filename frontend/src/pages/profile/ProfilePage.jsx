import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { usersAPI } from '@/api/users'
import { postsAPI } from '@/api/posts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import PostCard from '@/components/post/PostCard'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'
import { formatDate } from '@/lib/utils'
import { Edit, Github, Globe, Mail } from 'lucide-react'

const ProfilePage = () => {
  const { userId } = useParams()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
    fetchUserPosts()
  }, [userId])

  const fetchProfile = async () => {
    try {
      const data = await usersAPI.getUserProfile(userId)
      setProfile(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchUserPosts = async () => {
    try {
      const data = await postsAPI.getPostsByUser(userId)
      setPosts(data)
    } catch (error) {
      console.error('Failed to load posts:', error)
    }
  }

  if (loading) {
    return <div>Loading profile...</div>
  }

  if (!profile) {
    return <div>Profile not found</div>
  }

  const isOwnProfile = user?.id === profile.id

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Use Avatar component instead of div */}
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.profileImageUrl} alt={profile.username} />
                <AvatarFallback className="text-3xl">
                  {profile.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <CardTitle className="text-2xl">{profile.username}</CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Joined {formatDate(profile.createdAt)}
                </p>
              </div>
            </div>

            {isOwnProfile && (
              <Link to="/settings">
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {profile.bio && (
            <p className="text-muted-foreground">{profile.bio}</p>
          )}

          <div className="flex flex-wrap gap-4">
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            )}
            {profile.websiteUrl && (
              <a
                href={profile.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Globe className="h-4 w-4" />
                Website
              </a>
            )}
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{profile.postsCount || posts.length}</span> projects
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              {isOwnProfile ? (
                <>
                  <p>You haven't posted any projects yet.</p>
                  <Link to="/posts/create">
                    <Button className="mt-4">Create Your First Post</Button>
                  </Link>
                </>
              ) : (
                <p>No projects yet.</p>
              )}
            </CardContent>
          </Card>
        ) : (
          posts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  )
}

export default ProfilePage