import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProductById } from '../services/productService'
import { createConversation } from '../services/messageService'
import { useAuth } from '../context/AuthContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  // ✅ useState AVANT tout early return
  const [activeImage, setActiveImage] = useState(0)

  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id)
  })

  // Early returns APRÈS tous les hooks
  if (isLoading) return <div className="text-center py-20 text-slate-500">Chargement...</div>
  if (isError) return <div className="text-center py-20 text-red-500">Erreur : {error?.message || 'Une erreur est survenue'}</div>
  if (!product) return <div className="text-center py-20 text-slate-500">Annonce introuvable</div>

  console.debug('ProductDetail loaded product:', product)

  const seller = product.seller || { id: null, name: 'Utilisateur', avatar: null, city: '' }

  async function handleContactSeller() {
    if (!user) {
      navigate('/login')
      return
    }
    const conversationId = await createConversation({
      buyerId: user.id,
      sellerId: seller.id,
      productId: product.id
    })
    navigate(`/messages?conversation=${conversationId}`)
  }

  return (
    <div className="bg-white rounded-md p-6 shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div>
          <h1 className="text-2xl font-semibold text-slate-800">{product.title}</h1>
          <div className="text-brand-700 text-xl font-bold mt-2">{product.price} DA</div>
          <div className="mt-4 text-slate-600">{product.description}</div>

          <div className="mt-6 border-t pt-4">
            <h3 className="font-medium">Vendeur</h3>
            <div className="mt-2 flex items-center space-x-3">
              <img
                src={seller.avatar || `https://placehold.co/64x64/e2e8f0/94a3b8?text=${encodeURIComponent(seller.name || 'User')}`}
                alt={seller.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="font-medium">{seller.name}</div>
                <div className="text-sm text-slate-500">{seller.city}</div>
              </div>
            </div>
            <button
              onClick={handleContactSeller}
              className="mt-4 w-full bg-brand-700 text-white py-2 rounded-md hover:bg-brand-800 transition-colors"
            >
              Contacter le vendeur
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}