import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import RightSidebar from './RightSidebar'
import { Button } from '@/components/ui/button'
import { PanelRightClose, PanelRightOpen } from 'lucide-react'

const Layout = () => {
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar (mobile only) */}
        <div className="lg:hidden">
          <Navbar />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative">
          {/* Toggle Button for Right Sidebar */}
          <div className="hidden xl:block fixed top-4 right-4 z-40">
            <Button
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
              variant="outline"
              size="icon"
              className="w-10 h-10 rounded-lg bg-white border-gray-300 shadow-sm hover:shadow-md transition-all"
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
        <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-600 bg-white">
          <p>© 2025 Folio. Built with care for developers.</p>
        </footer>
      </div>

      {/* Right Sidebar - Toggleable */}
      {rightSidebarOpen && <RightSidebar />}
    </div>
  )
}

export default Layout