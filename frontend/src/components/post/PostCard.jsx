import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import { MessageCircle, ExternalLink, Github } from 'lucide-react'
import LikeButton from './LikeButton'

const PostCard = ({ post }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                {post.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <Link 
                to={`/profile/${post.userId}`}
                className="font-semibold hover:underline"
              >
                {post.username}
              </Link>
              <p className="text-xs text-muted-foreground">
                {formatRelativeTime(post.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Link to={`/posts/${post.id}`}>
          <h3 className="text-xl font-bold hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>

        <p className="text-muted-foreground line-clamp-2">
          {post.description}
        </p>

        {post.screenshotUrls && post.screenshotUrls.length > 0 && (
          <img 
            src={post.screenshotUrls[0]} 
            alt={post.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}

        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {post.techStack && (
            <span className="font-medium">{post.techStack}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LikeButton 
            postId={post.id} 
            initialLiked={post.likedByCurrentUser}
            initialCount={post.likesCount}
          />
          
          <Link 
            to={`/posts/${post.id}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.commentsCount}</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {post.liveDemoUrl && (
            <a 
              href={post.liveDemoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {post.githubUrl && (
            <a 
              href={post.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

export default PostCard