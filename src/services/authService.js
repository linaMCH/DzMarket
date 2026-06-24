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
  // mappe avatar_url → avatar pour le UI
  if (profile) return { ...profile, avatar: profile.avatar_url }
  // Si aucun profil n'existe encore, retourne un objet minimal
  return { id: user.id, email: user.email, name: null, avatar: null }
}

/**
 * Met à jour le profil de l'utilisateur connecté dans la table `profiles`.
 * @param {Object} fields - Champs à mettre à jour : { avatarPath, name, city, ... }
 */
export async function updateProfile({ avatarPath, ...fields }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const updates = { ...fields }
  if (avatarPath !== undefined) {
    updates.avatar_url = avatarPath
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select('*')
    .single()

  if (error) throw error
  return { ...data, avatar: data.avatar_url }
}