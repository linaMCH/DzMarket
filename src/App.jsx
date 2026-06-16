import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import NewListing from './pages/NewListing'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import { supabase } from './services/supabaseClient'


function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
    console.log(supabase)
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
