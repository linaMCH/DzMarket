import React, { useCallback, useState } from 'react'
import { uploadImage, getPublicUrl } from '../services/storageService'

export default function ImageUploader({ onChange }) {
  const [previews, setPreviews] = useState([])

  const handleFiles = useCallback(async (files) => {
    const arr = Array.from(files)
    // upload files -> get storage paths
    const paths = await Promise.all(arr.map(async (f) => {
      const path = await uploadImage(f)
      // log returned storage path for diagnostics
      console.debug('ImageUploader.uploaded path:', path)
      return path
    }))
    // convert paths to public URLs for preview
    const urls = paths.map(p => getPublicUrl(p))
    setPreviews(prev => [...prev, ...urls])
    // onChange should receive storage paths so caller can store them in DB
    console.debug('ImageUploader.onChange paths:', paths)
    onChange && onChange(paths)
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
