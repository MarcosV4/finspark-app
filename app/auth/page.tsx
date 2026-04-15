'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { bootstrapUser } from '../../lib/bootstrapUser'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setUserEmail(session?.user?.email ?? null)
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUserEmail(session?.user?.email ?? null)

      if (session?.user) {
        try {
          await bootstrapUser(session.user.id, session.user.email)
        } catch (error) {
          console.error(error)
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function handleSignUp() {
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Registro correcto. Revisa tu email si Supabase pide confirmación.')
    }

    setLoading(false)
  }

  async function handleSignIn() {
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        try {
          await bootstrapUser(session.user.id, session.user.email)
          setMessage('Sesión iniciada y usuario inicializado correctamente.')
        } catch (bootstrapError) {
          const err = bootstrapError as Error
          setMessage(`Login correcto, pero falló bootstrap: ${err.message}`)
        }
      } else {
        setMessage('Sesión iniciada correctamente.')
      }
    }

    setLoading(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setMessage('Sesión cerrada.')
  }

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h1>Auth de Supabase</h1>

      <div style={{ marginTop: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            style={{
              display: 'block',
              width: '100%',
              marginTop: 6,
              padding: 10,
              borderRadius: 8,
              border: '1px solid #ccc',
            }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            style={{
              display: 'block',
              width: '100%',
              marginTop: 6,
              padding: 10,
              borderRadius: 8,
              border: '1px solid #ccc',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button onClick={handleSignUp} disabled={loading}>
            Registrarse
          </button>

          <button onClick={handleSignIn} disabled={loading}>
            Iniciar sesión
          </button>

          <button onClick={handleSignOut} disabled={loading}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <strong>Sesión actual:</strong>{' '}
        {userEmail ? userEmail : 'No hay usuario logueado'}
      </div>

      {message && <p style={{ marginTop: 16 }}>{message}</p>}
    </div>
  )
}