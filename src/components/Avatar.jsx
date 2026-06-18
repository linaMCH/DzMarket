import React from 'react'

export default function Avatar({ src, alt, size = 10 }) {
  const s = size >= 10 ? 'w-10 h-10' : `w-${size} h-${size}`
  const placeholder = `https://placehold.co/64x64/e2e8f0/94a3b8?text=${encodeURIComponent(alt || 'User')}`
  return (
    <img
      src={src || placeholder}
      alt={alt}
      className={`rounded-full object-cover ${s}`}
      loading="lazy"
      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholder }}
    />
  )
}
