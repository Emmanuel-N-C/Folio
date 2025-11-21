import { useEffect, useState } from 'react'
import { postsAPI } from '@/api/posts'
import PostCard from '@/components/post/PostCard'
import PostSkeleton from '@/components/post/PostSkeleton'
import { useToast } from '@/components/ui/use-toast'
import { TrendingUp } from 'lucide-react'

const TrendingPage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchTrending()
  }, [])

  const fetchTrending = async () => {
    try {
      const data = await postsAPI.getTrendingPosts(0, 20)
      setPosts(data.content)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load trending posts",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Trending Projects</h1>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No trending posts yet.</p>
        </div>
      ) : (
        posts.map(post => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}

export default TrendingPage