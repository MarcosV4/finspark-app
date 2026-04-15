import { supabase } from './supabase'

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

  const profile = profileResult.data

  const userMissionRows = (userMissionsResult.data ?? []) as unknown as UserMissionRow[]
  const userShopItemRows = (userShopItemsResult.data ?? []) as UserShopItemRow[]

  const missions = userMissionRows.map((row) => {
    const mission = Array.isArray(row.missions)
      ? row.missions[0]
      : row.missions

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

  const user = {
    name: profile.display_name,
    levelLabel: profile.level_label,
    xp: profile.xp,
    xpMax: profile.xp_max,
    coins: profile.coins,
    streak: profile.streak,
    completedMissions: profile.completed_missions,
  }

  return {
    user,
    missions,
    shopItems,
    equippedItems,
  }
}