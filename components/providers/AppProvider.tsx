'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { loadAppData } from '../../lib/loadAppData'

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

type EquippedItemsUpdate = {
  hat_item_id?: number | null
  glasses_item_id?: number | null
  outfit_item_id?: number | null
}

type AppState = {
  user: User
  missions: Mission[]
  shopItems: ShopItem[]
  equippedItems: EquippedItems
  toggleMission: (id: number) => Promise<void>
  rewardUser: (xp: number, coins: number) => Promise<void>
  buyItem: (id: number, price: number) => Promise<void>
  equipItem: (id: number) => Promise<void>
  refreshAppData: () => Promise<void>
}

const AppContext = createContext<AppState | undefined>(undefined)

const emptyUser: User = {
  name: '',
  levelLabel: '',
  xp: 0,
  xpMax: 1000,
  coins: 0,
  streak: 0,
  completedMissions: 0,
}

export function AppProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User>(emptyUser)
  const [missions, setMissions] = useState<Mission[]>([])
  const [shopItems, setShopItems] = useState<ShopItem[]>([])
  const [equippedItems, setEquippedItems] = useState<EquippedItems>({})
  const [isHydrated, setIsHydrated] = useState(false)

  async function refreshAppData() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) return

    try {
      const data = await loadAppData(session.user.id)
      setUser(data.user)
      setMissions(data.missions)
      setShopItems(data.shopItems)
      setEquippedItems(data.equippedItems)
    } catch (error) {
      console.error('Error refreshing app data:', error)
    }
  }

  useEffect(() => {
    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        setIsHydrated(true)
        return
      }

      try {
        await refreshAppData()
      } finally {
        setIsHydrated(true)
      }
    }

    init()
  }, [])

  async function updateProfileInDb(nextUser: User) {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      throw new Error('No authenticated user found while updating profile')
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: nextUser.name,
        level_label: nextUser.levelLabel,
        xp: nextUser.xp,
        xp_max: nextUser.xpMax,
        coins: nextUser.coins,
        streak: nextUser.streak,
        completed_missions: nextUser.completedMissions,
      })
      .eq('id', session.user.id)

    if (error) {
      throw new Error(`Error updating profile: ${error.message}`)
    }
  }

  async function rewardUser(xp: number, coins: number) {
    const nextUser = {
      ...user,
      xp: Math.min(user.xp + xp, user.xpMax),
      coins: user.coins + coins,
    }

    setUser(nextUser)
    await updateProfileInDb(nextUser)
  }

  async function toggleMission(id: number) {
    const mission = missions.find((m) => m.id === id)
    if (!mission) return

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) return

    const newDone = !mission.done

    const { error: missionError } = await supabase
      .from('user_missions')
      .update({ done: newDone })
      .eq('user_id', session.user.id)
      .eq('mission_id', id)

    if (missionError) {
      console.error('Error updating mission:', missionError)
      return
    }

    const nextMissions = missions.map((m) =>
      m.id === id ? { ...m, done: newDone } : m
    )

    const nextUser = newDone
      ? {
          ...user,
          xp: Math.min(user.xp + mission.xpReward, user.xpMax),
          coins: user.coins + mission.coinReward,
          completedMissions: user.completedMissions + 1,
        }
      : {
          ...user,
          xp: Math.max(user.xp - mission.xpReward, 0),
          coins: Math.max(user.coins - mission.coinReward, 0),
          completedMissions: Math.max(user.completedMissions - 1, 0),
        }

    setMissions(nextMissions)
    setUser(nextUser)

    try {
      await updateProfileInDb(nextUser)
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Error updating profile')
    }
  }

  async function buyItem(id: number, price: number) {
    const item = shopItems.find((i) => i.id === id)
    if (!item || item.owned) return
    if (user.coins < price) return

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) return

    const { error: shopError } = await supabase
      .from('user_shop_items')
      .update({ owned: true })
      .eq('user_id', session.user.id)
      .eq('shop_item_id', id)

    if (shopError) {
      console.error('Error buying item:', shopError)
      return
    }

    const nextShopItems = shopItems.map((i) =>
      i.id === id ? { ...i, owned: true } : i
    )

    const nextUser = {
      ...user,
      coins: user.coins - price,
    }

    setShopItems(nextShopItems)
    setUser(nextUser)

    try {
      await updateProfileInDb(nextUser)
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Error updating profile')
    }
  }

  async function equipItem(id: number) {
    const item = shopItems.find((i) => i.id === id)
    if (!item || !item.owned) return

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) return

    const nextEquippedItems: EquippedItems = { ...equippedItems }
    const updatePayload: EquippedItemsUpdate = {}

    if (id === 1) {
      const nextHat = equippedItems.hat === id ? undefined : id
      nextEquippedItems.hat = nextHat
      updatePayload.hat_item_id = nextHat ?? null
    }

    if (id === 2) {
      const nextGlasses = equippedItems.glasses === id ? undefined : id
      nextEquippedItems.glasses = nextGlasses
      updatePayload.glasses_item_id = nextGlasses ?? null
    }

    if (id === 3) {
      const nextOutfit = equippedItems.outfit === id ? undefined : id
      nextEquippedItems.outfit = nextOutfit
      updatePayload.outfit_item_id = nextOutfit ?? null
    }

    const { error: equipError } = await supabase
      .from('user_equipped_items')
      .update(updatePayload)
      .eq('user_id', session.user.id)

    if (equipError) {
      console.error('Error equipping item:', equipError)
      return
    }

    setEquippedItems(nextEquippedItems)
  }

  if (!isHydrated) {
    return null
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
        refreshAppData,
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