import { supabase } from './supabase'
import { getLevelLabel } from './progression'

type MissionRelationRow = {
  id: number
  title: string
  xp_reward: number
  coin_reward: number
}

type UserMissionRow = {
  id: number
  done: boolean
  mission_id: number
  missions: MissionRelationRow | MissionRelationRow[]
}

type UserShopItemRow = {
  id: number
  owned: boolean
  shop_item_id: number
}

export async function loadAppData(userId: string) {
  const [
    profileResult,
    userMissionsResult,
    userShopItemsResult,
    equippedItemsResult,
    financialProfileResult,
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase
      .from('user_missions')
      .select(
        `
        id,
        done,
        mission_id,
        missions (
          id,
          title,
          xp_reward,
          coin_reward
        )
      `
      )
      .eq('user_id', userId)
      .order('mission_id', { ascending: true }),
    supabase
      .from('user_shop_items')
      .select(
        `
        id,
        owned,
        shop_item_id
      `
      )
      .eq('user_id', userId)
      .order('shop_item_id', { ascending: true }),
    supabase
      .from('user_equipped_items')
      .select('*')
      .eq('user_id', userId)
      .single(),
    supabase
      .from('financial_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(),
  ])

  if (profileResult.error) {
    throw new Error(`Profile load error: ${profileResult.error.message}`)
  }

  if (userMissionsResult.error) {
    throw new Error(`User missions load error: ${userMissionsResult.error.message}`)
  }

  if (userShopItemsResult.error) {
    throw new Error(`User shop items load error: ${userShopItemsResult.error.message}`)
  }

  if (equippedItemsResult.error) {
    throw new Error(`Equipped items load error: ${equippedItemsResult.error.message}`)
  }

  if (financialProfileResult.error) {
    throw new Error(`Financial profile load error: ${financialProfileResult.error.message}`)
  }

  const profile = profileResult.data

  const userMissionRows = (userMissionsResult.data ?? []) as unknown as UserMissionRow[]
  const userShopItemRows = (userShopItemsResult.data ?? []) as UserShopItemRow[]

  const missions = userMissionRows.map((row) => {
    const mission = Array.isArray(row.missions) ? row.missions[0] : row.missions

    return {
      id: row.mission_id,
      title: mission?.title ?? 'Misión',
      done: row.done,
      xpReward: mission?.xp_reward ?? 0,
      coinReward: mission?.coin_reward ?? 0,
    }
  })

  const shopItems = userShopItemRows.map((row) => ({
    id: row.shop_item_id,
    owned: row.owned,
  }))

  const equippedItems = {
    hat: equippedItemsResult.data?.hat_item_id ?? undefined,
    glasses: equippedItemsResult.data?.glasses_item_id ?? undefined,
    outfit: equippedItemsResult.data?.outfit_item_id ?? undefined,
  }

  const financialRow = financialProfileResult.data

  const financialProfile = financialRow
    ? {
        age: financialRow.age,
        monthlyIncome: Number(financialRow.monthly_income ?? 0),
        monthlyExpenses: Number(financialRow.monthly_expenses ?? 0),
        monthlySavings: Number(financialRow.monthly_savings ?? 0),
        monthlyInvestment: Number(financialRow.monthly_investment ?? 0),
        badDebtTotal: Number(financialRow.bad_debt_total ?? 0),
        currentSavingsBalance: Number(financialRow.current_savings_balance ?? 0),
        currentInvestedBalance: Number(financialRow.current_invested_balance ?? 0),
        consistencyMonths: Number(financialRow.consistency_months ?? 0),
      }
    : null

  const user = {
    name: profile.display_name,
    level: profile.level ?? 1,
    levelLabel: getLevelLabel(profile.level ?? 1),
    xp: profile.xp,
    xpMax: profile.xp_max,
    coins: profile.coins,
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

  return {
    user,
    missions,
    shopItems,
    equippedItems,
    financialProfile,
  }
}