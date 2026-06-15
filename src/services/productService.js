import { products } from '../utils/mockData'

// Product service stubs. Replace TODOs with Supabase queries.

export async function getProducts() {
  // TODO: Replace with `supabase.from('products').select('*')`
  return Promise.resolve(products)
}

export async function getProductById(id) {
  // TODO: Replace with `supabase.from('products').select('*').eq('id', id).single()`
  return Promise.resolve(products.find(p => p.id === id) || null)
}

export async function createProduct(payload) {
  // TODO: Replace with `supabase.from('products').insert([payload])`
  const newProduct = { ...payload, id: `p${Date.now()}` }
  return Promise.resolve(newProduct)
}

export async function deleteProduct(id) {
  // TODO: Replace with `supabase.from('products').delete().eq('id', id)`
  return Promise.resolve(true)
}
