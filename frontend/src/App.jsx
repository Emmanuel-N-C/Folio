import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'
import OAuthCallbackPage from '@/pages/auth/OAuthCallbackPage'
import GitHubCallbackPage from '@/pages/auth/GitHubCallbackPage'
import OAuthUsernameSelectionPage from '@/pages/auth/OAuthUsernameSelectionPage'
import OAuthErrorPage from '@/pages/auth/OAuthErrorPage'

// Feed Pages
import FeedPage from '@/pages/feed/FeedPage'
import TrendingPage from '@/pages/feed/TrendingPage'

// Post Pages
import PostDetailPage from '@/pages/post/PostDetailPage'
import CreatePostPage from '@/pages/post/CreatePostPage'
import EditPostPage from '@/pages/post/EditPostPage'
import SearchPage from '@/pages/post/SearchPage'
import UploadScreenshotsPage from '@/pages/post/UploadScreenshotsPage'

// Profile Pages
import ProfilePage from '@/pages/profile/ProfilePage'

// Settings Pages
import SettingsPage from '@/pages/settings/SettingsPage'

// Notification Page
import NotificationsPage from '@/pages/Notification/NotificationsPage'

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard'

// Common Pages
import NotFound from '@/components/common/NotFound'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Auth Routes - WITHOUT Layout (no sidebars) */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="verify-email" element={<VerifyEmailPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="auth/oauth/callback" element={<OAuthCallbackPage />} />
            <Route path="auth/github/callback" element={<GitHubCallbackPage />} />
            <Route path="auth/oauth/username-selection" element={<OAuthUsernameSelectionPage />} />
            <Route path="auth/oauth/error" element={<OAuthErrorPage />} />

            {/* All other routes - WITH Layout (with sidebars) */}
            <Route path="/" element={<Layout />}>
              {/* Public Routes */}
              <Route index element={<Navigate to="/feed" replace />} />
              <Route path="feed" element={<FeedPage />} />
              <Route path="trending" element={<TrendingPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="posts/:postId" element={<PostDetailPage />} />
              <Route path="profile/:userId" element={<ProfilePage />} />
              <Route path="/posts/:postId/upload-screenshots" element={<UploadScreenshotsPage />} />

              {/* Protected Routes */}
              <Route
                path="notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="posts/create"
                element={
                  <ProtectedRoute>
                    <CreatePostPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="posts/:postId/edit"
                element={
                  <ProtectedRoute>
                    <EditPostPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App