import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { authAPI } from '@/api/auth'
import { Mail, Loader2, CheckCircle2 } from 'lucide-react'

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const emailFromUrl = searchParams.get('email')
  
  const [formData, setFormData] = useState({
    email: emailFromUrl || '',
    code: ''
  })
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [verified, setVerified] = useState(false)
  const [countdown, setCountdown] = useState(0)
  
  const navigate = useNavigate()
  const { toast } = useToast()

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerify = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.code) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and verification code",
        variant: "destructive"
      })
      return
    }

    if (formData.code.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Verification code must be 6 digits",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.verifyEmail({
        email: formData.email.toLowerCase(),
        code: formData.code
      })

      setVerified(true)
      
      toast({
        title: "Email Verified!",
        description: response.message || "Your email has been verified successfully",
      })

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)
      
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error.response?.data?.message || "Invalid or expired verification code",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!formData.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      })
      return
    }

    setResending(true)

    try {
      const response = await authAPI.resendVerification({
        email: formData.email.toLowerCase()
      })

      toast({
        title: "Code Sent!",
        description: response.message || "A new verification code has been sent to your email",
      })

      setCountdown(60) // 60 second cooldown
      
    } catch (error) {
      toast({
        title: "Failed to Resend",
        description: error.response?.data?.message || "Could not resend verification code",
        variant: "destructive"
      })
    } finally {
      setResending(false)
    }
  }

  const handleCodeInput = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setFormData({ ...formData, code: value })
  }

  if (verified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Email Verified!</CardTitle>
            <CardDescription>
              Your account has been verified successfully. Redirecting to login...
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
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email address
          </CardDescription>
           <span className="mt-2 block text-xs text-muted-foreground">
            Didn’t receive the email? Please check your spam or junk folder.
          </span>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })}
                disabled={!!emailFromUrl}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Verification Code</label>
              <Input
                type="text"
                placeholder="000000"
                value={formData.code}
                onChange={handleCodeInput}
                maxLength={6}
                className="text-center text-2xl tracking-widest font-mono"
              />
              <p className="text-xs text-muted-foreground text-center">
                Enter the 6-digit code from your email
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || formData.code.length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleResend}
                disabled={resending || countdown > 0}
                className="w-full"
              >
                {resending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  'Resend Code'
                )}
              </Button>
            </div>

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

export default VerifyEmailPage