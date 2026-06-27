import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { getConversations, getMessages, sendMessage } from '../services/messageService'
import ChatBubble from '../components/ChatBubble'
import { useAuth } from '../context/AuthContext'

export default function Messages() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const conversationFromUrl = searchParams.get('conversation')

  const { data: convs = [] } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: () => getConversations(user?.id),
    enabled: !!user
  })

  const [active, setActive] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    if (conversationFromUrl) {
      setActive(conversationFromUrl)
    } else if (convs.length > 0 && !active) {
      setActive(convs[0].id)
    }
  }, [convs, conversationFromUrl])

  useEffect(() => {
    if (!active) return
    getMessages(active).then(setMessages)
  }, [active])

  const handleSend = async () => {
    // ── Guard : ne jamais appeler sendMessage sans conversation active ──
    if (!active) return
    if (!text.trim()) return

    try {
      const msg = await sendMessage(active, {
        senderId: user?.id,
        text: text.trim(),
        time: new Date().toISOString()
      })
      setMessages(prev => [...prev, msg])
      setText('')
    } catch (err) {
      console.error('Erreur envoi message :', err)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ── Cas 1 : aucune conversation du tout ──────────────────────────────────────
  if (convs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
        <p className="text-slate-500 text-lg">
          Vous n'avez pas encore de messages.
        </p>
        <p className="text-slate-400 text-sm">
          Contactez un vendeur depuis une annonce pour démarrer une conversation.
        </p>
        <Link
          to="/"
          className="bg-brand-700 text-white px-5 py-2 rounded-md text-sm hover:bg-brand-800 transition-colors"
        >
          Voir les annonces
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

      {/* ── Liste des conversations ── */}
      <div className="md:col-span-1 bg-white rounded-md p-4 shadow">
        <h3 className="font-medium mb-3">Conversations</h3>
        <div className="space-y-2">
          {convs.map(c => {
            const other = user?.id === c.buyerId ? c.seller : c.buyer
            return (
              <div
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`p-2 rounded-md cursor-pointer ${active === c.id ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
              >
                <div className="font-medium">{other?.name}</div>
                <div className="text-xs text-slate-500">Dernier message</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Zone de messages ── */}
      <div className="md:col-span-3 bg-white rounded-md p-4 shadow flex flex-col min-h-[400px]">

        {/* Cas 2 : des conversations existent mais aucune n'est sélectionnée */}
        {!active ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            ← Sélectionnez une conversation
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-1 mb-3">
              {messages.length === 0 ? (
                <p className="text-center text-slate-400 text-sm mt-8">
                  Aucun message pour l'instant. Envoyez le premier !
                </p>
              ) : (
                messages.map(m => (
                  <ChatBubble key={m.id} text={m.text} isOwn={m.senderId === user?.id} />
                ))
              )}
            </div>

            {/* Zone de saisie — uniquement si une conversation est active */}
            <div className="mt-3 flex items-center space-x-2">
              <input
                id="message-input"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Écrire un message..."
              />
              <button
                id="btn-send-message"
                onClick={handleSend}
                disabled={!text.trim()}
                className="bg-brand-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-800 transition-colors"
              >
                Envoyer
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  )
}