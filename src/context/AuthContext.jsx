import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'
import * as authService from '../services/authService'

const AuthContext = createContext()

/**
 * AuthProvider accepte deux callbacks optionnels pour découpler les notifications
 * des dépendances circulaires (AuthContext ↔ ToastContext).
 *   - onLoginSuccess(profile)  → appelé après un login réussi
 *   - onLogoutSuccess()        → appelé après un logout réussi
 */
export function AuthProvider({ children, onLoginSuccess, onLogoutSuccess }) {
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

  /**
   * Recharge le profil utilisateur depuis Supabase et met à jour le state.
   * Utilisé après modification du profil (avatar, nom, ville…).
   */
  const refreshUser = useCallback(async () => {
    const profile = await authService.getCurrentUser()
    setUser(profile)
    return profile
  }, [])

  async function login(email, password) {
    await authService.login(email, password)
    const profile = await authService.getCurrentUser()
    setUser(profile)
    onLoginSuccess && onLoginSuccess(profile)
  }

  async function register(payload) {
    await authService.register(payload)
    const profile = await authService.getCurrentUser()
    setUser(profile)
  }

  async function logout() {
    await authService.logout()
    setUser(null)
    onLogoutSuccess && onLogoutSuccess()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}