import React, { useState } from 'react'
import ImageUploader from '../components/ImageUploader'
import { createProduct } from '../services/productService'
import { useNavigate } from 'react-router-dom'
const categories = ['Électronique', 'Vêtements', 'Maison', 'Sport', 'Livres']
import { useAuth } from '../context/AuthContext'

export default function NewListing() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [images, setImages] = useState([])
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      title, description, price: Number(price), category, images, sellerId: user?.id || 'u1', city: user?.city || 'Ville'
    }
    console.debug('NewListing.createProduct payload:', payload)
    const created = await createProduct(payload)
    // redirect to new product
    navigate(`/product/${created.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow">
      <h2 className="text-xl font-medium mb-4">Publier une annonce</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre" className="w-full border px-3 py-2 rounded-md" required />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full border px-3 py-2 rounded-md" rows={5} required />
        <div className="flex space-x-2">
          <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Prix (DA)" className="w-1/2 border px-3 py-2 rounded-md" required />
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-1/2 border px-3 py-2 rounded-md">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <ImageUploader onChange={(paths) => setImages(prev => [...prev, ...paths])} />
        <div className="pt-4">
          <button className="bg-brand-700 text-white px-4 py-2 rounded-md">Publier</button>
        </div>
      </form>
    </div>
  )
}
