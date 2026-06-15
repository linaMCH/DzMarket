import React from 'react'

export default function ChatBubble({ text, isOwn }) {
  return (
    <div className={`max-w-xs ${isOwn ? 'ml-auto text-right' : ''} my-2`}> 
      <div className={`inline-block px-4 py-2 rounded-lg ${isOwn ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
        {text}
      </div>
    </div>
  )
}
