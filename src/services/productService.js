import { supabase } from './supabaseClient'
import { getPublicUrl } from './storageService'

function mapSeller(seller) {
  if (!seller) return null
  return {
    id: seller.id,
    name: seller.name,
    city: seller.city,
    // mappe avatar_url → avatar pour le UI
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
    // les chemins stockés en DB sont convertis en URLs publiques pour le UI
    images: imgs.map(p => getPublicUrl(p)),
    // mappe seller_id → sellerId
    sellerId: row.seller_id,
    city: row.city,
    isActive: row.is_active,
    createdAt: row.created_at,
    // mappe l'objet vendeur imbriqué et renomme avatar_url → avatar
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

/**
 * Met à jour un produit existant dans Supabase.
 * @param {string} id - Identifiant du produit
 * @param {Object} payload - Champs à mettre à jour : title, description, price, category, city
 */
export async function updateProduct(id, payload) {
  const { title, description, price, category, city } = payload

  const { data, error } = await supabase
    .from('products')
    .update({ title, description, price: Number(price), category, city })
    .eq('id', id)
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