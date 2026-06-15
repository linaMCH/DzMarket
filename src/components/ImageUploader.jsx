import React, { useCallback, useState } from 'react'
import { uploadImage } from '../services/storageService'

export default function ImageUploader({ onChange }) {
  const [previews, setPreviews] = useState([])

  const handleFiles = useCallback(async (files) => {
    const arr = Array.from(files)
    const urls = await Promise.all(arr.map(async (f) => {
      // mock upload
      const url = await uploadImage(f)
      return url
    }))
    setPreviews(prev => [...prev, ...urls])
    onChange && onChange(urls)
  }, [onChange])

  return (
    <div>
      <label className="block border-2 border-dashed border-slate-200 rounded-md p-6 text-center cursor-pointer">
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="text-sm text-slate-500">Glisser-déposer des images ou cliquer pour sélectionner</div>
      </label>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {previews.map((src, i) => (
          <img key={i} src={src} alt={`preview-${i}`} className="w-full h-24 object-cover rounded-md" />
        ))}
      </div>
    </div>
  )
}
