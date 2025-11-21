import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { postsAPI } from '@/api/posts'
import { Input } from '@/components/ui/input'
import PostCard from '@/components/post/PostCard'
import PostSkeleton from '@/components/post/PostSkeleton'
import { useDebounce } from '@/hooks/useDebounce'
import { Search } from 'lucide-react'

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    if (debouncedQuery) {
      searchPosts(debouncedQuery)
      setSearchParams({ q: debouncedQuery })
    } else {
      setPosts([])
    }
  }, [debouncedQuery])

  const searchPosts = async (keyword) => {
    setLoading(true)
    try {
      const data = await postsAPI.searchPosts(keyword)
      setPosts(data.content)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Search Projects</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by title, description, or tech stack..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Found {posts.length} {posts.length === 1 ? 'result' : 'results'}
          </p>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No results found for "{query}"</p>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>Enter a search term to find projects</p>
        </div>
      )}
    </div>
  )
}

export default SearchPage