import React, { createContext, useContext, useEffect, useState } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    authService.getCurrentUser().then(u => {
      if (mounted) setUser(u)
      setLoading(false)
    })
    return () => (mounted = false)
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    const u = await authService.login(email, password)
    setUser(u)
    setLoading(false)
    return u
  }

  const register = async (payload) => {
    setLoading(true)
    const u = await authService.register(payload)
    setUser(u)
    setLoading(false)
    return u
  }

  const logout = async () => {
    setLoading(true)
    await authService.logout()
    setUser(null)
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
