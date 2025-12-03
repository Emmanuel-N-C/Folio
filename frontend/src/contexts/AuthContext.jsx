import { createContext, useState, useEffect } from 'react'
import { authAPI } from '@/api/auth'
import { usersAPI } from '@/api/users'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      // Refresh user profile to get latest data including profile image
      refreshUserProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const refreshUserProfile = async () => {
    try {
      const profileData = await usersAPI.getCurrentUserProfile()
      const updatedUser = { ...profileData, userId: profileData.id }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    } catch (error) {
      console.error('Failed to refresh user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      const { token: newToken, userId, ...userData } = response

      setToken(newToken)
      localStorage.setItem('token', newToken)

      // Fetch full profile data including profileImageUrl
      try {
        const profileData = await usersAPI.getCurrentUserProfile()
        const normalizedUser = { 
          ...profileData,
          id: profileData.id,
          userId: profileData.id,
        }
        setUser(normalizedUser)
        localStorage.setItem('user', JSON.stringify(normalizedUser))
      } catch (profileError) {
        // Fallback to basic user data if profile fetch fails
        const normalizedUser = { 
          id: userId,
          userId: userId,
          ...userData 
        }
        setUser(normalizedUser)
        localStorage.setItem('user', JSON.stringify(normalizedUser))
      }

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const register = async (data) => {
    try {
      const response = await authAPI.register(data)
      const { token: newToken, userId, ...userData } = response

      setToken(newToken)
      localStorage.setItem('token', newToken)

      // Fetch full profile data including profileImageUrl
      try {
        const profileData = await usersAPI.getCurrentUserProfile()
        const normalizedUser = { 
          ...profileData,
          id: profileData.id,
          userId: profileData.id,
        }
        setUser(normalizedUser)
        localStorage.setItem('user', JSON.stringify(normalizedUser))
      } catch (profileError) {
        // Fallback to basic user data if profile fetch fails
        const normalizedUser = { 
          id: userId,
          userId: userId,
          ...userData 
        }
        setUser(normalizedUser)
        localStorage.setItem('user', JSON.stringify(normalizedUser))
      }

      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const isAdmin = () => {
    return user?.roles?.includes('ROLE_ADMIN') || false
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUserProfile,
    isAuthenticated: !!token,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}