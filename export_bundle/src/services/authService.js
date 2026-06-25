import { supabase } from './supabaseClient'

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user
}

export async function register({ name, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  })
  if (error) throw error
  return data.user
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  // map Supabase `avatar_url` to UI `avatar`
  if (profile) return { ...profile, avatar: profile.avatar_url }
  // If no profile row exists yet, return a minimal user object so UI knows user is authenticated
  return { id: user.id, email: user.email, name: null, avatar: null }
}
