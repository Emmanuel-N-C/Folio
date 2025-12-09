import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'
import { Eye, EyeOff, AlertCircle, Github } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [touched, setTouched] = useState({
    usernameOrEmail: false,
    password: false
  })
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const validateUsernameOrEmail = (value) => {
    if (!value) return 'Username or email is required'
    if (value.trim().length === 0) return 'Username or email cannot be empty'
    return ''
  }

  const validatePassword = (value) => {
    if (!value) return 'Password is required'
    if (value.length === 0) return 'Password cannot be empty'
    return ''
  }

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })
  }

  const isFormValid = () => {
    return (
      formData.usernameOrEmail.trim().length > 0 &&
      formData.password.length > 0
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setTouched({
      usernameOrEmail: true,
      password: true
    })

    const usernameOrEmailError = validateUsernameOrEmail(formData.usernameOrEmail)
    const passwordError = validatePassword(formData.password)

    if (usernameOrEmailError) {
      toast({
        title: "Invalid Input",
        description: usernameOrEmailError,
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    if (passwordError) {
      toast({
        title: "Invalid Input",
        description: passwordError,
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    setLoading(true)

    const result = await login(formData)
    
    if (result.success) {
      toast({
        title: "Welcome Back!",
        description: "You've successfully logged in.",
        duration: 4000,
      })
      navigate('/')
    } else {
      // Check if the error is about unverified account
      const errorMessage = result.error || "Invalid username/email or password. Please try again."
      
      if (errorMessage.includes("not verified") || errorMessage.includes("verification code has been sent")) {
        toast({
          title: "Account Not Verified",
          description: "A new verification code has been sent to your email. Redirecting to verification page...",
          variant: "destructive",
          duration: 4000,
        })
        
        // Redirect to verification page with email
        // Extract email from formData.usernameOrEmail (it might be username or email)
        const emailOrUsername = formData.usernameOrEmail.trim()
        setTimeout(() => {
          navigate(`/verify-email?email=${encodeURIComponent(emailOrUsername)}`)
        }, 2000)
      } else {
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
          duration: 6000,
        })
      }
    }
    
    setLoading(false)
  }

  const getUsernameOrEmailInputClass = () => {
    if (!touched.usernameOrEmail || !formData.usernameOrEmail) return ''
    const error = validateUsernameOrEmail(formData.usernameOrEmail)
    return error ? 'border-red-500 focus-visible:ring-red-500' : ''
  }

  const getPasswordInputClass = () => {
    if (!touched.password || !formData.password) return ''
    const error = validatePassword(formData.password)
    return error ? 'border-red-500 focus-visible:ring-red-500' : ''
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Login to your Folio account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <label className="text-sm font-medium">Username or Email</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="johndoe or john@example.com"
                  value={formData.usernameOrEmail}
                  onChange={(e) => setFormData({ ...formData, usernameOrEmail: e.target.value })}
                  onBlur={() => handleBlur('usernameOrEmail')}
                  className={getUsernameOrEmailInputClass()}
                  autoComplete="username"
                />
                {touched.usernameOrEmail && validateUsernameOrEmail(formData.usernameOrEmail) && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  </div>
                )}
              </div>
              {touched.usernameOrEmail && validateUsernameOrEmail(formData.usernameOrEmail) && (
                <p className="text-xs text-red-500">
                  {validateUsernameOrEmail(formData.usernameOrEmail)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onBlur={() => handleBlur('password')}
                  className={`pr-10 ${getPasswordInputClass()}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {touched.password && validatePassword(formData.password) && (
                <p className="text-xs text-red-500">
                  {validatePassword(formData.password)}
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-end">
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={!isFormValid() || loading}
            >
              {loading ? 'Logging in...' : 'Login'}
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
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage