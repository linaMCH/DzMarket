import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getProductById, updateProduct, deleteProduct } from '../services/productService'
import { createConversation } from '../services/messageService'
import { useAuth } from '../context/AuthContext'
import { useToastContext } from '../context/ToastContext'

const categories = ['Électronique', 'Vêtements', 'Maison', 'Sport', 'Livres']

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToastContext()
  const queryClient = useQueryClient()

  // ── State (tous avant les early returns) ──────────────────────────────────
  const [activeImage, setActiveImage] = useState(0)

  // Bloc "Modifier"
  const [showEditForm, setShowEditForm]   = useState(false)
  const [editTitle, setEditTitle]         = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editPrice, setEditPrice]         = useState('')
  const [editCategory, setEditCategory]   = useState('')
  const [editCity, setEditCity]           = useState('')
  const [editLoading, setEditLoading]     = useState(false)

  // Bloc "Supprimer"
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // ── Query ─────────────────────────────────────────────────────────────────
  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id)
  })

  // ── Early returns (après tous les hooks) ──────────────────────────────────
  if (isLoading) return <div className="text-center py-20 text-slate-500">Chargement...</div>
  if (isError)   return <div className="text-center py-20 text-red-500">Erreur : {error?.message || 'Une erreur est survenue'}</div>
  if (!product)  return <div className="text-center py-20 text-slate-500">Annonce introuvable</div>

  const seller = product.seller || { id: null, name: 'Utilisateur', avatar: null, city: '' }
  const isOwner = !!user && user.id === product.sellerId

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function handleContactSeller() {
    if (!user) { navigate('/login'); return }
    const conversationId = await createConversation({
      buyerId: user.id,
      sellerId: seller.id,
      productId: product.id
    })
    navigate(`/messages?conversation=${conversationId}`)
  }

  function openEditForm() {
    setEditTitle(product.title)
    setEditDescription(product.description)
    setEditPrice(String(product.price))
    setEditCategory(product.category)
    setEditCity(product.city || '')
    setShowEditForm(true)
    setShowDeleteConfirm(false)
  }

  async function handleEdit(e) {
    e.preventDefault()
    setEditLoading(true)
    try {
      await updateProduct(id, {
        title:       editTitle,
        description: editDescription,
        price:       editPrice,
        category:    editCategory,
        city:        editCity
      })
      // Invalide le cache pour recharger le produit mis à jour
      await queryClient.invalidateQueries({ queryKey: ['product', id] })
      setShowEditForm(false)
      showToast('Annonce modifiée ✓', 'success')
    } catch (err) {
      showToast(err.message || 'Erreur lors de la modification', 'error')
    } finally {
      setEditLoading(false)
    }
  }

  async function handleDelete() {
    setDeleteLoading(true)
    try {
      await deleteProduct(id)
      showToast('Annonce supprimée', 'success')
      navigate('/profile')
    } catch (err) {
      showToast(err.message || 'Erreur lors de la suppression', 'error')
    } finally {
      setDeleteLoading(false)
    }
  }

  // ── Rendu ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-md p-6 shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ── Colonne gauche : images ───────────────────────────────────── */}
        <div className="md:col-span-2">
          <div className="w-full h-96 bg-slate-100 rounded-md overflow-hidden">
            <img
              src={product.images?.[activeImage]}
              alt={product.title}
              className="w-full h-full object-cover rounded-md"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = `https://placehold.co/800x600/e2e8f0/94a3b8?text=${encodeURIComponent(product.title)}`
              }}
            />
          </div>
          <div className="mt-3 flex items-center space-x-2">
            {product.images?.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`${product.title} ${i + 1}`}
                onClick={() => setActiveImage(i)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                  activeImage === i ? 'border-brand-500' : 'border-transparent hover:border-slate-300'
                }`}
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            ))}
          </div>
        </div>

        {/* ── Colonne droite : infos + actions ─────────────────────────── */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">{product.title}</h1>
          <div className="text-brand-700 text-xl font-bold mt-2">{product.price} DA</div>
          {product.city && <div className="text-sm text-slate-500 mt-1">📍 {product.city}</div>}
          <div className="mt-4 text-slate-600">{product.description}</div>

          <div className="mt-6 border-t pt-4">
            {/* ── Bloc vendeur ───────────────────────────────────────────── */}
            <h3 className="font-medium">Vendeur</h3>
            <div className="mt-2 flex items-center space-x-3">
              <img
                src={seller.avatar || `https://placehold.co/64x64/e2e8f0/94a3b8?text=${encodeURIComponent(seller.name || 'User')}`}
                alt={seller.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-medium">{seller.name}</div>
                <div className="text-sm text-slate-500">{seller.city}</div>
              </div>
            </div>

            {/* ── Zone propriétaire vs visiteur ─────────────────────────── */}
            {isOwner ? (
              <div className="mt-4 space-y-3">
                <h4 className="font-semibold text-slate-700">Gérer mon annonce</h4>

                {/* Bouton Modifier */}
                <button
                  id="btn-edit-listing"
                  onClick={openEditForm}
                  className="w-full border border-brand-700 text-brand-700 py-2 rounded-md hover:bg-brand-50 transition-colors"
                >
                  Modifier l'annonce
                </button>

                {/* Bouton Supprimer */}
                <button
                  id="btn-delete-listing"
                  onClick={() => { setShowDeleteConfirm(true); setShowEditForm(false) }}
                  className="w-full border border-red-500 text-red-500 py-2 rounded-md hover:bg-red-50 transition-colors"
                >
                  Supprimer l'annonce
                </button>

                {/* Formulaire de modification inline */}
                {showEditForm && (
                  <form onSubmit={handleEdit} className="mt-4 space-y-3 border rounded-md p-4 bg-slate-50">
                    <h5 className="font-medium text-slate-700">Modifier l'annonce</h5>
                    <input
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      placeholder="Titre"
                      className="w-full border px-3 py-2 rounded-md text-sm"
                      required
                    />
                    <textarea
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                      placeholder="Description"
                      rows={3}
                      className="w-full border px-3 py-2 rounded-md text-sm"
                      required
                    />
                    <input
                      value={editPrice}
                      onChange={e => setEditPrice(e.target.value)}
                      placeholder="Prix (DA)"
                      type="number"
                      min="0"
                      className="w-full border px-3 py-2 rounded-md text-sm"
                      required
                    />
                    <select
                      value={editCategory}
                      onChange={e => setEditCategory(e.target.value)}
                      className="w-full border px-3 py-2 rounded-md text-sm"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input
                      value={editCity}
                      onChange={e => setEditCity(e.target.value)}
                      placeholder="Ville"
                      className="w-full border px-3 py-2 rounded-md text-sm"
                      required
                    />
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        disabled={editLoading}
                        className="flex-1 bg-brand-700 text-white py-2 rounded-md hover:bg-brand-800 transition-colors disabled:opacity-50"
                      >
                        {editLoading ? 'Enregistrement…' : 'Enregistrer'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEditForm(false)}
                        className="flex-1 border py-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                )}

                {/* Confirmation de suppression inline */}
                {showDeleteConfirm && (
                  <div className="mt-4 border border-red-200 rounded-md p-4 bg-red-50 space-y-3">
                    <p className="text-sm text-red-700 font-medium">Êtes-vous sûr de vouloir supprimer cette annonce ?</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        {deleteLoading ? 'Suppression…' : 'Oui, supprimer'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 border py-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Zone visiteur ──────────────────────────────────────────── */
              <button
                onClick={handleContactSeller}
                className="mt-4 w-full bg-brand-700 text-white py-2 rounded-md hover:bg-brand-800 transition-colors"
              >
                Contacter le vendeur
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}