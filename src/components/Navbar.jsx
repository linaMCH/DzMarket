import React from 'react'
// MODIFIÉ — suppression de useSearchParams (plus utilisé ici)
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Barre de navigation principale.
 * MODIFIÉ — La barre de recherche a été déplacée dans Home.jsx uniquement.
 * La Navbar ne gère plus aucun état de recherche.
 */
export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">

        {/* MODIFIÉ — Branding "LeBonCoin Lite" remplacé par "DzMarket" + slogan */}
        <Link to="/" className="flex flex-col leading-tight">
          <span className="text-xl font-bold text-brand-700">DzMarket</span>
          <span className="text-xs text-slate-400 font-medium tracking-wide">
            Le marché algérien, en ligne.
          </span>
        </Link>

        {/* MODIFIÉ — Bloc <input> de recherche entièrement supprimé */}

        <nav className="flex items-center space-x-4">
          <Link to="/" className="text-sm text-slate-700">Accueil</Link>
          <Link to="/messages" className="text-sm text-slate-700">Messages</Link>
          <Link to="/new-listing" className="text-sm text-brand-700 font-medium">Publier</Link>
          {user ? (
            <>
              <Link to="/profile" className="text-sm text-slate-700">Mon profil</Link>
              <button
                onClick={handleLogout}
                className="text-sm text-slate-500 hover:text-red-500 transition-colors"
              >
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
