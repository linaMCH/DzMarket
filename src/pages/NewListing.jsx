import React, { useState } from 'react'
import ImageUploader from '../components/ImageUploader'
import { createProduct } from '../services/productService'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToastContext } from '../context/ToastContext'

const categories = ['Électronique', 'Vêtements', 'Maison', 'Sport', 'Livres']

export default function NewListing() {
  const [title, setTitle]           = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice]           = useState('')
  const [category, setCategory]     = useState(categories[0])
  const [city, setCity]             = useState('')
  const [images, setImages]         = useState([])
  const [errors, setErrors]         = useState({})
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToastContext()

  // Validation JS côté client
  function validate() {
    const errs = {}
    if (!title.trim())       errs.title       = 'Le titre est obligatoire.'
    if (!description.trim()) errs.description = 'La description est obligatoire.'
    if (!price || isNaN(Number(price)) || Number(price) <= 0)
                             errs.price       = 'Le prix doit être un nombre positif.'
    if (!city.trim())        errs.city        = 'La ville est obligatoire.'
    if (images.length === 0) errs.images      = 'Ajoutez au moins une image.'
    return errs
  }

  // Bouton désactivé si des champs sont vides ou pas d'image
  const isFormReady =
    title.trim() &&
    description.trim() &&
    price && !isNaN(Number(price)) && Number(price) > 0 &&
    city.trim() &&
    images.length > 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      const payload = {
        title:       title.trim(),
        description: description.trim(),
        price:       Number(price),
        category,
        city:        city.trim(),
        images,
        sellerId:    user?.id
      }
      const created = await createProduct(payload)
      showToast('Annonce publiée avec succès ✓', 'success')
      navigate(`/product/${created.id}`)
    } catch (err) {
      showToast(err.message || 'Erreur lors de la publication', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow">
      <h2 className="text-xl font-medium mb-4">Publier une annonce</h2>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>

        {/* Titre */}
        <div>
          <input
            id="listing-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Titre *"
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${errors.title ? 'border-red-400 focus:ring-red-300' : 'focus:ring-brand-400'}`}
            required
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <textarea
            id="listing-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description *"
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${errors.description ? 'border-red-400 focus:ring-red-300' : 'focus:ring-brand-400'}`}
            rows={5}
            required
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>

        {/* Prix + Catégorie */}
        <div className="flex space-x-2">
          <div className="w-1/2">
            <input
              id="listing-price"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="Prix (DA) *"
              type="number"
              min="0"
              className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${errors.price ? 'border-red-400 focus:ring-red-300' : 'focus:ring-brand-400'}`}
              required
            />
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          </div>
          <div className="w-1/2">
            <select
              id="listing-category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-400"
              required
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Ville */}
        <div>
          <input
            id="listing-city"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Ville *"
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${errors.city ? 'border-red-400 focus:ring-red-300' : 'focus:ring-brand-400'}`}
            required
          />
          {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
        </div>

        {/* Images */}
        <div>
          <ImageUploader onChange={(paths) => setImages(prev => [...prev, ...paths])} />
          {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
        </div>

        {/* Bouton Publier */}
        <div className="pt-4">
          <button
            id="listing-submit"
            type="submit"
            disabled={!isFormReady || submitting}
            className={`px-6 py-2 rounded-md text-white transition-colors ${
              !isFormReady || submitting
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-brand-700 hover:bg-brand-800'
            }`}
          >
            {submitting ? 'Publication…' : 'Publier'}
          </button>
        </div>
      </form>
    </div>
  )
}
