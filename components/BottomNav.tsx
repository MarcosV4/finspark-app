'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  const tabs = [
    { name: 'Inicio', href: '/dashboard' },
    { name: 'Progreso', href: '/progreso' },
    { name: 'Ahorro', href: '/ahorro' },
    { name: 'Inversión', href: '/inversion' },
    { name: 'Mascota', href: '/mascota' },
  ]

  return (
    <div style={{
      display: 'flex',
      borderTop: '1px solid #ddd',
      padding: '10px 0',
      justifyContent: 'space-around',
      background: '#fff'
    }}>
      {tabs.map(tab => (
        <Link
          key={tab.href}
          href={tab.href}
          style={{
            textDecoration: 'none',
            color: pathname === tab.href ? '#6c4cff' : '#888',
            fontSize: '12px'
          }}
        >
          {tab.name}
        </Link>
      ))}
    </div>
  )
}