import React from 'react'

export default function Avatar({ src, alt, size = 10 }) {
  const s = size >= 10 ? 'w-10 h-10' : `w-${size} h-${size}`
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover ${s}`}
      loading="lazy"
    />
  )
}
