import React from 'react'

export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="flex space-x-2 overflow-x-auto py-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1 rounded-full text-sm ${!selected ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border'}`}>
        Tous
      </button>
      {categories.map(c => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className={`px-3 py-1 rounded-full text-sm ${selected === c ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border'}`}>
          {c}
        </button>
      ))}
    </div>
  )
}
