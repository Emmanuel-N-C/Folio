import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatRelativeTime } from '@/lib/utils'
import { MessageCircle, ExternalLink, Github, ChevronDown, ChevronUp } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import LikeButton from './LikeButton'
import LivePreview from './LivePreview'

const PostCard = ({ post }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Check if description is long (more than 150 characters)
  const isLongDescription = post.description && post.description.length > 150
  const shouldTruncate = isLongDescription && !isExpanded

  return (
    <Card className="hover:shadow-xl transition-all">
      {/* Compact Header */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to={`/profile/${post.userId}`}>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={post.userProfileImageUrl} alt={post.username} />
                  <AvatarFallback>
                    {post.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
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
          
          {/* Quick Action Links */}
          <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Content Section - Above Preview */}
      <CardContent className="px-4 pb-3 space-y-3">
        {/* Title */}
        <Link to={`/posts/${post.id}`}>
          <h3 className="text-xl font-bold hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Description with Read More */}
        {post.description && (
          <div className="space-y-1">
            <p className={`text-sm text-muted-foreground ${shouldTruncate ? 'line-clamp-3' : ''}`}>
              {post.description}
            </p>
            {isLongDescription && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
              >
                {isExpanded ? (
                  <>
                    Show less <ChevronUp className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    Read more <ChevronDown className="h-3 w-3" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Tech Stack */}
        {post.techStack && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Built with:</span>
            <span className="text-xs text-foreground font-medium bg-muted px-2 py-1 rounded">
              {post.techStack}
            </span>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 5).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 5}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      {/* HERO: Live Preview - Full Width */}
      {post.liveDemoUrl ? (
        <div className="px-4 pb-4">
          <LivePreview 
            url={post.liveDemoUrl}
            screenshots={post.screenshotUrls}
            title={post.title}
            size="feed"
          />
        </div>
      ) : post.screenshotUrls && post.screenshotUrls.length > 0 ? (
        <div className="px-4 pb-4">
          <Link to={`/posts/${post.id}`} className="block">
            <div className="w-full aspect-video overflow-hidden rounded-lg bg-muted border">
              <img 
                src={post.screenshotUrls[0]} 
                alt={post.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
        </div>
      ) : null}

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

        <Link to={`/posts/${post.id}`}>
          <Button variant="ghost" size="sm" className="text-xs">
            View Details →
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default PostCard