import { supabase } from './supabaseClient'

export async function uploadImage(file) {
  // Sanitize : supprime accents + tous caractères non alphanumériques sauf tiret et point
  const safeName = file.name
    .normalize('NFD')                        // décompose les accents (é → e + ́)
    .replace(/[\u0300-\u036f]/g, '')         // supprime les diacritiques
    .replace(/[^a-zA-Z0-9._-]/g, '_')       // remplace tout caractère spécial par _
    .replace(/_+/g, '_')                     // évite les __ consécutifs
    .toLowerCase()

  const fileName = `${Date.now()}_${safeName}`
  const path = `uploads/${fileName}`

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(path, file)

  if (error) throw error
  return data?.path || path
}

export function getPublicUrl(path) {
  // getPublicUrl is synchronous in Supabase JS v2
  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data?.publicUrl || null
}
