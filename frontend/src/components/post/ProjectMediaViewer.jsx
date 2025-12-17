import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, AlertCircle, Loader2, MonitorPlay, Images, ChevronLeft, ChevronRight, Shield } from 'lucide-react'

const ProjectMediaViewer = ({ 
  liveDemoUrl, 
  screenshots = [], 
  title = "Project",
  size = "large" // "large" for detail page, "feed" for cards
}) => {
  const [activeTab, setActiveTab] = useState(null)
  const [iframeStatus, setIframeStatus] = useState('loading')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [blockReason, setBlockReason] = useState('')
  const iframeRef = useRef(null)
  const timeoutRef = useRef(null)

  const isFeed = size === 'feed'
  const hasLiveUrl = !!liveDemoUrl
  const hasScreenshots = screenshots && screenshots.length > 0

  const availableTabs = []
  if (hasLiveUrl) availableTabs.push('live')
  if (hasScreenshots) availableTabs.push('screenshots')

  useEffect(() => {
    if (availableTabs.length > 0 && !activeTab) {
      setActiveTab(availableTabs[0])
    }
  }, [availableTabs.length])

  useEffect(() => {
    if (!hasLiveUrl) return

    const isInIframe = () => {
      try {
        return window.self !== window.top
      } catch (e) {
        return true
      }
    }

    if (isInIframe()) {
      setIframeStatus('failed')
      setBlockReason('iframe-nesting-blocked')
      if (hasScreenshots) {
        setActiveTab('screenshots')
      }
      return
    }

    const currentDomain = window.location.hostname
    try {
      const urlObj = new URL(liveDemoUrl)
      const targetDomain = urlObj.hostname
      
      if (targetDomain === currentDomain || 
          (targetDomain.includes('folio') && targetDomain.includes('vercel.app')) ||
          (targetDomain.includes('folio') && targetDomain.includes('railway.app'))) {
        setIframeStatus('failed')
        setBlockReason('self-embed')
        if (hasScreenshots) {
          setActiveTab('screenshots')
        }
        return
      }
    } catch (error) {
      setIframeStatus('failed')
    }
  }, [liveDemoUrl, hasLiveUrl, hasScreenshots])

  useEffect(() => {
    if (!hasLiveUrl || activeTab !== 'live') return

    setIframeStatus('loading')

    timeoutRef.current = setTimeout(() => {
      if (iframeStatus === 'loading') {
        setIframeStatus('failed')
        if (hasScreenshots) {
          setActiveTab('screenshots')
        }
      }
    }, 6000)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [hasLiveUrl, activeTab])

  const handleIframeLoad = () => {
    setIframeStatus('success')
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleIframeError = () => {
    setIframeStatus('failed')
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (hasScreenshots) {
      setActiveTab('screenshots')
    }
  }

  useEffect(() => {
    if (!hasLiveUrl || activeTab !== 'live' || iframeStatus !== 'loading') return

    const iframe = iframeRef.current
    if (!iframe) return

    const checkIframeAccess = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      } catch (error) {
        setIframeStatus('failed')
        if (hasScreenshots) {
          setActiveTab('screenshots')
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }

    const checkTimeout = setTimeout(checkIframeAccess, 2000)
    return () => clearTimeout(checkTimeout)
  }, [hasLiveUrl, activeTab, iframeStatus, hasScreenshots])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % screenshots.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length)
  }

  if (!hasLiveUrl && !hasScreenshots) {
    return (
      <div className="flex items-center justify-center h-48 bg-muted rounded-lg border">
        <div className="text-center text-muted-foreground">
          <Images className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No preview available</p>
        </div>
      </div>
    )
  }

  if (availableTabs.length === 1) {
    const singleTab = availableTabs[0]

    if (singleTab === 'live') {
      return (
        <div className="space-y-3">
          {!isFeed && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Live Interactive Preview</h3>
                {iframeStatus === 'success' && (
                  <Badge className="bg-green-500">
                    <MonitorPlay className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={liveDemoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open
                </a>
              </Button>
            </div>
          )}

          {blockReason ? (
            <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
                <Shield className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Security Protection Active</p>
                  <p className="text-xs mt-1">
                    {blockReason === 'iframe-nesting-blocked' 
                      ? 'Live previews are disabled when Folio is embedded to prevent security risks.'
                      : 'Folio cannot be embedded inside itself to prevent infinite recursion.'}
                  </p>
                </div>
              </div>
              <Button asChild className="w-full mt-3">
                <a href={liveDemoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Live Demo
                </a>
              </Button>
            </div>
          ) : (
            <div className={`relative ${isFeed ? 'h-[300px] sm:h-[400px]' : 'h-[600px] sm:h-[700px] md:h-[750px] lg:h-[850px]'} w-full overflow-hidden rounded-lg border bg-muted`}>
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
                src={liveDemoUrl}
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

          {iframeStatus === 'success' && !isFeed && !blockReason && (
            <p className="text-xs text-muted-foreground text-center">
              💡 You can interact with the live project above
            </p>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {!isFeed && (
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Project Screenshots</h3>
            <Badge variant="secondary">
              {screenshots.length} {screenshots.length === 1 ? 'image' : 'images'}
            </Badge>
          </div>
        )}

        <div className="relative">
          <div className={`${isFeed ? 'aspect-video' : 'h-[500px] sm:h-[600px] md:h-[650px]'} w-full overflow-hidden rounded-lg border bg-muted`}>
            <img
              src={screenshots[currentImageIndex]}
              alt={`${title} screenshot ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
          </div>

          {screenshots.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 bg-background/80 px-2 py-1 rounded-full">
                {screenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-primary w-4' : 'bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // Multiple tabs
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {availableTabs.map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className="gap-2"
            >
              {tab === 'live' ? (
                <>
                  <MonitorPlay className="h-4 w-4" />
                  Live Preview
                  {iframeStatus === 'success' && activeTab === 'live' && !blockReason && (
                    <span className="ml-1 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  )}
                </>
              ) : (
                <>
                  <Images className="h-4 w-4" />
                  Screenshots ({screenshots.length})
                </>
              )}
            </Button>
          ))}
        </div>

        {activeTab === 'live' && hasLiveUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={liveDemoUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1" />
              Open
            </a>
          </Button>
        )}
      </div>

      {activeTab === 'live' && hasLiveUrl && (
        <>
          {blockReason ? (
            <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
                <Shield className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Security Protection Active</p>
                  <p className="text-xs mt-1">
                    {blockReason === 'iframe-nesting-blocked' 
                      ? 'Live previews are disabled when Folio is embedded to prevent security risks.'
                      : 'Folio cannot be embedded inside itself to prevent infinite recursion.'}
                  </p>
                </div>
              </div>
              <Button asChild className="w-full mt-3">
                <a href={liveDemoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Live Demo
                </a>
              </Button>
            </div>
          ) : (
            <div className={`relative ${isFeed ? 'h-[300px] sm:h-[400px]' : 'h-[600px] sm:h-[700px] md:h-[750px] lg:h-[850px]'} w-full overflow-hidden rounded-lg border bg-muted`}>
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
                src={liveDemoUrl}
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
        </>
      )}

      {activeTab === 'screenshots' && hasScreenshots && (
        <div className="relative">
          <div className={`${isFeed ? 'aspect-video' : 'h-[500px] sm:h-[600px] md:h-[650px]'} w-full overflow-hidden rounded-lg border bg-muted`}>
            <img
              src={screenshots[currentImageIndex]}
              alt={`${title} screenshot ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
          </div>

          {screenshots.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 bg-background/80 px-2 py-1 rounded-full">
                {screenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-primary w-4' : 'bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {iframeStatus === 'success' && activeTab === 'live' && !isFeed && !blockReason && (
        <p className="text-xs text-muted-foreground text-center">
          💡 You can interact with the live project above
        </p>
      )}
    </div>
  )
}

export default ProjectMediaViewer