'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Mission = {
  id: number
  title: string
  done: boolean
  xpReward: number
  coinReward: number
}

type User = {
  name: string
  levelLabel: string
  xp: number
  xpMax: number
  coins: number
  streak: number
  completedMissions: number
}

type ShopItem = {
  id: number
  owned: boolean
}

type EquippedItems = {
  hat?: number
  glasses?: number
  outfit?: number
}

type AppState = {
  user: User
  missions: Mission[]
  shopItems: ShopItem[]
  equippedItems: EquippedItems
  toggleMission: (id: number) => void
  rewardUser: (xp: number, coins: number) => void
  buyItem: (id: number, price: number) => void
  equipItem: (id: number) => void
}

const AppContext = createContext<AppState | undefined>(undefined)

const STORAGE_KEY = 'finspark-app-state'

const defaultUser: User = {
  name: 'Lucía',
  levelLabel: 'Nivel 3 — Ahorrista',
  xp: 680,
  xpMax: 1000,
  coins: 245,
  streak: 7,
  completedMissions: 12,
}

const defaultMissions: Mission[] = [
  {
    id: 1,
    title: 'Transferir 50€ al colchón',
    done: false,
    xpReward: 40,
    coinReward: 20,
  },
  {
    id: 2,
    title: 'Revisar gastos de la semana',
    done: true,
    xpReward: 30,
    coinReward: 15,
  },
  {
    id: 3,
    title: 'Completar el quiz del día',
    done: false,
    xpReward: 50,
    coinReward: 25,
  },
]

const defaultShopItems: ShopItem[] = [
  { id: 1, owned: true },
  { id: 2, owned: true },
  { id: 3, owned: false },
  { id: 4, owned: false },
  { id: 5, owned: false },
  { id: 6, owned: false },
  { id: 7, owned: false },
  { id: 8, owned: false },
  { id: 9, owned: false },
]

const defaultEquippedItems: EquippedItems = {}

export function AppProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User>(defaultUser)
  const [missions, setMissions] = useState<Mission[]>(defaultMissions)
  const [shopItems, setShopItems] = useState<ShopItem[]>(defaultShopItems)
  const [equippedItems, setEquippedItems] =
    useState<EquippedItems>(defaultEquippedItems)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)

      if (saved) {
        const parsed = JSON.parse(saved) as {
          user?: User
          missions?: Mission[]
          shopItems?: ShopItem[]
          equippedItems?: EquippedItems
        }

        if (parsed.user) setUser(parsed.user)
        if (parsed.missions) setMissions(parsed.missions)
        if (parsed.shopItems) setShopItems(parsed.shopItems)
        if (parsed.equippedItems) setEquippedItems(parsed.equippedItems)
      }
    } catch (error) {
      console.error('Error loading app state from localStorage:', error)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user,
          missions,
          shopItems,
          equippedItems,
        })
      )
    } catch (error) {
      console.error('Error saving app state to localStorage:', error)
    }
  }, [user, missions, shopItems, equippedItems, isHydrated])

  function rewardUser(xp: number, coins: number) {
    setUser((prev) => ({
      ...prev,
      xp: Math.min(prev.xp + xp, prev.xpMax),
      coins: prev.coins + coins,
    }))
  }

  function toggleMission(id: number) {
    const mission = missions.find((m) => m.id === id)
    if (!mission) return

    setMissions((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              done: !m.done,
            }
          : m
      )
    )

    setUser((prev) => {
      if (mission.done) {
        return {
          ...prev,
          xp: Math.max(prev.xp - mission.xpReward, 0),
          coins: Math.max(prev.coins - mission.coinReward, 0),
          completedMissions: Math.max(prev.completedMissions - 1, 0),
        }
      }

      return {
        ...prev,
        xp: Math.min(prev.xp + mission.xpReward, prev.xpMax),
        coins: prev.coins + mission.coinReward,
        completedMissions: prev.completedMissions + 1,
      }
    })
  }

  function buyItem(id: number, price: number) {
    const item = shopItems.find((i) => i.id === id)
    if (!item || item.owned) return
    if (user.coins < price) return

    setUser((prev) => ({
      ...prev,
      coins: prev.coins - price,
    }))

    setShopItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, owned: true } : i))
    )
  }

  function equipItem(id: number) {
  const item = shopItems.find((i) => i.id === id)
  if (!item || !item.owned) return

  if (id === 1) {
    setEquippedItems((prev) => ({
      ...prev,
      hat: prev.hat === id ? undefined : id,
    }))
  }

  if (id === 2) {
    setEquippedItems((prev) => ({
      ...prev,
      glasses: prev.glasses === id ? undefined : id,
    }))
  }

  if (id === 3) {
    setEquippedItems((prev) => ({
      ...prev,
      outfit: prev.outfit === id ? undefined : id,
    }))
  }
}

  return (
    <AppContext.Provider
      value={{
        user,
        missions,
        shopItems,
        equippedItems,
        toggleMission,
        rewardUser,
        buyItem,
        equipItem,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider')
  }

  return context
}