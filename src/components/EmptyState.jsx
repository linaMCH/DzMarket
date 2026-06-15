import React from 'react'

export default function EmptyState({ title = 'Aucun résultat', description = '' }) {
  return (
    <div className="text-center py-12">
      <div className="text-2xl font-semibold text-slate-700">{title}</div>
      {description && <p className="text-sm text-slate-500 mt-2">{description}</p>}
    </div>
  )
}
