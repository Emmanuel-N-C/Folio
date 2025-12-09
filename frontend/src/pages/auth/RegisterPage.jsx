import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useDebounce } from '@/hooks/useDebounce'
import { usersAPI } from '@/api/users'
import { authAPI } from '@/api/auth'
import { Eye, EyeOff, Check, X, Loader2, AlertCircle, Github } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Field touched states
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  })
  
  // Username availability check states
  const [usernameAvailable, setUsernameAvailable] = useState(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [usernameError, setUsernameError] = useState('')
  
  // Email availability check states
  const [emailAvailable, setEmailAvailable] = useState(null)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [emailError, setEmailError] = useState('')
  
  // Password validation states
  const [passwordErrors, setPasswordErrors] = useState([])
  
  const navigate = useNavigate()
  const { toast } = useToast()
  
  // Debounce username and email inputs
  const debouncedUsername = useDebounce(formData.username, 500)
  const debouncedEmail = useDebounce(formData.email, 500)

  // Validate username format
  const validateUsername = (username) => {
    if (!username) return 'Username is required'
    
    if (username.length < 3) {
      return 'Username must be at least 3 characters'
    }
    if (username.length > 20) {
      return 'Username must be at most 20 characters'
    }
    if (username.includes(' ')) {
      return 'Username cannot contain spaces'
    }
    
    // Must start with a letter
    if (!/^[a-zA-Z]/.test(username)) {
      return 'Username must start with a letter'
    }
    
    // Must end with a letter or number
    if (!/[a-zA-Z0-9]$/.test(username)) {
      return 'Username must end with a letter or number'
    }
    
    // Can only contain letters, numbers, dots, underscores, hyphens
    if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
      return 'Username can only contain letters, numbers, dots (.), underscores (_), and hyphens (-)'
    }
    
    // Check for consecutive special characters
    if (/[._-]{2,}/.test(username)) {
      return 'Username cannot have consecutive special characters'
    }
    
    return ''
  }

  // Validate password with detailed requirements
  const validatePassword = (password) => {
    const errors = []
    
    if (!password) {
      return ['Password is required']
    }
    
    if (password.length < 8) {
      errors.push('At least 8 characters')
    }
    if (!/[a-z]/.test(password)) {
      errors.push('One lowercase letter')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('One uppercase letter')
    }
    if (!/\d/.test(password)) {
      errors.push('One number')
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('One special character (!@#$%^&*...)')
    }
    
    return errors
  }

  // Validate email
  const validateEmail = (email) => {
    if (!email) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address'
    }
    return ''
  }

  // Handle username input change
  const handleUsernameChange = (e) => {
    const value = e.target.value
    setFormData({ ...formData, username: value })
    
    if (touched.username) {
      const error = validateUsername(value)
      setUsernameError(error)
      
      if (error) {
        setUsernameAvailable(null)
      }
    }
  }

  // Handle email input change
  const handleEmailChange = (e) => {
    const value = e.target.value.toLowerCase()
    setFormData({ ...formData, email: value })
    
    if (touched.email) {
      const error = validateEmail(value)
      setEmailError(error)
      
      if (error) {
        setEmailAvailable(null)
      }
    }
  }

  // Handle password input change
  const handlePasswordChange = (e) => {
    const value = e.target.value
    setFormData({ ...formData, password: value })
    
    if (touched.password) {
      const errors = validatePassword(value)
      setPasswordErrors(errors)
    }
  }

  // Handle field blur
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })
    
    if (field === 'username') {
      const error = validateUsername(formData.username)
      setUsernameError(error)
    } else if (field === 'email') {
      const error = validateEmail(formData.email)
      setEmailError(error)
    } else if (field === 'password') {
      const errors = validatePassword(formData.password)
      setPasswordErrors(errors)
    }
  }

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      if (debouncedUsername && debouncedUsername.length >= 3 && !usernameError) {
        setCheckingUsername(true)
        try {
          const response = await usersAPI.checkUsernameAvailability(debouncedUsername)
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

  // Check email availability
  useEffect(() => {
    const checkEmail = async () => {
      if (debouncedEmail && !emailError) {
        setCheckingEmail(true)
        try {
          const response = await usersAPI.checkEmailAvailability(debouncedEmail)
          setEmailAvailable(response.available)
        } catch (error) {
          console.error('Error checking email:', error)
          setEmailAvailable(null)
        } finally {
          setCheckingEmail(false)
        }
      } else {
        setEmailAvailable(null)
      }
    }

    checkEmail()
  }, [debouncedEmail, emailError])

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.username &&
      !usernameError &&
      usernameAvailable === true &&
      formData.email &&
      !emailError &&
      emailAvailable === true &&
      formData.password &&
      passwordErrors.length === 0 &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Mark all fields as touched
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true
    })

    // Validate all fields
    const usernameValidationError = validateUsername(formData.username)
    const emailValidationError = validateEmail(formData.email)
    const passwordValidationErrors = validatePassword(formData.password)

    if (usernameValidationError) {
      setUsernameError(usernameValidationError)
      toast({
        title: "Invalid Username",
        description: usernameValidationError,
        variant: "destructive"
      })
      return
    }

    if (emailValidationError) {
      setEmailError(emailValidationError)
      toast({
        title: "Invalid Email",
        description: emailValidationError,
        variant: "destructive"
      })
      return
    }

    if (passwordValidationErrors.length > 0) {
      toast({
        title: "Invalid Password",
        description: `Password must have: ${passwordValidationErrors.join(', ')}`,
        variant: "destructive"
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      })
      return
    }

    if (usernameAvailable === false) {
      toast({
        title: "Username Taken",
        description: "This username is already taken. Please choose another.",
        variant: "destructive"
      })
      return
    }

    if (emailAvailable === false) {
      toast({
        title: "Email Already Registered",
        description: "This email is already registered. Please use another email or try logging in.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email.toLowerCase(),
        password: formData.password
      })
      
      toast({
        title: "Registration Successful!",
        description: response.message || "Please check your email for verification code",
      })
      
      // Redirect to verification page with email
      navigate(`/verify-email?email=${encodeURIComponent(formData.email.toLowerCase())}`)
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again."
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      // If email already exists but not verified, redirect to verification
      if (errorMessage.includes("not verified")) {
        setTimeout(() => {
          navigate(`/verify-email?email=${encodeURIComponent(formData.email.toLowerCase())}`)
        }, 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  // Determine username input styling
  const getUsernameInputClass = () => {
    if (!touched.username || !formData.username) return ''
    if (usernameError) return 'border-red-500 focus-visible:ring-red-500'
    if (usernameAvailable === true) return 'border-green-500 focus-visible:ring-green-500'
    if (usernameAvailable === false) return 'border-red-500 focus-visible:ring-red-500'
    return ''
  }

  // Determine email input styling
  const getEmailInputClass = () => {
    if (!touched.email || !formData.email) return ''
    if (emailError) return 'border-red-500 focus-visible:ring-red-500'
    if (emailAvailable === true) return 'border-green-500 focus-visible:ring-green-500'
    if (emailAvailable === false) return 'border-red-500 focus-visible:ring-red-500'
    return ''
  }

  // Determine password input styling
  const getPasswordInputClass = () => {
    if (!touched.password || !formData.password) return ''
    return passwordErrors.length > 0 ? 'border-red-500 focus-visible:ring-red-500' : 'border-green-500 focus-visible:ring-green-500'
  }

  // Determine confirm password input styling
  const getConfirmPasswordInputClass = () => {
    if (!touched.confirmPassword || !formData.confirmPassword) return ''
    return formData.password !== formData.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : 'border-green-500 focus-visible:ring-green-500'
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Join Folio and showcase your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="username"
                  value={formData.username}
                  onChange={handleUsernameChange}
                  onBlur={() => handleBlur('username')}
                  minLength={3}
                  maxLength={20}
                  className={getUsernameInputClass()}
                />
                {touched.username && formData.username.length >= 3 && !usernameError && (
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
                {touched.username && usernameError && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  </div>
                )}
              </div>
              
              {/* Error/Success Messages */}
              {touched.username && usernameError && (
                <p className="text-xs text-red-500">{usernameError}</p>
              )}
              {touched.username && !usernameError && formData.username.length >= 3 && usernameAvailable === false && (
                <p className="text-xs text-red-500">Username is already taken</p>
              )}
              {touched.username && !usernameError && formData.username.length >= 3 && usernameAvailable === true && (
                <p className="text-xs text-green-500">Username is available</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur('email')}
                  className={getEmailInputClass()}
                />
                {touched.email && formData.email && !emailError && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {checkingEmail ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : emailAvailable === true ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : emailAvailable === false ? (
                      <X className="h-4 w-4 text-red-500" />
                    ) : null}
                  </div>
                )}
                {touched.email && emailError && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  </div>
                )}
              </div>
              
              {/* Error/Success Messages */}
              {touched.email && emailError && (
                <p className="text-xs text-red-500">{emailError}</p>
              )}
              {touched.email && !emailError && formData.email && emailAvailable === false && (
                <p className="text-xs text-red-500">Email is already registered</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  onBlur={() => handleBlur('password')}
                  minLength={8}
                  className={`pr-10 ${getPasswordInputClass()}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              {/* Password Requirements */}
              {touched.password && formData.password && passwordErrors.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Password must have:</p>
                  <ul className="text-xs space-y-0.5">
                    {passwordErrors.map((error, index) => (
                      <li key={index} className="text-red-500 flex items-center gap-1">
                        <X className="h-3 w-3" />
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {touched.password && formData.password && passwordErrors.length === 0 && (
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Password meets all requirements
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`pr-10 ${getConfirmPasswordInputClass()}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {touched.confirmPassword && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <X className="h-3 w-3" />
                  Passwords do not match
                </p>
              )}
              {touched.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Passwords match
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!isFormValid() || loading || checkingUsername || checkingEmail}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${BACKEND_URL}/api/auth/oauth2/callback/google&response_type=code&scope=profile email`
                }}
                className="w-full"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  window.location.href = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${BACKEND_URL}/api/auth/oauth2/callback/github&scope=user:email read:user`
                }}
                className="w-full"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPage