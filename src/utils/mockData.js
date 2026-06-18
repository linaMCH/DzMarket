// French-language mock data for local development

const users = [
  {
    id: 'u1',
    name: 'Amine B.',
    city: 'Alger',
    avatar: 'https://ui-avatars.com/api/?name=Amine+B&background=6366f1&color=ffffff'
  },
  {
    id: 'u2',
    name: 'Leïla M.',
    city: 'Oran',
    avatar: 'https://ui-avatars.com/api/?name=Leïla+M&background=6366f1&color=ffffff'
  },
  {
    id: 'u3',
    name: 'Youssef K.',
    city: 'Constantine',
    avatar: 'https://ui-avatars.com/api/?name=Youssef+K&background=6366f1&color=ffffff'
  }
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80&auto=format&fit=crop'
    ],

const categories = ['Électronique', 'Vêtements', 'Maison', 'Sport', 'Livres']

const products = [
  {
    id: 'p1',
    title: 'iPhone 11 en bon état',
    price: 85000,
    category: 'Électronique',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format&fit=crop'
    ],
    images: ['https://via.placeholder.com/800x600?text=iPhone+11'],
    sellerId: 'u1',
    city: 'Alger'
  },
  {
    id: 'p2',
    title: 'Veste en cuir vintage',
    price: 12000,
    category: 'Vêtements',
    images: [
      'https://images.unsplash.com/photo-1555041469-149751162957?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555041469-149751162957?w=800&q=80&auto=format&fit=crop'
    ],
    images: ['https://via.placeholder.com/800x600?text=Veste'],
    sellerId: 'u2',
    city: 'Oran'
  },
  {
    id: 'p3',
    title: 'Canapé 3 places confortable',
    price: 45000,
    category: 'Maison',
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop'
    ],
    images: ['https://via.placeholder.com/800x600?text=Canape'],
    sellerId: 'u3',
    city: 'Constantine'
  },
  {
    id: 'p4',
    title: 'Raquette de tennis Wilson',
    price: 8000,
    category: 'Sport',
    images: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80&auto=format&fit=crop'
    ],
    images: ['https://via.placeholder.com/800x600?text=Raquette'],
    sellerId: 'u1',
    city: 'Alger'
  },
  {
    id: 'p5',
    title: 'Lot de 5 romans français',
    price: 2000,
    category: 'Livres',
    images: [
      'https://images.unsplash.com/photo-1555041469-149751162957?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555041469-149751162957?w=800&q=80&auto=format&fit=crop'
    ],
    images: ['https://via.placeholder.com/800x600?text=Livres'],
    sellerId: 'u2',
    city: 'Oran'
  },
  {
    id: 'p6',
    title: 'Table basse scandinave',
    price: 15000,
    category: 'Maison',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80&auto=format&fit=crop'
    ],
    images: ['https://via.placeholder.com/800x600?text=Table+Basse'],
    sellerId: 'u3',
    city: 'Constantine'
  },
  {
    id: 'p7',
    title: 'Ordinateur portable Lenovo',
    price: 95000,
    category: 'Électronique',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80&auto=format&fit=crop'
    ],
    images: ['https://via.placeholder.com/800x600?text=Lenovo'],
    sellerId: 'u1',
    city: 'Alger'
  },
  {
    id: 'p8',
    title: 'Robe fleurie été',
    price: 6000,
    category: 'Vêtements',
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop'
    ],
    images: ['https://via.placeholder.com/800x600?text=Robe'],
    sellerId: 'u2',
    city: 'Oran'
  },
  {
    id: 'p9',
    title: 'Kit d’haltères 10kg',
    price: 18000,
    category: 'Sport',
    images: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80&auto=format&fit=crop'
    ],
    images: ['https://via.placeholder.com/800x600?text=Halt%C3%A8res'],
    sellerId: 'u3',
    city: 'Constantine'
  },
  {
    id: 'p10',
    title: 'Guide de voyage Algérie',
    price: 1200,
    category: 'Livres',
    images: [
      'https://images.unsplash.com/photo-1555041469-149751162957?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555041469-149751162957?w=800&q=80&auto=format&fit=crop'
    ],
    images: ['https://via.placeholder.com/800x600?text=Guide'],
    sellerId: 'u1',
    city: 'Alger'
  },
  {
    id: 'p11',
    title: 'Chaise de bureau ergonomique',
    price: 22000,
    category: 'Maison',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80&auto=format&fit=crop'
    ],
    images: ['https://via.placeholder.com/800x600?text=Chaise'],
    sellerId: 'u2',
    city: 'Oran'
  },
  {
    id: 'p12',
    title: 'Casque audio Bluetooth',
    price: 14000,
    category: 'Électronique',
    description: 'ANC, batterie longue durée.',
    images: ['https://via.placeholder.com/800x600?text=Casque'],
    sellerId: 'u3',
    city: 'Constantine'
  }
]

const conversations = [
  {
    id: 'c1',
    participants: ['u1', 'u2'],
    messages: [
      { id: 'm1', senderId: 'u2', text: 'Bonjour, est-ce que le prix est négociable ?', time: '2026-06-10T10:00:00Z' },
      { id: 'm2', senderId: 'u1', text: 'Bonjour, je peux baisser légèrement.', time: '2026-06-10T10:05:00Z' }
    ]
  },
  {
    id: 'c2',
    participants: ['u1', 'u3'],
    messages: [
      { id: 'm3', senderId: 'u3', text: 'Toujours disponible ?', time: '2026-06-11T14:20:00Z' },
      { id: 'm4', senderId: 'u1', text: 'Oui, disponible ce week-end.', time: '2026-06-11T14:22:00Z' }
    ]
  }
]

export { users, products, categories, conversations }
