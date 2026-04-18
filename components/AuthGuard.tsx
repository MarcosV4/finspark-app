'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from '../lib/useSession'
import { supabase } from '../lib/supabase'

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const { session, loading } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [checkingProfile, setCheckingProfile] = useState(true)

  useEffect(() => {
    async function checkAccess() {
      if (loading) return

      if (!session) {
        setCheckingProfile(false)

        if (pathname !== '/auth') {
          router.push('/auth')
        }
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('has_completed_onboarding')
        .eq('id', session.user.id)
        .maybeSingle()

      if (error) {
        console.error('Error checking onboarding:', error)
        setCheckingProfile(false)
        return
      }

      const hasCompletedOnboarding = data?.has_completed_onboarding ?? false

      if (!hasCompletedOnboarding && pathname !== '/onboarding' && pathname !== '/auth') {
        router.push('/onboarding')
        setCheckingProfile(false)
        return
      }

      if (hasCompletedOnboarding && pathname === '/onboarding') {
        router.push('/dashboard')
        setCheckingProfile(false)
        return
      }

      setCheckingProfile(false)
    }

    checkAccess()
  }, [loading, session, pathname, router])

  if (loading || checkingProfile) {
    return <div style={{ padding: 20 }}>Cargando sesión...</div>
  }

  if (!session && pathname !== '/auth') {
    return <div style={{ padding: 20 }}>Redirigiendo...</div>
  }

  return <>{children}</>
}