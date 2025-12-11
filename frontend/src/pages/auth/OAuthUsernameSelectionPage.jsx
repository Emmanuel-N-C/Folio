import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/use-toast'
import { useDebounce } from '@/hooks/useDebounce'
import { useAuth } from '@/hooks/useAuth'
import { authAPI } from '@/api/auth'
import { Check, X, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'

const OAuthUsernameSelectionPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { updateUser, refreshUserProfile } = useAuth()  

  const { token, provider, email, name, profileImageUrl, suggestedUsername } = location.state || {}

  const [username, setUsername] = useState(suggestedUsername || '')
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [usernameError, setUsernameError] = useState('')

  const debouncedUsername = useDebounce(username, 500)

  // Redirect if no OAuth token
  useEffect(() => {
    if (!token || !provider) {
      toast({
        title: 'Invalid Access',
        description: 'Please start the OAuth flow from the login page.',
        variant: 'destructive',
      })
      navigate('/login')
    }
  }, [token, provider, navigate, toast])

  // Validate username format
  const validateUsername = (value) => {
    if (!value) return 'Username is required'

    if (value.length < 3) {
      return 'Username must be at least 3 characters'
    }
    if (value.length > 20) {
      return 'Username must be at most 20 characters'
    }
    if (value.includes(' ')) {
      return 'Username cannot contain spaces'
    }

    // Must start with a letter
    if (!/^[a-zA-Z]/.test(value)) {
      return 'Username must start with a letter'
    }

    // Must end with a letter or number
    if (!/[a-zA-Z0-9]$/.test(value)) {
      return 'Username must end with a letter or number'
    }

    // Can only contain letters, numbers, dots, underscores, hyphens
    if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
      return 'Username can only contain letters, numbers, dots (.), underscores (_), and hyphens (-)'
    }

    // Check for consecutive special characters
    if (/[._-]{2,}/.test(value)) {
      return 'Username cannot have consecutive special characters'
    }

    return ''
  }

  // Handle username change
  const handleUsernameChange = (e) => {
    const value = e.target.value.toLowerCase()
    setUsername(value)

    if (touched) {
      const error = validateUsername(value)
      setUsernameError(error)

      if (error) {
        setUsernameAvailable(null)
      }
    }
  }

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      if (debouncedUsername && debouncedUsername.length >= 3 && !usernameError) {
        setCheckingUsername(true)
        try {
          const response = await authAPI.checkUsernameAvailability(debouncedUsername)
          setUsernameAvailable(response.available)
        } catch (error) {
          console.error('Error checking username:', error)
          setUsernameAvailable(null)
        } finally {
          setCheckingUsername(false)
        }
      } else {
        setUsernameAvailable(null)
      }
    }

    checkUsername()
  }, [debouncedUsername, usernameError])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)

    const error = validateUsername(username)
    if (error) {
      setUsernameError(error)
      toast({
        title: 'Invalid Username',
        description: error,
        variant: 'destructive',
      })
      return
    }

    if (usernameAvailable === false) {
      toast({
        title: 'Username Taken',
        description: 'This username is already taken. Please choose another.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.registerOAuthUser({
        token,
        provider,
        username: username.toLowerCase(),
      })

      
      localStorage.setItem('token', response.token)
      
     
      const userData = {
        id: response.userId,
        username: response.username,
      }
      localStorage.setItem('user', JSON.stringify(userData))

      toast({
        title: 'Welcome to Folio!',
        description: 'Your account has been created successfully.',
        duration: 4000,
      })

     
      window.location.href = '/feed' 
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to complete registration. Please try again.'
      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle back/cancel action
  const handleCancel = () => {
    // Clear any stored OAuth data
    sessionStorage.removeItem('oauth_mode')
    sessionStorage.removeItem('oauth_return_url')
    
    toast({
      title: 'Registration Cancelled',
      description: 'You can try again anytime.',
      duration: 3000,
    })
    
    navigate('/register')
  }

  // Determine input styling
  const getUsernameInputClass = () => {
    if (!touched || !username) return ''
    if (usernameError) return 'border-red-500 focus-visible:ring-red-500'
    if (usernameAvailable === true) return 'border-green-500 focus-visible:ring-green-500'
    if (usernameAvailable === false) return 'border-red-500 focus-visible:ring-red-500'
    return ''
  }

  const isFormValid = () => {
    return username && !usernameError && usernameAvailable === true
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Back button above card */}
        <Button
          variant="ghost"
          onClick={handleCancel}
          disabled={loading}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Choose Your Username</CardTitle>
            <CardDescription>Complete your profile to get started</CardDescription>
          </CardHeader>
          <CardContent>
            {/* User Info Display */}
            <div className="flex items-center gap-4 p-4 mb-6 bg-muted rounded-lg">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profileImageUrl} alt={name} />
                <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={handleUsernameChange}
                    onBlur={() => setTouched(true)}
                    minLength={3}
                    maxLength={20}
                    className={getUsernameInputClass()}
                    autoFocus
                  />
                  {touched && username.length >= 3 && !usernameError && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {checkingUsername ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : usernameAvailable === true ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : usernameAvailable === false ? (
                        <X className="h-4 w-4 text-red-500" />
                      ) : null}
                    </div>
                  )}
                  {touched && usernameError && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    </div>
                  )}
                </div>

                {/* Error/Success Messages */}
                {touched && usernameError && (
                  <p className="text-xs text-red-500">{usernameError}</p>
                )}
                {touched && !usernameError && username.length >= 3 && usernameAvailable === false && (
                  <p className="text-xs text-red-500">Username is already taken</p>
                )}
                {touched && !usernameError && username.length >= 3 && usernameAvailable === true && (
                  <p className="text-xs text-green-500">Username is available</p>
                )}

                <p className="text-xs text-muted-foreground">
                  Your username must be 3-20 characters, start with a letter, and can contain letters, numbers, dots, underscores, and hyphens.
                </p>
              </div>

              {/* CHANGE THIS: Single button, full width */}
              <Button
                type="submit"
                className="w-full"
                disabled={!isFormValid() || loading || checkingUsername}
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OAuthUsernameSelectionPage