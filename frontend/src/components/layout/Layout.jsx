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
    <div className="min-h-screen flex">
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
              className="w-10 h-10 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors duration-100"
            >
              {rightSidebarOpen ? (
                <PanelRightClose size={20} strokeWidth={1.5} />
              ) : (
                <PanelRightOpen size={20} strokeWidth={1.5} />
              )}
            </Button>
          </div>

          <div className="container max-w-4xl mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t-2 border-black py-6 text-center text-sm text-muted-foreground bg-white">
          <p className="font-mono">© 2025 Folio. Built with ❤️ for developers.</p>
        </footer>
      </div>

      {/* Right Sidebar - Toggleable */}
      {rightSidebarOpen && <RightSidebar />}
    </div>
  )
}

export default Layout