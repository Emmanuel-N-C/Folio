import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { User, Image, Shield, AlertTriangle } from 'lucide-react'
import AccountSettings from './AccountSettings'
import ProfilePhotoSettings from './ProfilePhotoSettings'
import SecuritySettings from './SecuritySettings'
import DangerZoneSettings from './DangerZoneSettings'

const SettingsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'account')

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'photo', label: 'Profile Photo', icon: Image },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ]

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    navigate(`/settings?tab=${tabId}`, { replace: true })
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountSettings />
      case 'photo':
        return <ProfilePhotoSettings />
      case 'security':
        return <SecuritySettings />
      case 'danger':
        return <DangerZoneSettings />
      default:
        return <AccountSettings />
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar Navigation */}
        <Card className="md:col-span-1 h-fit">
          <nav className="p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isDanger = tab.id === 'danger'
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : isDanger
                      ? 'hover:bg-destructive/10 text-destructive'
                      : 'hover:bg-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </Card>

        {/* Right Content Area */}
        <div className="md:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage