import { supabase } from './supabaseClient'

function mapProfile(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    avatar: row.avatar_url
  }
}

function mapConversationRow(row) {
  if (!row) return null
  const buyer = mapProfile(row.buyer)
  const seller = mapProfile(row.seller)
  return {
    id: row.id,
    buyerId: row.buyer_id,
    sellerId: row.seller_id,
    productId: row.product_id,
    createdAt: row.created_at,
    buyer,
    seller
  }
}

function mapMessageRow(m) {
  if (!m) return null
  return {
    id: m.id,
    senderId: m.sender_id,
    text: m.text,
    createdAt: m.created_at
  }
}

export async function getConversations(userId) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*, buyer:profiles!conversations_buyer_id_fkey(id, name, city, avatar_url), seller:profiles!conversations_seller_id_fkey(id, name, city, avatar_url)')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []).map(mapConversationRow)
}

export async function getMessages(conversationId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data || []).map(mapMessageRow)
}

export async function sendMessage(conversationId, message) {
  const payload = {
    conversation_id: conversationId,
    sender_id: message.senderId,
    text: message.text
  }
  const { data, error } = await supabase
    .from('messages')
    .insert([payload])
    .select()
    .single()

  if (error) throw error
  return mapMessageRow(data)
}

export async function createConversation({ buyerId, sellerId, productId }) {
  const { data: existing, error: findError } = await supabase
    .from('conversations')
    .select('*')
    .eq('buyer_id', buyerId)
    .eq('seller_id', sellerId)
    .eq('product_id', productId)
    .maybeSingle()

  if (findError) throw findError
  if (existing) return existing.id

  const { data, error } = await supabase
    .from('conversations')
    .insert([{ buyer_id: buyerId, seller_id: sellerId, product_id: productId }])
    .select()
    .single()

  if (error) throw error
  return data.id
}