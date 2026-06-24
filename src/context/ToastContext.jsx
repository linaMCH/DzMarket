import React, { createContext, useContext } from 'react'
import { useToast } from '../hooks/useToast'
import Toast from '../components/Toast'

/**
 * Contexte global pour les toasts de notification.
 * N'importe quel composant peut appeler useToastContext().showToast(message, type).
 */
const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const { toast, showToast } = useToast()

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToastContext must be used inside <ToastProvider>')
  return ctx
}
