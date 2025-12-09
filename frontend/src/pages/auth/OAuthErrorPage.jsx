import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

const OAuthErrorPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const error = searchParams.get('error') || 'An unknown error occurred during OAuth authentication.'

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle>OAuth Authentication Failed</CardTitle>
          </div>
          <CardDescription>There was a problem signing you in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>

          <div className="space-y-2">
            <Button onClick={() => navigate('/login')} className="w-full">
              Back to Login
            </Button>
            <Button onClick={() => navigate('/register')} variant="outline" className="w-full">
              Create Account with Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OAuthErrorPage