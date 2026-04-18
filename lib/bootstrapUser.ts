import { supabase } from './supabase'
import { getXpMax, getLevelLabel } from './progression'

export async function bootstrapUser(userId: string, email?: string | null) {
  if (!userId) {
    throw new Error('bootstrapUser: userId is required')
  }

  // 1. Verificar si el perfil ya existe
  const { data: existingProfile, error: profileCheckError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle()

  if (profileCheckError) {
    throw new Error(`Error checking profile: ${profileCheckError.message}`)
  }

  if (existingProfile) {
    // Ya está bootstrappeado
    return
  }

  // 2. Crear perfil base
  const initialLevel = 1

  const { error: insertProfileError } = await supabase.from('profiles').insert({
    id: userId,
    display_name: email?.split('@')[0] || 'Usuario',
    pet_name: 'Porkio',

    level: initialLevel,
    level_label: getLevelLabel(initialLevel),
    xp: 0,
    xp_max: getXpMax(initialLevel),
    coins: 0,

    streak: 0,
    last_streak_date: null,
    completed_missions: 0,

    // 👇 onboarding
    has_completed_onboarding: false,

    // 👇 money score inicial
    money_score: 10,
    money_score_real: 0,
    league_key: 'bronze-iv',
    league_name: 'Bronce',
    league_division: 'IV',
  })

  if (insertProfileError) {
    throw new Error(`Error inserting profile: ${insertProfileError.message}`)
  }

  // 3. Inicializar misiones
  const { data: missions, error: missionsError } = await supabase
    .from('missions')
    .select('id')

  if (missionsError) {
    throw new Error(`Error loading missions: ${missionsError.message}`)
  }

  if (missions && missions.length > 0) {
    const userMissions = missions.map((mission) => ({
      user_id: userId,
      mission_id: mission.id,
      done: false,
    }))

    const { error: insertUserMissionsError } = await supabase
      .from('user_missions')
      .insert(userMissions)

    if (insertUserMissionsError) {
      throw new Error(
        `Error inserting user missions: ${insertUserMissionsError.message}`
      )
    }
  }

  // 4. Inicializar shop items
  const { data: shopItems, error: shopError } = await supabase
    .from('shop_items')
    .select('id')

  if (shopError) {
    throw new Error(`Error loading shop items: ${shopError.message}`)
  }

  if (shopItems && shopItems.length > 0) {
    const userShopItems = shopItems.map((item) => ({
      user_id: userId,
      shop_item_id: item.id,
      owned: false,
    }))

    const { error: insertUserShopItemsError } = await supabase
      .from('user_shop_items')
      .insert(userShopItems)

    if (insertUserShopItemsError) {
      throw new Error(
        `Error inserting user shop items: ${insertUserShopItemsError.message}`
      )
    }
  }

  // 5. Inicializar equipamiento
  const { error: equippedError } = await supabase
    .from('user_equipped_items')
    .insert({
      user_id: userId,
      hat_item_id: null,
      glasses_item_id: null,
      outfit_item_id: null,
    })

  if (equippedError) {
    throw new Error(
      `Error inserting equipped items: ${equippedError.message}`
    )
  }
}