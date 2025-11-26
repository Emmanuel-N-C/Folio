import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, AlertCircle, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const LivePreview = ({ 
  url, 
  screenshots = [], 
  title = "Project",
  size = "large" // "feed" for feed cards, "large" for detail page
}) => {
  const [iframeStatus, setIframeStatus] = useState('loading') // 'loading', 'success', 'error'
  const [showFallback, setShowFallback] = useState(false)
  const iframeRef = useRef(null)
  const timeoutRef = useRef(null)

  const isSmall = size === 'small'
  const isFeed = size === 'feed'
  
  // LinkedIn-style: Big preview for feed, even bigger for detail
  const heightClass = isFeed 
    ? 'aspect-video' // 16:9 ratio like LinkedIn
    : 'h-96 md:h-[700px] lg:h-[800px]'

  useEffect(() => {
    if (!url) {
      setShowFallback(true)
      setIframeStatus('error')
      return
    }

    // Reset state when URL changes
    setIframeStatus('loading')
    setShowFallback(false)

    // Set a timeout to detect if iframe doesn't load
    timeoutRef.current = setTimeout(() => {
      if (iframeStatus === 'loading') {
        console.log('Iframe load timeout - showing fallback')
        setShowFallback(true)
        setIframeStatus('error')
      }
    }, 8000) // 8 second timeout

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [url])

  const handleIframeLoad = () => {
    console.log('Iframe loaded successfully')
    setIframeStatus('success')
    setShowFallback(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleIframeError = () => {
    console.log('Iframe failed to load - showing fallback')
    setShowFallback(true)
    setIframeStatus('error')
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  // Detect X-Frame-Options and CSP blocking
  useEffect(() => {
    if (!url || iframeStatus !== 'loading') return

    const iframe = iframeRef.current
    if (!iframe) return

    const checkIframeAccess = () => {
      try {
        // Try to access iframe content - will throw if blocked by X-Frame-Options/CSP
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
        if (iframeDoc) {
          // Successfully accessed - iframe is loading
          console.log('Iframe content accessible')
        }
      } catch (error) {
        // Blocked by security policy
        console.log('Iframe blocked by security policy:', error.message)
        setShowFallback(true)
        setIframeStatus('error')
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }

    // Check after a short delay to allow iframe to start loading
    const checkTimeout = setTimeout(checkIframeAccess, 2000)

    return () => clearTimeout(checkTimeout)
  }, [url, iframeStatus])

  // Fallback UI Component
  const FallbackUI = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm">
          This website cannot be embedded. View the full experience by opening it in a new tab.
        </p>
      </div>

      {screenshots && screenshots.length > 0 ? (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Project Screenshots</h4>
          <div className={`grid gap-4 ${isSmall ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            {screenshots.slice(0, isSmall ? 1 : 4).map((screenshot, index) => (
              <img
                key={index}
                src={screenshot}
                alt={`${title} screenshot ${index + 1}`}
                className="w-full rounded-lg shadow-md object-cover"
                style={{ maxHeight: isSmall ? '200px' : '300px' }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
          <div className="text-center text-muted-foreground">
            <ExternalLink className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No preview available</p>
          </div>
        </div>
      )}

      <Button asChild className="w-full" size={isSmall ? "default" : "lg"}>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="mr-2 h-4 w-4" />
          Open Live Demo
        </a>
      </Button>
    </div>
  )

  // If no URL provided, show fallback immediately
  if (!url) {
    return (
      <Card>
        <CardContent className="pt-6">
          <FallbackUI />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={isFeed ? 'shadow-none border-0' : ''}>
      <CardContent className={isFeed ? 'p-0' : 'pt-6'}>
        <div className={isFeed ? '' : 'space-y-4'}>
          {/* Only show header on detail page, not feed */}
          {!isFeed && (
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                Live Interactive Preview
                {iframeStatus === 'loading' && (
                  <Badge variant="secondary" className="gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Loading
                  </Badge>
                )}
                {iframeStatus === 'success' && !showFallback && (
                  <Badge variant="default" className="bg-green-500">
                    Live
                  </Badge>
                )}
              </h3>
              {!showFallback && (
                <Button variant="outline" size="sm" asChild>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open
                  </a>
                </Button>
              )}
            </div>
          )}

          {/* Iframe or Fallback */}
          {showFallback ? (
            <FallbackUI />
          ) : (
            <div className={`relative ${heightClass} w-full overflow-hidden ${isFeed ? '' : 'rounded-lg border'} bg-muted`}>
              {iframeStatus === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Loading preview...</p>
                  </div>
                </div>
              )}
              
              <iframe
                ref={iframeRef}
                src={url}
                title={`${title} - Live Preview`}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                loading="lazy"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          )}

          {/* Helper text - only on detail page */}
          {iframeStatus === 'success' && !showFallback && !isFeed && (
            <p className="text-xs text-muted-foreground text-center">
              💡 You can interact with the live project above. Click "Open" to view in a new tab.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default LivePreview
