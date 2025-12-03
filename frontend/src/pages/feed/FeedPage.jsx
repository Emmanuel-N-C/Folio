import { useEffect, useState } from 'react'
import { postsAPI } from '@/api/posts'
import PostCard from '@/components/post/PostCard'
import PostSkeleton from '@/components/post/PostSkeleton'
import CreatePostCard from '@/components/post/CreatePostCard'
import FeedFilter from '@/components/feed/FeedFilter'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const FeedPage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [activeFilter, setActiveFilter] = useState('recent')
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()

  const fetchPosts = async (pageNum, filter = 'recent') => {
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
    fetchPosts(0, activeFilter)
  }, [activeFilter])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchPosts(nextPage, activeFilter)
  }

  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    setPage(0)
    setLoading(true)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {isAuthenticated && (
          <>
            <div className="h-32 bg-muted animate-pulse rounded-xl" />
            <div className="h-12 bg-muted animate-pulse rounded-xl" />
          </>
        )}
        {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* LinkedIn-style Create Post Card */}
      {isAuthenticated && (
        <div className="fade-in">
          <CreatePostCard />
        </div>
      )}

      {/* Filter Section */}
      <div className="fade-in" style={{ animationDelay: '0.1s' }}>
        <FeedFilter onFilterChange={handleFilterChange} />
      </div>

      {/* Posts */}
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
        <>
          {posts.map((post, index) => (
            <div key={post.id} className="fade-in" style={{ animationDelay: `${(index + 2) * 0.05}s` }}>
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
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default FeedPage