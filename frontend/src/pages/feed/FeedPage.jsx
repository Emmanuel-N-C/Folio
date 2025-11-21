import { useEffect, useState } from 'react'
import { postsAPI } from '@/api/posts'
import PostCard from '@/components/post/PostCard'
import PostSkeleton from '@/components/post/PostSkeleton'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

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
      <div className="space-y-6">
        {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Feed</h1>
      
      {posts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No posts yet. Be the first to share your project!</p>
        </div>
      ) : (
        <>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}

          {hasMore && (
            <div className="text-center">
              <Button onClick={loadMore} variant="outline">
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