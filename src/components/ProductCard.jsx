import React from 'react'
import { Link } from 'react-router-dom'
import Badge from './Badge'
import Avatar from './Avatar'

export default function ProductCard({ product, seller }) {
  return (
    <Link to={`/product/${product.id}`} className="block bg-white rounded-lg shadow-sm hover:shadow-md transition p-4">
      <div className="relative pb-56 bg-slate-100 rounded-md overflow-hidden">
        <img src={product.images?.[0]} alt={product.title} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-800">{product.title}</h3>
          <div className="text-sm text-slate-500">{product.city}</div>
        </div>
        <div className="text-right">
          <div className="text-indigo-600 font-semibold">{product.price} DA</div>
          <div className="mt-2">
            <Badge>{product.category}</Badge>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center space-x-2">
        <Avatar src={seller?.avatar} alt={seller?.name} />
        <div className="text-xs text-slate-600">{seller?.name}</div>
      </div>
    </Link>
  )
}
