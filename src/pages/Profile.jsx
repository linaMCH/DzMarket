import React, { useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../services/productService'
import { updateProfile } from '../services/authService'
import { uploadAvatar, getAvatarUrl } from '../services/storageService'
import { useToastContext } from '../context/ToastContext'
import ProductCard from '../components/ProductCard'

export default function Profile() {
  const { user, refreshUser } = useAuth()
  const { showToast } = useToastContext()

  const fileInputRef = useRef(null)
  // MODIFIÉ — avatarPreview stocke une URL affichable (blob: ou URL CDN), jamais un path brut
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  })

  const mine = products.filter(p => p.sellerId === user?.id)
  const profile = user

  // MODIFIÉ — Résolution correcte de l'URL publique au montage :
  // profile.avatar contient le path brut depuis profiles.avatar_url
  // → on doit toujours le passer par getAvatarUrl() pour obtenir l'URL CDN complète.
  // Priorité : aperçu local (blob:) > URL CDN résolue > placeholder
  const resolvedAvatarUrl = profile?.avatar ? getAvatarUrl(profile.avatar) : null
  const currentAvatar = avatarPreview
    || resolvedAvatarUrl
    || `https://placehold.co/128x128/e2e8f0/94a3b8?text=${encodeURIComponent(profile?.name || 'U')}`

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    // Aperçu immédiat avant l'upload (URL objet locale)
    const objectUrl = URL.createObjectURL(file)
    setAvatarPreview(objectUrl)

    setUploadingAvatar(true)
    try {
      // 1. Upload vers le bucket avatars (path: {user.id}/{filename})
      const path = await uploadAvatar(file, user.id)

      // MODIFIÉ — 2. Résolution de l'URL publique depuis le path retourné
      const publicUrl = getAvatarUrl(path)

      // 3. Persistance du path brut dans profiles.avatar_url
      await updateProfile({ avatarPath: path })

      // MODIFIÉ — 4. Remplace l'aperçu blob: par l'URL CDN permanente
      setAvatarPreview(publicUrl)

      // 5. Recharge le contexte auth → Navbar et autres composants voient la MAJ
      await refreshUser()

      showToast('Photo de profil mise à jour ✓', 'success')
    } catch (err) {
      // MODIFIÉ — Message d'erreur explicite + revert visuel
      const message = err?.message || "Erreur lors de l'upload de l'avatar"
      showToast(message, 'error')
      setAvatarPreview(null) // revert : retour à l'avatar précédent
    } finally {
      setUploadingAvatar(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-md shadow">
        <h2 className="text-xl font-medium">Mon profil</h2>
        <div className="mt-4 flex items-center space-x-6">

          {/* Photo de profil + bouton changement */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <img
                src={currentAvatar}
                alt={profile?.name || 'Avatar'}
                className="w-24 h-24 rounded-full object-cover border-2 border-slate-200"
                onError={(e) => {
                  // MODIFIÉ — fallback propre si l'URL CDN est cassée
                  e.currentTarget.onerror = null
                  e.currentTarget.src = `https://placehold.co/128x128/e2e8f0/94a3b8?text=${encodeURIComponent(profile?.name || 'U')}`
                }}
              />
              {uploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            {/* Input fichier caché */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              id="avatar-file-input"
            />
            <button
              id="btn-change-avatar"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="text-xs text-brand-700 underline hover:text-brand-900 disabled:opacity-50 disabled:cursor-wait"
            >
              {uploadingAvatar ? 'Upload…' : 'Changer la photo'}
            </button>
          </div>

          {/* Infos profil */}
          <div>
            <div className="font-medium text-lg">{profile?.name || 'Utilisateur'}</div>
            <div className="text-sm text-slate-500">{profile?.city || '—'}</div>
            <div className="text-sm text-slate-400 mt-1">{profile?.email}</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow">
        <h3 className="font-medium mb-4">Mes annonces ({mine.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mine.map(p => <ProductCard key={p.id} product={p} seller={profile} />)}
          {mine.length === 0 && <div className="text-sm text-slate-500">Aucune annonce active</div>}
        </div>
      </div>
    </div>
  )
}
