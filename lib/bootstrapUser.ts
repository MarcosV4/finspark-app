import { supabase } from './supabase'

type MissionRow = {
  id: number
}

type ShopItemRow = {
  id: number
}

export async function bootstrapUser(userId: string, email?: string | null) {
  const { data: existingProfile, error: profileCheckError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle()

  if (profileCheckError) {
    throw new Error(`Error checking profile: ${profileCheckError.message}`)
  }

  if (!existingProfile) {
    const { error: insertProfileError } = await supabase.from('profiles').insert({
      id: userId,
      display_name: email?.split('@')[0] || 'Usuario',
      pet_name: 'Porkio',
      level_label: 'Nivel 1 — Novato',
      xp: 0,
      xp_max: 1000,
      coins: 0,
      streak: 0,
      completed_missions: 0,
    })

    if (insertProfileError) {
      throw new Error(`Error creating profile: ${insertProfileError.message}`)
    }

    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select('id')
      .eq('is_active', true)

    if (missionsError) {
      throw new Error(`Error loading missions: ${missionsError.message}`)
    }

    if (missions && missions.length > 0) {
      const userMissions = missions.map((mission: MissionRow) => ({
        user_id: userId,
        mission_id: mission.id,
        done: false,
      }))

      const { error: insertUserMissionsError } = await supabase
        .from('user_missions')
        .insert(userMissions)

      if (insertUserMissionsError) {
        throw new Error(
          `Error creating user missions: ${insertUserMissionsError.message}`
        )
      }
    }

    const { data: shopItems, error: shopItemsError } = await supabase
      .from('shop_items')
      .select('id')

    if (shopItemsError) {
      throw new Error(`Error loading shop items: ${shopItemsError.message}`)
    }

    if (shopItems && shopItems.length > 0) {
      const userShopItems = shopItems.map((item: ShopItemRow) => ({
        user_id: userId,
        shop_item_id: item.id,
        owned: item.id === 1 || item.id === 2,
      }))

      const { error: insertUserShopItemsError } = await supabase
        .from('user_shop_items')
        .insert(userShopItems)

      if (insertUserShopItemsError) {
        throw new Error(
          `Error creating user shop items: ${insertUserShopItemsError.message}`
        )
      }
    }

    const { error: equippedItemsError } = await supabase
      .from('user_equipped_items')
      .insert({
        user_id: userId,
        hat_item_id: null,
        glasses_item_id: null,
        outfit_item_id: null,
      })

    if (equippedItemsError) {
      throw new Error(
        `Error creating equipped items: ${equippedItemsError.message}`
      )
    }
  }
}