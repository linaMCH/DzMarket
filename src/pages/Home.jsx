import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../services/productService'
const allCategories = ['Électronique', 'Vêtements', 'Maison', 'Sport', 'Livres']
import ProductCard from '../components/ProductCard'
import CategoryFilter from '../components/CategoryFilter'
import EmptyState from '../components/EmptyState'

export default function Home() {
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  })
  const [category, setCategory] = useState(null)
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (category && p.category !== category) return false
      if (q && !`${p.title} ${p.description}`.toLowerCase().includes(q.toLowerCase())) return false
      return true
    })
  }, [products, category, q])

  return (
    <div>
      <CategoryFilter categories={allCategories} selected={category} onSelect={setCategory} />
      <div className="mt-4 flex items-center">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher..." className="flex-1 border rounded-md px-3 py-2" />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <EmptyState title="Aucune annonce" description="Aucune annonce ne correspond à votre recherche." />
        ) : (
          filtered.map(p => {
            // prefer `p.seller` returned by productService; do not fallback to mock data
            const seller = p.seller
            console.debug('Home rendering product:', p)
            return <ProductCard key={p.id} product={p} seller={seller} />
          })
        )}
      </div>
    </div>
  )
}
