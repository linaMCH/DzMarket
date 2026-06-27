import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../services/productService'
import ProductCard from '../components/ProductCard'
import CategoryFilter from '../components/CategoryFilter'
import EmptyState from '../components/EmptyState'

const allCategories = ['Électronique', 'Vêtements', 'Maison', 'Sport', 'Livres']

/**
 * Normalise une chaîne : supprime accents et met en minuscules.
 * Permet une recherche insensible aux accents et à la casse.
 */
function normalize(str) {
  if (!str) return ''
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export default function Home() {
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  })

  const [category, setCategory] = useState(null)

  // Synchronisation de la recherche avec le paramètre URL ?q=
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''

  function handleLocalSearch(e) {
    const value = e.target.value
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) {
        next.set('q', value)
      } else {
        next.delete('q')
      }
      return next
    })
  }

  const filtered = useMemo(() => {
    const nq = normalize(q)
    return products.filter(p => {
      // Filtre catégorie
      if (category && p.category !== category) return false
      // Filtre texte étendu : titre, description, catégorie, ville, nom vendeur
      if (nq) {
        const haystack = normalize([
          p.title,
          p.description,
          p.category,
          p.city,
          p.seller?.name
        ].join(' '))
        if (!haystack.includes(nq)) return false
      }
      return true
    })
  }, [products, category, q])

  return (
    <div>
      <CategoryFilter categories={allCategories} selected={category} onSelect={setCategory} />

      {/* MODIFIÉ — Style de la barre de recherche renforcé (seule barre du site) */}
      <div className="mt-4 flex items-center">
        <input
          id="home-search"
          value={q}
          onChange={handleLocalSearch}
          placeholder="🔍  Rechercher une annonce, une catégorie, une ville..."
          className="flex-1 border border-slate-300 rounded-lg px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <EmptyState title="Aucune annonce" description="Aucune annonce ne correspond à votre recherche." />
        ) : (
          filtered.map(p => {
            const seller = p.seller
            return <ProductCard key={p.id} product={p} seller={seller} />
          })
        )}
      </div>
    </div>
  )
}
