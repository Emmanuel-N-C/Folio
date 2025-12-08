import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { authAPI } from '@/api/auth'
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, X, Check } from 'lucide-react'

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [touched, setTouched] = useState({
    newPassword: false,
    confirmPassword: false
  })
  
  const navigate = useNavigate()
  const { toast } = useToast()

  // Remove token from URL immediately after reading it
  useEffect(() => {
    if (token) {
      // Store token in sessionStorage (more secure than URL)
      sessionStorage.setItem('resetToken', token)
      // Remove token from URL
      window.history.replaceState({}, document.title, '/reset-password')
    }
  }, [token])

  // Get token from sessionStorage instead of URL
  const getToken = () => {
    return sessionStorage.getItem('resetToken')
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
      errors.push('One special character')
    }
    
    return errors
  }

  const passwordErrors = validatePassword(formData.newPassword)

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const resetToken = getToken()

    if (!resetToken) {
      toast({
        title: "Invalid Link",
        description: "Reset token is missing or expired. Please request a new password reset.",
        variant: "destructive"
      })
      navigate('/forgot-password')
      return
    }

    setTouched({
      newPassword: true,
      confirmPassword: true
    })

    const errors = validatePassword(formData.newPassword)

    if (errors.length > 0) {
      toast({
        title: "Invalid Password",
        description: `Password must have: ${errors.join(', ')}`,
        variant: "destructive"
      })
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.resetPassword({
        token: resetToken,
        newPassword: formData.newPassword
      })

      // Clear token from sessionStorage
      sessionStorage.removeItem('resetToken')

      setResetSuccess(true)
      
      toast({
        title: "Password Reset! ✅",
        description: response.message || "Your password has been reset successfully",
      })

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)
      
    } catch (error) {
      // Clear token if it's invalid/expired
      sessionStorage.removeItem('resetToken')
      
      toast({
        title: "Reset Failed",
        description: error.response?.data?.message || "Invalid or expired reset token",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getPasswordInputClass = () => {
    if (!touched.newPassword || !formData.newPassword) return ''
    return passwordErrors.length > 0 ? 'border-red-500 focus-visible:ring-red-500' : 'border-green-500 focus-visible:ring-green-500'
  }

  const getConfirmPasswordInputClass = () => {
    if (!touched.confirmPassword || !formData.confirmPassword) return ''
    return formData.newPassword !== formData.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : 'border-green-500 focus-visible:ring-green-500'
  }

  if (!token && !getToken()) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Invalid Reset Link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => navigate('/forgot-password')}
            >
              Request New Reset Link
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (resetSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Password Reset!</CardTitle>
            <CardDescription>
              Your password has been reset successfully. Redirecting to login...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  onBlur={() => handleBlur('newPassword')}
                  className={`pr-10 ${getPasswordInputClass()}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Password Requirements */}
              {touched.newPassword && formData.newPassword && passwordErrors.length > 0 && (
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
              
              {touched.newPassword && formData.newPassword && passwordErrors.length === 0 && (
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Password meets all requirements
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
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
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {touched.confirmPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <X className="h-3 w-3" />
                  Passwords do not match
                </p>
              )}
              {touched.confirmPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Passwords match
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || passwordErrors.length > 0 || formData.newPassword !== formData.confirmPassword}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              <Link to="/login" className="text-primary hover:underline">
                Back to Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPasswordPage