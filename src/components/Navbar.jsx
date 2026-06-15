import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold text-indigo-600">LeBonCoin Lite</Link>
          <div className="hidden md:block">
            <input placeholder="Rechercher des annonces..." className="border rounded-md px-3 py-2 w-80" />
          </div>
        </div>

        <nav className="flex items-center space-x-4">
          <Link to="/" className="text-sm text-slate-700">Accueil</Link>
          <Link to="/messages" className="text-sm text-slate-700">Messages</Link>
          <Link to="/new-listing" className="text-sm text-indigo-600 font-medium">Publier</Link>
          {user ? (
            <>
              <Link to="/profile" className="text-sm text-slate-700">Mon profil</Link>
              <button onClick={() => { logout(); navigate('/') }} className="text-sm text-slate-500">Se déconnecter</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-700">Connexion</Link>
              <Link to="/register" className="text-sm text-indigo-600 font-medium">Inscription</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
