import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { authAPI } from '@/api/auth'

const REDIRECT_URI = `${window.location.origin}/auth/github/callback`

const GitHubCallbackPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const handleGitHubCallback = async () => {
      const code = searchParams.get('code')
      const error = searchParams.get('error')
      const mode = sessionStorage.getItem('oauth_mode') || 'login'

      if (error) {
        toast({
          title: 'Authentication Failed',
          description: 'GitHub authentication was cancelled or failed.',
          variant: 'destructive',
          duration: 5000,
        })
        sessionStorage.removeItem('oauth_mode')
        sessionStorage.removeItem('oauth_return_url')
        navigate('/login')
        return
      }

      if (!code) {
        toast({
          title: 'Authentication Failed',
          description: 'No authorization code received from GitHub.',
          variant: 'destructive',
          duration: 5000,
        })
        sessionStorage.removeItem('oauth_mode')
        sessionStorage.removeItem('oauth_return_url')
        navigate('/login')
        return
      }

      try {
        // SECURE: Exchange code for access token on backend (keeps client secret secure)
        const tokenResponse = await authAPI.exchangeGitHubCode({
          code: code,
          redirectUri: REDIRECT_URI,
        })

        const accessToken = tokenResponse.accessToken

        if (!accessToken) {
          throw new Error('Failed to get access token from GitHub')
        }

        // Step 1: Check if user exists
        const checkResponse = await authAPI.checkOAuthUser({
          token: accessToken,
          provider: 'github',
        })

        if (checkResponse.exists) {
          // User already exists
          if (mode === 'register') {
            // STRICT: Don't allow registration, show error
            toast({
              title: 'Account Already Exists',
              description: 'An account with this GitHub account already exists. Please use the login page instead.',
              variant: 'destructive',
              duration: 5000,
            })
            sessionStorage.removeItem('oauth_mode')
            sessionStorage.removeItem('oauth_return_url')
            // Redirect to login page
            setTimeout(() => {
              navigate('/login')
            }, 2000)
            return
          }

          // Step 2a: Login existing user (only from login page)
          const loginResponse = await authAPI.loginOAuthUser({
            token: accessToken,
            provider: 'github',
          })

          // Store token and user data
          localStorage.setItem('token', loginResponse.token)
          localStorage.setItem('user', JSON.stringify({
            id: loginResponse.userId,
            username: loginResponse.username,
          }))

          toast({
            title: 'Welcome Back!',
            description: 'You have successfully logged in with GitHub.',
            duration: 4000,
          })

          // Get return URL or default to home
          const returnUrl = sessionStorage.getItem('oauth_return_url') || '/'
          sessionStorage.removeItem('oauth_mode')
          sessionStorage.removeItem('oauth_return_url')
          
          window.location.href = returnUrl
        } else {
          // User doesn't exist
          if (mode === 'login') {
            // Show error that account doesn't exist
            toast({
              title: 'Account Not Found',
              description: 'No account found with this GitHub account. Please register first.',
              variant: 'destructive',
              duration: 5000,
            })
            sessionStorage.removeItem('oauth_mode')
            sessionStorage.removeItem('oauth_return_url')
            // Redirect to register page
            setTimeout(() => {
              navigate('/register')
            }, 2000)
            return
          }

          // Step 2b: Redirect to username selection for new user (only from register page)
          navigate('/auth/oauth/username-selection', {
            state: {
              token: accessToken,
              provider: 'github',
              email: checkResponse.email,
              name: checkResponse.name,
              profileImageUrl: checkResponse.profileImageUrl,
              suggestedUsername: checkResponse.suggestedUsername,
            },
          })
          sessionStorage.removeItem('oauth_mode')
          sessionStorage.removeItem('oauth_return_url')
        }
      } catch (error) {
        console.error('GitHub OAuth error:', error)
        toast({
          title: 'Authentication Failed',
          description: error.response?.data?.message || 'Failed to authenticate with GitHub. Please try again.',
          variant: 'destructive',
          duration: 5000,
        })
        sessionStorage.removeItem('oauth_mode')
        sessionStorage.removeItem('oauth_return_url')
        navigate('/login')
      }
    }

    handleGitHubCallback()
  }, [searchParams, navigate, toast])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Processing GitHub Login</CardTitle>
          <CardDescription>Please wait while we complete your authentication...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  )
}

export default GitHubCallbackPage