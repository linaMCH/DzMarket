import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider, useToastContext } from './context/ToastContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import NewListing from './pages/NewListing'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

/**
 * AppRoutes est rendu à l'intérieur de ToastProvider ET AuthProvider.
 * Cela lui permet d'accéder aux deux contextes (useAuth + useToastContext).
 */
function AppRoutes() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/new-listing"
            element={<PrivateRoute><NewListing /></PrivateRoute>}
          />
          <Route
            path="/messages"
            element={<PrivateRoute><Messages /></PrivateRoute>}
          />
          <Route
            path="/profile"
            element={<PrivateRoute><Profile /></PrivateRoute>}
          />
        </Routes>
      </main>
    </div>
  )
}

/**
 * AuthProviderWithToast : wrapper qui monte AuthProvider APRÈS ToastProvider,
 * permettant de passer showToast comme callback de login/logout
 * sans créer de dépendance circulaire entre les contextes.
 */
function AuthProviderWithToast({ children }) {
  const { showToast } = useToastContext()

  return (
    <AuthProvider
      onLoginSuccess={() => showToast('Vous êtes connecté ✓', 'success')}
      onLogoutSuccess={() => showToast('Vous êtes déconnecté', 'success')}
    >
      {children}
    </AuthProvider>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProviderWithToast>
        <AppRoutes />
      </AuthProviderWithToast>
    </ToastProvider>
  )
}
