import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../services/productService'
import ProductCard from '../components/ProductCard'
import { users } from '../utils/mockData'

export default function Profile() {
  const { user } = useAuth()
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  })

  const mine = products.filter(p => p.sellerId === user?.id)
  const profile = users.find(u => u.id === user?.id)

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-md shadow">
        <h2 className="text-xl font-medium">Mon profil</h2>
        <div className="mt-4">
          <div className="font-medium">{profile?.name || 'Utilisateur'}</div>
          <div className="text-sm text-slate-500">{profile?.city}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-md shadow">
        <h3 className="font-medium mb-4">Mes annonces</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mine.map(p => <ProductCard key={p.id} product={p} seller={profile} />)}
          {mine.length === 0 && <div className="text-sm text-slate-500">Aucune annonce active</div>}
        </div>
      </div>
    </div>
  )
}
