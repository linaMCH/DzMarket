import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    await login(email, password)
    navigate('/')
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow">
      <h2 className="text-xl font-medium mb-4">Connexion</h2>
      <form onSubmit={handle} className="space-y-4">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border px-3 py-2 rounded-md" required />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Mot de passe" className="w-full border px-3 py-2 rounded-md" required />
        <button className="w-full bg-brand-700 text-white py-2 rounded-md">Se connecter</button>
      </form>
    </div>
  )
}
