import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { aiAPI } from '@/api/ai'
import { useToast } from '@/components/ui/use-toast'
import { Github, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

const AICodeReview = () => {
  const [githubUrl, setGithubUrl] = useState('')
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const analyzeRepo = async () => {
    if (!githubUrl) {
      toast({
        title: "Error",
        description: "Please enter a GitHub URL",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      // Mock review for demo
      const mockReview = {
        strengths: [
          'Clean and well-organized code structure',
          'Comprehensive README with setup instructions',
          'Good use of modern React patterns and hooks',
          'Responsive design implementation'
        ],
        improvements: [
          'Add more unit tests for components',
          'Consider implementing error boundaries',
          'Optimize bundle size by code splitting',
          'Add TypeScript for better type safety'
        ],
        techStack: 'React, Tailwind CSS, Vite, React Router',
        overallScore: 8.5
      }
      setReview(mockReview)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze repository",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          AI Code Review
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://github.com/username/repo"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
          />
          <Button onClick={analyzeRepo} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Review'
            )}
          </Button>
        </div>

        {review && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
              <span className="font-semibold">Overall Score</span>
              <span className="text-2xl font-bold text-primary">
                {review.overallScore}/10
              </span>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                Strengths
              </h4>
              <ul className="space-y-2">
                {review.strengths.map((item, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-orange-600">
                <AlertCircle className="h-4 w-4" />
                Areas for Improvement
              </h4>
              <ul className="space-y-2">
                {review.improvements.map((item, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Tech Stack:</span> {review.techStack}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AICodeReview