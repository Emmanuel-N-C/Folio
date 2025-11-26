import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import { MessageCircle, ExternalLink, Github } from 'lucide-react'
import LikeButton from './LikeButton'
import LivePreview from './LivePreview'

const PostCard = ({ post }) => {
  return (
    <Card className="hover:shadow-xl transition-all overflow-hidden">
      {/* Author Header - Compact */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.userId}`}>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
              <span className="text-sm font-bold text-primary">
                {post.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          </Link>
          <div className="flex-1">
            <Link 
              to={`/profile/${post.userId}`}
              className="font-semibold hover:underline text-sm"
            >
              {post.username}
            </Link>
            <p className="text-xs text-muted-foreground">
              {formatRelativeTime(post.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Title - Above Preview */}
      <div className="px-4 pb-3">
        <Link to={`/posts/${post.id}`}>
          <h3 className="text-lg font-bold hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
      </div>

      {/* HERO: Live Preview or Screenshot - Full Width, Large */}
      {post.liveDemoUrl ? (
        <div className="w-full">
          <LivePreview 
            url={post.liveDemoUrl}
            screenshots={post.screenshotUrls}
            title={post.title}
            size="feed"
          />
        </div>
      ) : post.screenshotUrls && post.screenshotUrls.length > 0 ? (
        <Link to={`/posts/${post.id}`} className="block">
          <div className="w-full aspect-video overflow-hidden bg-muted">
            <img 
              src={post.screenshotUrls[0]} 
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      ) : null}

      {/* Content Below - Compact */}
      <CardContent className="px-4 pt-3 pb-2 space-y-2">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {post.description}
        </p>

        {/* Tags & Tech Stack */}
        <div className="flex items-center gap-2 flex-wrap">
          {post.techStack && (
            <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded">
              {post.techStack}
            </span>
          )}
          {post.tags?.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {post.tags?.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>
      </CardContent>

      {/* Footer Actions */}
      <CardFooter className="px-4 py-3 border-t flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LikeButton 
            postId={post.id} 
            initialLiked={post.likedByCurrentUser}
            initialCount={post.likesCount}
          />
          
          <Link 
            to={`/posts/${post.id}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">{post.commentsCount}</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {post.liveDemoUrl && (
            <a 
              href={post.liveDemoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
              title="Open Live Demo"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {post.githubUrl && (
            <a 
              href={post.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
              title="View Code"
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