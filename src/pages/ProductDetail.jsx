import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProductById } from '../services/productService'
import { users } from '../utils/mockData'

export default function ProductDetail() {
  const { id } = useParams()
  const { data: product } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id)
  })

  if (!product) return <div>Annonce introuvable</div>

  const seller = users.find(u => u.id === product.sellerId)

  return (
    <div className="bg-white rounded-md p-6 shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <img src={product.images?.[0]} alt={product.title} className="w-full h-96 object-cover rounded-md" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">{product.title}</h1>
          <div className="text-indigo-600 text-xl font-bold mt-2">{product.price} DA</div>
          <div className="mt-4 text-slate-600">{product.description}</div>

          <div className="mt-6 border-t pt-4">
            <h3 className="font-medium">Vendeur</h3>
            <div className="mt-2 flex items-center space-x-3">
              <img src={seller.avatar} alt={seller.name} className="w-12 h-12 rounded-full" />
              <div>
                <div className="font-medium">{seller.name}</div>
                <div className="text-sm text-slate-500">{seller.city}</div>
              </div>
            </div>
            <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md">Contacter le vendeur</button>
          </div>
        </div>
      </div>
    </div>
  )
}
