import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'
import { useDebounce } from '@/hooks/useDebounce'
import { usersAPI } from '@/api/users'
import { Eye, EyeOff, Check, X, Loader2 } from 'lucide-react'

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
  
  // Username availability check states
  const [usernameAvailable, setUsernameAvailable] = useState(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  // Debounce username input
  const debouncedUsername = useDebounce(formData.username, 500)

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      if (debouncedUsername && debouncedUsername.length >= 3) {
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
  }, [debouncedUsername])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      })
      return
    }

    if (usernameAvailable === false) {
      toast({
        title: "Error",
        description: "Username is already taken",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password
    })
    
    if (result.success) {
      toast({
        title: "Success",
        description: "Account created successfully!",
      })
      navigate('/')
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      })
    }
    
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Join Folio and showcase your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field with Availability Check */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  minLength={3}
                  className={
                    formData.username.length >= 3
                      ? usernameAvailable === true
                        ? 'border-green-500 focus-visible:ring-green-500'
                        : usernameAvailable === false
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : ''
                      : ''
                  }
                />
                {formData.username.length >= 3 && (
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
              </div>
              {formData.username.length >= 3 && usernameAvailable === false && (
                <p className="text-xs text-red-500">Username is already taken</p>
              )}
              {formData.username.length >= 3 && usernameAvailable === true && (
                <p className="text-xs text-green-500">Username is available</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {/* Password Field with Visibility Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="pr-10"
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
              <p className="text-xs text-muted-foreground">At least 6 characters</p>
            </div>

            {/* Confirm Password Field with Visibility Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="pr-10"
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
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading || checkingUsername || usernameAvailable === false}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>

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