import { supabase } from './supabase'

export async function completeDailyQuiz() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    throw new Error('No user')
  }

  const userId = session.user.id

  // 1. traer profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('last_quiz_date, xp, coins, xp_max')
    .eq('id', userId)
    .single()

  if (error) throw error

  const today = new Date().toISOString().split('T')[0]

  // 2. si ya lo hizo hoy → no reward
  if (profile.last_quiz_date === today) {
    return {
      alreadyCompleted: true,
    }
  }

  // 3. calcular recompensas
  const XP_REWARD = 25
  const COINS_REWARD = 10

  const newXp = Math.min(profile.xp + XP_REWARD, profile.xp_max)
  const newCoins = profile.coins + COINS_REWARD

  // 4. actualizar profile
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      xp: newXp,
      coins: newCoins,
      last_quiz_date: today,
    })
    .eq('id', userId)

  if (updateError) throw updateError

  return {
    alreadyCompleted: false,
    xp: XP_REWARD,
    coins: COINS_REWARD,
  }
}