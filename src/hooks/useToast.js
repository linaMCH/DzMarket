import { useState, useCallback } from 'react'

/**
 * Hook de gestion des toasts de notification.
 * Expose showToast(message, type) pour déclencher un toast,
 * et toast { message, type, visible } pour l'état courant.
 */
export function useToast() {
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false })
  const timerRef = { current: null }

  const showToast = useCallback((message, type = 'success') => {
    // Annule l'éventuel timer précédent pour éviter les conflits
    if (timerRef.current) clearTimeout(timerRef.current)

    setToast({ message, type, visible: true })

    timerRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }))
    }, 3000)
  }, [])

  return { toast, showToast }
}
