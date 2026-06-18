import React from 'react'
import { Link } from 'react-router-dom'
import Badge from './Badge'
import Avatar from './Avatar'

export default function ProductCard({ product, seller }) {
  console.debug('ProductCard product:', product)
  return (
    <Link to={`/product/${product.id}`} className="block bg-white rounded-lg shadow-sm hover:shadow-md transition group overflow-hidden">
      <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden rounded-t-xl">
        <img
          src={product.images?.[0]}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://placehold.co/800x600/e2e8f0/94a3b8?text=${encodeURIComponent(product.category)}`;
          }}
        />
        <span className="absolute top-2 left-2">
          <Badge>{product.category}</Badge>
        </span>
      </div>

      <div className="p-4">
        <div className="mt-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-800">{product.title}</h3>
            <div className="text-sm text-slate-500">{product.city}</div>
          </div>
          <div className="text-right">
            <div className="text-brand-700 font-semibold">{product.price} DA</div>
            <div className="mt-2">
              <Badge>{product.category}</Badge>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center space-x-2">
          <Avatar src={seller?.avatar} alt={seller?.name} />
          <div className="text-xs text-slate-600">{seller?.name}</div>
        </div>
      </div>
    </Link>
  )
}
