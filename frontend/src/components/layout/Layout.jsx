import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import RightSidebar from './RightSidebar'
import { Button } from '@/components/ui/button'
import { PanelRightClose, PanelRightOpen } from 'lucide-react'

const Layout = () => {
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!leftSidebarOpen)
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Sidebar - Desktop always visible, Mobile toggleable */}
      <Sidebar 
        isOpen={leftSidebarOpen} 
        onClose={() => setLeftSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar (mobile only) */}
        <div className="lg:hidden">
          <Navbar 
            onMenuClick={toggleLeftSidebar} 
            isSidebarOpen={leftSidebarOpen}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative">
          {/* Toggle Button for Right Sidebar */}
          <div className="hidden xl:block fixed top-4 right-4 z-40">
            <Button
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
              variant="outline"
              size="icon"
              className="w-10 h-10 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              {rightSidebarOpen ? (
                <PanelRightClose size={18} strokeWidth={2} />
              ) : (
                <PanelRightOpen size={18} strokeWidth={2} />
              )}
            </Button>
          </div>

          <div className="container max-w-4xl mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t py-6 text-center text-sm text-muted-foreground bg-card">
          <p>© 2025 Folio.</p>
        </footer>
      </div>

      {/* Right Sidebar - Toggleable */}
      {rightSidebarOpen && <RightSidebar />}
      
      {/* Mobile Overlay */}
      {leftSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setLeftSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout