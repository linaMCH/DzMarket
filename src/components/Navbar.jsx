import React from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Barre de navigation principale.
 * La barre de recherche est synchronisée avec le paramètre URL ?q=
 * via useSearchParams, ce qui la connecte directement à Home.jsx.
 */
export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const q = searchParams.get('q') || ''

  function handleSearch(e) {
    const value = e.target.value
    // Met à jour ?q= dans l'URL ; supprime le paramètre si vide
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) {
        next.set('q', value)
      } else {
        next.delete('q')
      }
      return next
    })
    // Redirige vers l'accueil si on n'y est pas déjà
    if (window.location.pathname !== '/') {
      navigate(`/?q=${encodeURIComponent(value)}`)
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold text-brand-700">LeBonCoin Lite</Link>
          <div className="hidden md:block">
            <input
              id="navbar-search"
              value={q}
              onChange={handleSearch}
              placeholder="Rechercher des annonces..."
              className="border rounded-md px-3 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
        </div>

        <nav className="flex items-center space-x-4">
          <Link to="/" className="text-sm text-slate-700">Accueil</Link>
          <Link to="/messages" className="text-sm text-slate-700">Messages</Link>
          <Link to="/new-listing" className="text-sm text-brand-700 font-medium">Publier</Link>
          {user ? (
            <>
              <Link to="/profile" className="text-sm text-slate-700">Mon profil</Link>
              <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-red-500 transition-colors">
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-700">Connexion</Link>
              <Link to="/register" className="text-sm text-brand-700 font-medium">Inscription</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
