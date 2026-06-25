import { supabase } from './supabaseClient'
import { getPublicUrl } from './storageService'

function mapSeller(seller) {
  if (!seller) return null
  return {
    id: seller.id,
    name: seller.name,
    city: seller.city,
    // map Supabase `avatar_url` to UI `avatar`
    avatar: seller.avatar_url
  }
}

function normalizeImages(images) {
  if (!images) return []
  if (Array.isArray(images)) return images
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images)
      return Array.isArray(parsed) ? parsed : [images]
    } catch (e) {
      return [images]
    }
  }
  return []
}

function mapProduct(row) {
  if (!row) return null
  const imgs = normalizeImages(row.images)
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    category: row.category,
    // images stored in DB are storage paths; convert to public URLs for the UI
    images: imgs.map(p => getPublicUrl(p)),
    // map snake_case seller_id to sellerId expected by UI
    sellerId: row.seller_id,
    city: row.city,
    isActive: row.is_active,
    createdAt: row.created_at,
    // map nested seller object and rename avatar_url -> avatar
    seller: mapSeller(row.seller)
  }
}

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, seller:profiles(id, name, city, avatar_url)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map(mapProduct)
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*, seller:profiles(id, name, city, avatar_url)')
    .eq('id', id)
    .single()

  if (error) throw error
  return mapProduct(data)
}

export async function createProduct(payload) {
  const { sellerId, ...rest } = payload

  const { data, error } = await supabase
    .from('products')
    .insert([{ ...rest, seller_id: sellerId }])
    .select('*, seller:profiles(id, name, city, avatar_url)')
    .single()

  if (error) throw error
  return mapProduct(data)
}

export async function deleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}
