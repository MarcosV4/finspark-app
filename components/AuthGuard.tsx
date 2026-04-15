'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useSession } from '../lib/useSession'

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const { session, loading } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !session && pathname !== '/auth') {
      router.push('/auth')
    }
  }, [loading, session, pathname, router])

  if (loading) {
    return <div style={{ padding: 20 }}>Cargando sesión...</div>
  }

  if (!session && pathname !== '/auth') {
    return <div style={{ padding: 20 }}>Redirigiendo...</div>
  }

  return <>{children}</>
}