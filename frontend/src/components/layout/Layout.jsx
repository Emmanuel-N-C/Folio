import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import RightSidebar from './RightSidebar'

const Layout = () => {
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
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-4xl mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t py-6 text-center text-sm text-muted-foreground bg-background/95">
          <p>© 2025 Folio. Built with ❤️ for developers.</p>
        </footer>
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  )
}

export default Layout