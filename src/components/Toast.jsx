import React, { useEffect, useState } from 'react'

/**
 * Composant Toast minimaliste affiché en coin bas-droite.
 * Props :
 *   - message : string
 *   - type    : 'success' | 'error'
 *   - visible : bool
 */
export default function Toast({ message, type = 'success', visible }) {
  const [show, setShow] = useState(false)

  // Gère l'animation d'entrée/sortie
  useEffect(() => {
    if (visible) {
      setShow(true)
    } else {
      // Petite pause pour laisser l'animation de sortie se jouer
      const t = setTimeout(() => setShow(false), 300)
      return () => clearTimeout(t)
    }
  }, [visible])

  if (!show) return null

  const bgColor = type === 'error' ? 'bg-red-600' : 'bg-slate-800'
  const icon = type === 'error' ? '✕' : '✓'

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        fixed bottom-6 right-6 z-50 flex items-center gap-3
        ${bgColor} text-white px-5 py-3 rounded-lg shadow-lg
        transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <span className="text-sm font-semibold">{icon}</span>
      <span className="text-sm">{message}</span>
    </div>
  )
}
