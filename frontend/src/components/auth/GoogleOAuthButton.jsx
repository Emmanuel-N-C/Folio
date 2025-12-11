import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { authAPI } from '@/api/auth'

const GoogleOAuthButton = ({ mode = 'login' }) => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential

      // Step 1: Check if user exists
      const checkResponse = await authAPI.checkOAuthUser({
        token: idToken,
        provider: 'google',
      })

      if (checkResponse.exists) {
        // User already exists
        if (mode === 'register') {
          // STRICT: Don't allow registration, show error
          toast({
            title: 'Account Already Exists',
            description: 'An account with this Google account already exists. Please use the login page instead.',
            variant: 'destructive',
            duration: 5000,
          })
          // Redirect to login page
          setTimeout(() => {
            navigate('/login')
          }, 2000)
          return
        }

        // Step 2a: Login existing user (only from login page)
        const loginResponse = await authAPI.loginOAuthUser({
          token: idToken,
          provider: 'google',
        })

        // Store token and user data
        localStorage.setItem('token', loginResponse.token)
        localStorage.setItem('user', JSON.stringify({
          id: loginResponse.userId,
          username: loginResponse.username,
        }))

        toast({
          title: 'Welcome Back!',
          description: 'You have successfully logged in with Google.',
          duration: 3000,
        })

        // Use a small delay to ensure token is stored before redirect
        setTimeout(() => {
          window.location.href = '/feed'
        }, 100)
      } else {
        // User doesn't exist
        if (mode === 'login') {
          // Show error that account doesn't exist
          toast({
            title: 'Account Not Found',
            description: 'No account found with this Google account. Please register first.',
            variant: 'destructive',
            duration: 5000,
          })
          // Redirect to register page
          setTimeout(() => {
            navigate('/register')
          }, 2000)
          return
        }

        // Step 2b: Redirect to username selection for new user (only from register page)
        navigate('/auth/oauth/username-selection', {
          state: {
            token: idToken,
            provider: 'google',
            email: checkResponse.email,
            name: checkResponse.name,
            profileImageUrl: checkResponse.profileImageUrl,
            suggestedUsername: checkResponse.suggestedUsername,
          },
        })
      }
    } catch (error) {
      console.error('Google OAuth error:', error)
      
      let errorMessage = 'Failed to authenticate with Google. Please try again.'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: 'Authentication Failed',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
      })
    }
  }

  const handleGoogleError = () => {
    toast({
      title: 'Authentication Failed',
      description: 'Google authentication was cancelled or failed.',
      variant: 'destructive',
      duration: 4000,
    })
  }

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleError}
      useOneTap={false}
      theme="outline"
      size="large"
      text={mode === 'register' ? 'signup_with' : 'continue_with'}
      shape="rectangular"
    />
  )
}

export default GoogleOAuthButton