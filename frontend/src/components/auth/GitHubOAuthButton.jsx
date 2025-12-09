import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Github } from 'lucide-react'

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID
const REDIRECT_URI = `${window.location.origin}/auth/github/callback`

const GitHubOAuthButton = ({ mode = 'login' }) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleGitHubLogin = () => {
    // Check if GitHub Client ID is configured
    if (!GITHUB_CLIENT_ID) {
      toast({
        title: 'Configuration Error',
        description: 'GitHub OAuth is not configured. Please set VITE_GITHUB_CLIENT_ID in your .env file.',
        variant: 'destructive',
        duration: 5000,
      })
      console.error('VITE_GITHUB_CLIENT_ID is not set in environment variables')
      return
    }

    setLoading(true)
    
    // Store the mode (login or register) to use in callback
    sessionStorage.setItem('oauth_mode', mode)
    sessionStorage.setItem('oauth_return_url', window.location.pathname)
    
    // Redirect to GitHub OAuth
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user:email read:user`
    
    console.log('Redirecting to GitHub OAuth:', githubAuthUrl)
    window.location.href = githubAuthUrl
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGitHubLogin}
      disabled={loading || !GITHUB_CLIENT_ID}
      className="w-full"
    >
      <Github className="mr-2 h-4 w-4" />
      {loading ? 'Connecting...' : mode === 'register' ? 'Sign up with GitHub' : 'Continue with GitHub'}
    </Button>
  )
}

export default GitHubOAuthButton