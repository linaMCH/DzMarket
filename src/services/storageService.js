import { supabase } from './supabaseClient'

export async function uploadImage(file) {
  // uploads file to bucket 'product-images' and returns the storage path (string)
  const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
  const path = `uploads/${fileName}`
  const { data, error } = await supabase.storage.from('product-images').upload(path, file)
  if (error) throw error
  // Supabase returns { path } in data
  return data?.path || path
}

export function getPublicUrl(path) {
  // getPublicUrl is synchronous in Supabase JS v2
  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data?.publicUrl || null
}
