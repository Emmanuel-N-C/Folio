import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatRelativeTime } from '@/lib/utils'
import { MessageCircle, ExternalLink, Github, ChevronDown, ChevronUp, Eye } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ProjectMediaViewer from './ProjectMediaViewer'
import LikeButton from './LikeButton'

const PostCard = ({ post }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const isLongDescription = post.description && post.description.length > 150
  const shouldTruncate = isLongDescription && !isExpanded

  return (
    <Card className="overflow-hidden hover-lift border-0 shadow-lg">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.userId}`}>
              <Avatar className="w-12 h-12 ring-2 ring-primary/10 hover:ring-primary/30 transition-all">
                <AvatarImage src={post.userProfileImageUrl} alt={post.username} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
                  {post.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link 
                to={`/profile/${post.userId}`}
                className="font-semibold hover:text-primary transition-colors"
              >
                {post.displayName || post.username}
              </Link>
              <p className="text-xs text-muted-foreground">
                {formatRelativeTime(post.createdAt)}
              </p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="flex items-center gap-2">
            {post.liveDemoUrl && (
              <a 
                href={post.liveDemoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-muted transition-colors"
                onClick={(e) => e.stopPropagation()}
                title="Live Demo"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary" />
              </a>
            )}
            {post.githubUrl && (
              <a 
                href={post.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-muted transition-colors"
                onClick={(e) => e.stopPropagation()}
                title="Source Code"
              >
                <Github className="h-4 w-4 text-muted-foreground hover:text-primary" />
              </a>
            )}
          </div>
        </div>

        {/* Title */}
        <Link to={`/posts/${post.id}`}>
          <h2 className="text-2xl font-bold hover:text-primary transition-colors mb-3 line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {/* Description */}
        {post.description && (
          <div className="space-y-2">
            <p className={`text-muted-foreground leading-relaxed ${shouldTruncate ? 'line-clamp-3' : ''}`}>
              {post.description}
            </p>
            {isLongDescription && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-primary hover:underline flex items-center gap-1 font-medium"
              >
                {isExpanded ? (
                  <>Show less <ChevronUp className="h-3 w-3" /></>
                ) : (
                  <>Read more <ChevronDown className="h-3 w-3" /></>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Media Preview */}
      {(post.liveDemoUrl || (post.screenshotUrls && post.screenshotUrls.length > 0)) && (
        <div className="px-6 pb-4">
          <div className="rounded-xl overflow-hidden border shadow-sm">
            <ProjectMediaViewer
              liveDemoUrl={post.liveDemoUrl}
              screenshots={post.screenshotUrls}
              title={post.title}
              size="feed"
            />
          </div>
        </div>
      )}

      {/* Tech Stack & Tags */}
      <CardContent className="px-6 pb-4 space-y-3">
        {post.techStack && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Tech Stack:</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-blue-600/10 border border-primary/20">
              <span className="text-xs font-medium text-primary">
                {post.techStack}
              </span>
            </div>
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 5).map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs rounded-full hover:bg-secondary/80 transition-colors"
              >
                #{tag}
              </Badge>
            ))}
            {post.tags.length > 5 && (
              <Badge variant="outline" className="text-xs rounded-full">
                +{post.tags.length - 5} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-6 py-4 bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <LikeButton 
            postId={post.id} 
            initialLiked={post.likedByCurrentUser}
            initialCount={post.likesCount}
          />
          
          <Link 
            to={`/posts/${post.id}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">{post.commentsCount}</span>
          </Link>
        </div>

        <Link to={`/posts/${post.id}`}>
          <Button variant="ghost" size="sm" className="gap-2 rounded-full hover:bg-background">
            <Eye className="h-4 w-4" />
            View Project
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default PostCard