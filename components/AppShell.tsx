'use client'

import { usePathname } from 'next/navigation'
import BottomNav from './BottomNav'

export default function AppShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const hideNav = pathname === '/auth' || pathname === '/onboarding'

  if (hideNav) {
    return <>{children}</>
  }

  return (
    <div className="app-container">
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
      <BottomNav />
    </div>
  )
}