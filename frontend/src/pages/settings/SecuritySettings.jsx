import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'

const SecuritySettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>
          Manage your account security settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Lock className="h-16 w-16 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Password Management</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Password change functionality coming soon. You'll be able to update your password securely.
          </p>
          <Button disabled>Change Password</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default SecuritySettings