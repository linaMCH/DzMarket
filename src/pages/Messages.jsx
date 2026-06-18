import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
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
    if (!text) return
    const msg = await sendMessage(active, { senderId: user?.id, text, time: new Date().toISOString() })
    setMessages(prev => [...prev, msg])
    setText('')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-1 bg-white rounded-md p-4 shadow">
        <h3 className="font-medium mb-3">Conversations</h3>
        <div className="space-y-2">
          {convs.map(c => {
            const other = user?.id === c.buyerId ? c.seller : c.buyer
            return (
              <div key={c.id} onClick={() => setActive(c.id)} className={`p-2 rounded-md cursor-pointer ${active === c.id ? 'bg-slate-100' : ''}`}>
                <div className="font-medium">{other?.name}</div>
                <div className="text-xs text-slate-500">Dernier message</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="md:col-span-3 bg-white rounded-md p-4 shadow flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {messages.map(m => (
            <ChatBubble key={m.id} text={m.text} isOwn={m.senderId === user?.id} />
          ))}
        </div>
        <div className="mt-3 flex items-center space-x-2">
          <input value={text} onChange={e => setText(e.target.value)} className="flex-1 border rounded-md px-3 py-2" placeholder="Écrire un message..." />
          <button onClick={handleSend} className="bg-brand-700 text-white px-4 py-2 rounded-md">Envoyer</button>
        </div>
      </div>
    </div>
  )
}