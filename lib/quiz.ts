import { supabase } from './supabase'
import { applyProgression } from './progression'

export async function completeDailyQuiz() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    throw new Error('No user')
  }

  const userId = session.user.id

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  if (profile.last_quiz_date === todayStr) {
    return { alreadyCompleted: true }
  }

  const XP_REWARD = 25
  const COINS_REWARD = 10

  const progression = applyProgression(
    {
      level: profile.level ?? 1,
      xp: profile.xp,
      xpMax: profile.xp_max,
      coins: profile.coins,
    },
    XP_REWARD,
    COINS_REWARD
  )

  let newStreak = 1

  if (profile.last_streak_date) {
    const last = new Date(profile.last_streak_date)
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    const lastStr = last.toISOString().split('T')[0]
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    if (lastStr === yesterdayStr) {
      newStreak = profile.streak + 1
    } else if (lastStr === todayStr) {
      newStreak = profile.streak
    } else {
      newStreak = 1
    }
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      level: progression.level,
      level_label: `Nivel ${progression.level}`,
      xp: progression.xp,
      xp_max: progression.xpMax,
      coins: progression.coins,
      streak: newStreak,
      last_quiz_date: todayStr,
      last_streak_date: todayStr,
    })
    .eq('id', userId)

  if (updateError) throw updateError

  return {
    alreadyCompleted: false,
    xp: XP_REWARD,
    coins: COINS_REWARD,
    streak: newStreak,
    leveledUp: progression.leveledUp,
    newLevel: progression.newLevel,
    levelsGained: progression.levelsGained,
  }
}