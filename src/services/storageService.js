// Storage service stubs. Replace TODOs with Supabase storage APIs.

export async function uploadImage(file) {
  // TODO: Use `supabase.storage.from('images').upload(path, file)` and return public URL
  // For mock, return a placeholder URL
  return Promise.resolve('https://via.placeholder.com/800x600?text=Uploaded')
}

export async function getPublicUrl(path) {
  // TODO: Use `supabase.storage.from('images').getPublicUrl(path)`
  return Promise.resolve(`https://via.placeholder.com/800x600?text=${encodeURIComponent(path)}`)
}
