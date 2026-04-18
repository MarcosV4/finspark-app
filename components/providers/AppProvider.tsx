'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { loadAppData } from '../../lib/loadAppData'
import { applyProgression, getLevelLabel } from '../../lib/progression'

type Mission = {
  id: number
  title: string
  done: boolean
  xpReward: number
  coinReward: number
}

type User = {
  name: string
  level: number
  levelLabel: string
  xp: number
  xpMax: number
  coins: number
  streak: number
  lastStreakDate: string | null
  completedMissions: number
  hasCompletedOnboarding: boolean
  moneyScore: number
  moneyScoreReal: number
  leagueKey: string
  leagueName: string
  leagueDivision: string
  petKey: string | null
  petName: string | null
  petDescription: string | null
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

type FinancialProfile = {
  age: number
  monthlyIncome: number
  monthlyExpenses: number
  monthlySavings: number
  monthlyInvestment: number
  badDebtTotal: number
  currentSavingsBalance: number
  currentInvestedBalance: number
  consistencyMonths: number
} | null

type AppState = {
  user: User
  visibleStreak: number
  missions: Mission[]
  shopItems: ShopItem[]
  equippedItems: EquippedItems
  financialProfile: FinancialProfile
  toggleMission: (id: number) => Promise<void>
  rewardUser: (xp: number, coins: number) => Promise<{ leveledUp: boolean; newLevel: number }>
  buyItem: (id: number, price: number) => Promise<void>
  equipItem: (id: number) => Promise<void>
  refreshAppData: () => Promise<void>
}

const AppContext = createContext<AppState | undefined>(undefined)

const emptyUser: User = {
  name: '',
  level: 1,
  levelLabel: 'Nivel 1',
  xp: 0,
  xpMax: 100,
  coins: 0,
  streak: 0,
  lastStreakDate: null,
  completedMissions: 0,
  hasCompletedOnboarding: false,
  moneyScore: 10,
  moneyScoreReal: 0,
  leagueKey: 'bronze-iv',
  leagueName: 'Bronce',
  leagueDivision: 'IV',
  petKey: null,
  petName: null,
  petDescription: null,
}

function getVisibleStreak(user: User) {
  if (!user.lastStreakDate || user.streak <= 0) return 0

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (user.lastStreakDate === todayStr || user.lastStreakDate === yesterdayStr) {
    return user.streak
  }

  return 0
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
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  async function getSessionUserId() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    return session?.user?.id ?? null
  }

  async function refreshAppData() {
    const userId = await getSessionUserId()

    if (!userId) {
      setUser(emptyUser)
      setMissions([])
      setShopItems([])
      setEquippedItems({})
      setFinancialProfile(null)
      return
    }

    try {
      const data = await loadAppData(userId)
      setUser(data.user)
      setMissions(data.missions)
      setShopItems(data.shopItems)
      setEquippedItems(data.equippedItems)
      setFinancialProfile(data.financialProfile)
    } catch (error) {
      console.error('Error refreshing app data:', error)
    }
  }

  useEffect(() => {
    async function init() {
      await refreshAppData()
      setIsHydrated(true)
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      await refreshAppData()
      setIsHydrated(true)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function getProfileRow(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      throw new Error(`Error loading profile: ${error.message}`)
    }

    return data
  }

  async function updateProfileInDbByUserId(userId: string, nextUser: User) {
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: nextUser.name,
        level: nextUser.level,
        level_label: nextUser.levelLabel,
        xp: nextUser.xp,
        xp_max: nextUser.xpMax,
        coins: nextUser.coins,
        streak: nextUser.streak,
        last_streak_date: nextUser.lastStreakDate,
        completed_missions: nextUser.completedMissions,
        has_completed_onboarding: nextUser.hasCompletedOnboarding,
        money_score: nextUser.moneyScore,
        money_score_real: nextUser.moneyScoreReal,
        league_key: nextUser.leagueKey,
        league_name: nextUser.leagueName,
        league_division: nextUser.leagueDivision,
        pet_key: nextUser.petKey,
        pet_name: nextUser.petName,
        pet_description: nextUser.petDescription,
      })
      .eq('id', userId)

    if (error) {
      throw new Error(`Error updating profile: ${error.message}`)
    }
  }

  async function rewardUser(xp: number, coins: number) {
    const userId = await getSessionUserId()
    if (!userId) {
      return { leveledUp: false, newLevel: user.level }
    }

    const profile = await getProfileRow(userId)

    const progression = applyProgression(
      {
        level: profile.level ?? 1,
        xp: profile.xp,
        xpMax: profile.xp_max,
        coins: profile.coins,
      },
      xp,
      coins
    )

    const nextUser: User = {
      name: profile.display_name,
      level: progression.level,
      levelLabel: getLevelLabel(progression.level),
      xp: progression.xp,
      xpMax: progression.xpMax,
      coins: progression.coins,
      streak: profile.streak,
      lastStreakDate: profile.last_streak_date,
      completedMissions: profile.completed_missions,
      hasCompletedOnboarding: profile.has_completed_onboarding ?? false,
      moneyScore: profile.money_score ?? 10,
      moneyScoreReal: profile.money_score_real ?? 0,
      leagueKey: profile.league_key ?? 'bronze-iv',
      leagueName: profile.league_name ?? 'Bronce',
      leagueDivision: profile.league_division ?? 'IV',
      petKey: profile.pet_key ?? null,
      petName: profile.pet_name ?? null,
      petDescription: profile.pet_description ?? null,
    }

    setUser(nextUser)
    await updateProfileInDbByUserId(userId, nextUser)

    return {
      leveledUp: progression.leveledUp,
      newLevel: progression.newLevel,
    }
  }

  async function toggleMission(id: number) {
    const mission = missions.find((m) => m.id === id)
    if (!mission) return

    const userId = await getSessionUserId()
    if (!userId) return

    const newDone = !mission.done

    const { error: missionError } = await supabase
      .from('user_missions')
      .update({ done: newDone })
      .eq('user_id', userId)
      .eq('mission_id', id)

    if (missionError) {
      console.error('Error updating mission:', missionError)
      return
    }

    const profile = await getProfileRow(userId)

    let nextUser: User

    if (newDone) {
      const progression = applyProgression(
        {
          level: profile.level ?? 1,
          xp: profile.xp,
          xpMax: profile.xp_max,
          coins: profile.coins,
        },
        mission.xpReward,
        mission.coinReward
      )

      nextUser = {
        name: profile.display_name,
        level: progression.level,
        levelLabel: getLevelLabel(progression.level),
        xp: progression.xp,
        xpMax: progression.xpMax,
        coins: progression.coins,
        streak: profile.streak,
        lastStreakDate: profile.last_streak_date,
        completedMissions: profile.completed_missions + 1,
        hasCompletedOnboarding: profile.has_completed_onboarding ?? false,
        moneyScore: profile.money_score ?? 10,
        moneyScoreReal: profile.money_score_real ?? 0,
        leagueKey: profile.league_key ?? 'bronze-iv',
        leagueName: profile.league_name ?? 'Bronce',
        leagueDivision: profile.league_division ?? 'IV',
        petKey: profile.pet_key ?? null,
        petName: profile.pet_name ?? null,
        petDescription: profile.pet_description ?? null,
      }
    } else {
      nextUser = {
        name: profile.display_name,
        level: profile.level ?? 1,
        levelLabel: getLevelLabel(profile.level ?? 1),
        xp: Math.max(profile.xp - mission.xpReward, 0),
        xpMax: profile.xp_max,
        coins: Math.max(profile.coins - mission.coinReward, 0),
        streak: profile.streak,
        lastStreakDate: profile.last_streak_date,
        completedMissions: Math.max(profile.completed_missions - 1, 0),
        hasCompletedOnboarding: profile.has_completed_onboarding ?? false,
        moneyScore: profile.money_score ?? 10,
        moneyScoreReal: profile.money_score_real ?? 0,
        leagueKey: profile.league_key ?? 'bronze-iv',
        leagueName: profile.league_name ?? 'Bronce',
        leagueDivision: profile.league_division ?? 'IV',
        petKey: profile.pet_key ?? null,
        petName: profile.pet_name ?? null,
        petDescription: profile.pet_description ?? null,
      }
    }

    const nextMissions = missions.map((m) =>
      m.id === id ? { ...m, done: newDone } : m
    )

    setMissions(nextMissions)
    setUser(nextUser)

    try {
      await updateProfileInDbByUserId(userId, nextUser)
    } catch (error) {
      console.error(error)
    }
  }

  async function buyItem(id: number, price: number) {
    const item = shopItems.find((i) => i.id === id)
    if (!item || item.owned) return
    if (user.coins < price) return

    const userId = await getSessionUserId()
    if (!userId) return

    const { error: shopError } = await supabase
      .from('user_shop_items')
      .update({ owned: true })
      .eq('user_id', userId)
      .eq('shop_item_id', id)

    if (shopError) {
      console.error('Error buying item:', shopError)
      return
    }

    const profile = await getProfileRow(userId)

    const nextUser: User = {
      name: profile.display_name,
      level: profile.level ?? 1,
      levelLabel: getLevelLabel(profile.level ?? 1),
      xp: profile.xp,
      xpMax: profile.xp_max,
      coins: profile.coins - price,
      streak: profile.streak,
      lastStreakDate: profile.last_streak_date,
      completedMissions: profile.completed_missions,
      hasCompletedOnboarding: profile.has_completed_onboarding ?? false,
      moneyScore: profile.money_score ?? 10,
      moneyScoreReal: profile.money_score_real ?? 0,
      leagueKey: profile.league_key ?? 'bronze-iv',
      leagueName: profile.league_name ?? 'Bronce',
      leagueDivision: profile.league_division ?? 'IV',
      petKey: profile.pet_key ?? null,
      petName: profile.pet_name ?? null,
      petDescription: profile.pet_description ?? null,
    }

    const nextShopItems = shopItems.map((i) =>
      i.id === id ? { ...i, owned: true } : i
    )

    setShopItems(nextShopItems)
    setUser(nextUser)

    try {
      await updateProfileInDbByUserId(userId, nextUser)
    } catch (error) {
      console.error(error)
    }
  }

  async function equipItem(id: number) {
    const item = shopItems.find((i) => i.id === id)
    if (!item || !item.owned) return

    const userId = await getSessionUserId()
    if (!userId) return

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
      .eq('user_id', userId)

    if (equipError) {
      console.error('Error equipping item:', equipError)
      return
    }

    setEquippedItems(nextEquippedItems)
  }

  const visibleStreak = getVisibleStreak(user)

  if (!isHydrated) {
    return null
  }

  return (
    <AppContext.Provider
      value={{
        user,
        visibleStreak,
        missions,
        shopItems,
        equippedItems,
        financialProfile,
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