import { useEffect, useState } from 'react'
import { postsAPI } from '@/api/posts'
import PostCard from '@/components/post/PostCard'
import PostSkeleton from '@/components/post/PostSkeleton'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Sparkles, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const FeedPage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const { toast } = useToast()

  const fetchPosts = async (pageNum) => {
    try {
      const data = await postsAPI.getFeed(pageNum, 10)
      if (pageNum === 0) {
        setPosts(data.content)
      } else {
        setPosts(prev => [...prev, ...data.content])
      }
      setHasMore(!data.last)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(0)
  }, [])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchPosts(nextPage)
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 px-4 py-8">
        {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Discover <span className="gradient-text">Projects</span>
              </h1>
              <p className="text-muted-foreground">
                Explore amazing projects from developers worldwide
              </p>
            </div>
            <Link to="/trending">
              <Button variant="outline" className="gap-2 rounded-full">
                <TrendingUp className="h-4 w-4" />
                Trending
              </Button>
            </Link>
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20 fade-in">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to share your amazing project!
            </p>
            <Link to="/posts/create">
              <Button className="gap-2 rounded-full">
                <Sparkles className="h-4 w-4" />
                Create Your First Post
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <div key={post.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <PostCard post={post} />
              </div>
            ))}

            {hasMore && (
              <div className="text-center py-8">
                <Button 
                  onClick={loadMore} 
                  variant="outline"
                  className="rounded-full px-8"
                >
                  Load More Projects
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FeedPage