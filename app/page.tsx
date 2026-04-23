'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Mission = {
  id: number
  title: string
  xp_reward: number
  coin_reward: number
}

type ShopItem = {
  id: number
  name: string
  price: number | null
  required_level: number | null
  category: string
  icon: string | null
  is_active: boolean
}

export default function Home() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [shopItems, setShopItems] = useState<ShopItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      setIsAuthenticated(true)

      const [missionsResult, shopItemsResult] = await Promise.all([
        supabase.from('missions').select('*').order('id', { ascending: true }),
        supabase.from('shop_items').select('*').order('id', { ascending: true }),
      ])

      if (missionsResult.error) {
        setError(`Missions error: ${missionsResult.error.message}`)
        setLoading(false)
        return
      }

      if (shopItemsResult.error) {
        setError(`Shop items error: ${shopItemsResult.error.message}`)
        setLoading(false)
        return
      }

      setMissions(missionsResult.data ?? [])
      setShopItems(shopItemsResult.data ?? [])
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return <div style={{ padding: 20 }}>Cargando datos de Supabase...</div>
  }

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 20 }}>
        <h1>FinSpark</h1>
        <p>Tienes que iniciar sesión para ver el contenido.</p>
      </div>
    )
  }

  if (error) {
    return <div style={{ padding: 20 }}>Error: {error}</div>
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Supabase conectado</h1>

      <section style={{ marginTop: 24 }}>
        <h2>Misiones</h2>
        <ul>
          {missions.map((mission) => (
            <li key={mission.id}>
              {mission.title} — {mission.xp_reward} XP / {mission.coin_reward} monedas
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Tienda</h2>
        <ul>
          {shopItems.map((item) => (
            <li key={item.id}>
              {item.icon ?? '🧩'} {item.name} —{' '}
              {item.price !== null ? `${item.price} monedas` : 'sin precio'} —{' '}
              categoría: {item.category}
              {item.required_level !== null
                ? ` — nivel requerido: ${item.required_level}`
                : ''}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}