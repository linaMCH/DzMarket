import { conversations } from '../utils/mockData'

// Message service stubs. Replace TODOs with Supabase realtime / RPC calls.

export async function getConversations(userId) {
  // TODO: Replace with query to fetch conversations for `userId` from DB
  return Promise.resolve(conversations)
}

export async function getMessages(conversationId) {
  // TODO: Replace with `supabase.from('messages').select('*').eq('conversation_id', conversationId)`
  const conv = conversations.find(c => c.id === conversationId)
  return Promise.resolve(conv ? conv.messages : [])
}

export async function sendMessage(conversationId, message) {
  // TODO: Replace with inserting a message and broadcasting via realtime
  return Promise.resolve({ ...message, id: `m${Date.now()}` })
}
