import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const { toast } = useToast()
  const [processing, setProcessing] = useState(true)

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const requiresOnboarding = searchParams.get('requiresOnboarding') === 'true'
      const token = searchParams.get('token')
      const oauthToken = searchParams.get('oauthToken')

      // If user needs onboarding (username selection)
      if (requiresOnboarding && oauthToken) {
        const suggestedUsername = searchParams.get('suggestedUsername')
        const email = searchParams.get('email')
        const name = searchParams.get('name')
        const profileImageUrl = searchParams.get('profileImageUrl')

        // Redirect to username selection page
        navigate('/auth/oauth/username-selection', {
          state: {
            oauthToken,
            suggestedUsername,
            email,
            name,
            profileImageUrl,
          },
        })
        return
      }

      // If user is already registered, login directly
      if (token) {
        const userId = searchParams.get('userId')
        const username = searchParams.get('username')

        // Store token and user data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify({ id: userId, username }))

        toast({
          title: 'Welcome Back!',
          description: 'You have successfully logged in with OAuth.',
          duration: 4000,
        })

        // Refresh user profile to get full data
        window.location.href = '/'
        return
      }

      // If no valid parameters, show error
      toast({
        title: 'OAuth Error',
        description: 'Invalid OAuth callback. Please try again.',
        variant: 'destructive',
        duration: 5000,
      })
      navigate('/login')
    }

    handleOAuthCallback()
  }, [searchParams, navigate, toast])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Processing OAuth Login</CardTitle>
          <CardDescription>Please wait while we complete your authentication...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  )
}

export default OAuthCallbackPage