import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import * as authService from '../services/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        authService.getCurrentUser().then(setUser)
      } else {
        setUser(null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function login(email, password) {
    await authService.login(email, password)
    const profile = await authService.getCurrentUser()
    setUser(profile)
  }

  async function register(payload) {
    await authService.register(payload)
    const profile = await authService.getCurrentUser()
    setUser(profile)
  }

  async function logout() {
    await authService.logout()
    setUser(null)
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