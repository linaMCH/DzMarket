import { users } from '../utils/mockData'

// Auth service stubs. Replace TODOs with Supabase auth calls.

export async function login(email, password) {
  // TODO: Replace with `supabase.auth.signInWithPassword({ email, password })`
  // For now return first user as mock
  return Promise.resolve(users[0])
}

export async function register(payload) {
  // TODO: Replace with `supabase.auth.signUp({ email, password })` and user insert
  return Promise.resolve({ id: 'u_new', name: payload.name || payload.email })
}

export async function logout() {
  // TODO: Replace with `supabase.auth.signOut()`
  return Promise.resolve()
}

export async function getCurrentUser() {
  // TODO: Replace with `supabase.auth.getUser()` and profile fetch
  return Promise.resolve(null)
}
