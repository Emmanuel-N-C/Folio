import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { aiAPI } from '@/api/ai'
import { useToast } from '@/components/ui/use-toast'
import { Sparkles, Loader2 } from 'lucide-react'

const AIPostSuggestions = ({ onSelectIdea }) => {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generateSuggestions = async () => {
    setLoading(true)
    try {
      // Mock suggestions for demo
      const mockSuggestions = [
        {
          title: 'Real-time Collaboration Tool',
          description: 'Build a collaborative whiteboard with WebSocket for real-time drawing and chat',
          techStack: 'React, Socket.io, Node.js, MongoDB',
          estimatedTime: '2-3 weeks'
        },
        {
          title: 'AI-Powered Code Snippet Manager',
          description: 'Create a smart snippet manager with AI-powered search and categorization',
          techStack: 'Next.js, OpenAI API, PostgreSQL, Tailwind',
          estimatedTime: '3-4 weeks'
        },
        {
          title: 'Developer Portfolio Analytics',
          description: 'Track portfolio views, project clicks, and visitor demographics',
          techStack: 'React, Express, MongoDB, Chart.js',
          estimatedTime: '2 weeks'
        }
      ]
      setSuggestions(mockSuggestions)
      toast({
        title: "Success",
        description: "Generated project ideas!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate suggestions",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Project Suggestions
          </CardTitle>
          <Button onClick={generateSuggestions} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Ideas'
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Click "Generate Ideas" to get AI-powered project suggestions
          </p>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <Card key={index}>
                <CardContent className="pt-6 space-y-3">
                  <h3 className="font-semibold text-lg">{suggestion.title}</h3>
                  <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{suggestion.techStack}</Badge>
                    <Badge variant="outline">{suggestion.estimatedTime}</Badge>
                  </div>
                  {onSelectIdea && (
                    <Button 
                      size="sm" 
                      onClick={() => onSelectIdea(suggestion)}
                      className="mt-2"
                    >
                      Use This Idea
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AIPostSuggestions