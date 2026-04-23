'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from '../lib/useSession'
import { supabase } from '../lib/supabase'

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const { session, loading } = useSession()
  const pathname = usePathname()
  const [checkingProfile, setCheckingProfile] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function checkAccess() {
      // En auth nunca bloqueamos.
      if (pathname === '/auth') {
        if (!cancelled) {
          setCheckingProfile(false)
        }
        return
      }

      if (loading) {
        return
      }

      if (!session) {
        if (!cancelled) {
          setCheckingProfile(false)
          window.location.replace('/auth')
        }
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('has_completed_onboarding')
        .eq('id', session.user.id)
        .maybeSingle()

      if (cancelled) return

      if (error) {
        console.error('Error checking onboarding:', error)
        setCheckingProfile(false)
        return
      }

      const hasCompletedOnboarding = data?.has_completed_onboarding ?? false

      if (!hasCompletedOnboarding && pathname !== '/onboarding') {
        window.location.replace('/onboarding')
        setCheckingProfile(false)
        return
      }

      if (hasCompletedOnboarding && pathname === '/onboarding') {
        window.location.replace('/dashboard')
        setCheckingProfile(false)
        return
      }

      setCheckingProfile(false)
    }

    checkAccess()

    return () => {
      cancelled = true
    }
  }, [loading, session, pathname])

  if (pathname === '/auth') {
    return <>{children}</>
  }

  if (loading || checkingProfile) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#0B0B12',
          color: '#F5F7FB',
        }}
      >
        Cargando...
      </div>
    )
  }

  if (!session) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#0B0B12',
          color: '#F5F7FB',
        }}
      >
        Redirigiendo...
      </div>
    )
  }

  return <>{children}</>
}