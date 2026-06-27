import { supabase } from './supabaseClient'

/**
 * Nettoie un nom de fichier : supprime accents et caractères spéciaux.
 */
function sanitizeFileName(name) {
  return name
    .normalize('NFD')                     // décompose les accents (é → e + ́)
    .replace(/[\u0300-\u036f]/g, '')      // supprime les diacritiques
    .replace(/[^a-zA-Z0-9._-]/g, '_')    // remplace tout caractère spécial par _
    .replace(/_+/g, '_')                  // évite les __ consécutifs
    .toLowerCase()
}

// ─── Product Images ───────────────────────────────────────────────────────────

export async function uploadImage(file) {
  const safeName = sanitizeFileName(file.name)
  const fileName = `${Date.now()}_${safeName}`
  const path = `uploads/${fileName}`

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(path, file)

  if (error) throw error
  return data?.path || path
}

export function getPublicUrl(path) {
  // getPublicUrl est synchrone en Supabase JS v2
  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data?.publicUrl || null
}

// ─── Avatars ──────────────────────────────────────────────────────────────────

/**
 * Upload un fichier avatar dans le bucket `avatars`.
 * Le path est `{user.id}/{filename}` pour correspondre à la RLS :
 * "(storage.foldername(name))[1] = auth.uid()"
 * Retourne le chemin de stockage (ex: "abc-123/1234567890_photo.jpg").
 */
export async function uploadAvatar(file, userId) {
  if (!userId) throw new Error('userId requis pour uploader un avatar')

  const safeName = sanitizeFileName(file.name)
  const fileName = `${Date.now()}_${safeName}`
  const path = `${userId}/${fileName}`

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })

  if (error) throw error
  return data?.path || path
}

/**
 * Récupère l'URL publique d'un avatar depuis le bucket `avatars`.
 */
export function getAvatarUrl(path) {
  if (!path) return null
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return data?.publicUrl || null
}
