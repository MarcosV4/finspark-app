export type ProgressionInput = {
  level: number
  xp: number
  xpMax: number
  coins: number
}

export type ProgressionResult = {
  level: number
  xp: number
  xpMax: number
  coins: number
  leveledUp: boolean
  newLevel: number
  levelsGained: number
}

export function getXpMax(level: number) {
  return 100 + (level - 1) * 50
}

export function getLevelLabel(level: number) {
  return `Nivel ${level}`
}

export function applyProgression(
  current: ProgressionInput,
  xpReward: number,
  coinReward: number
): ProgressionResult {
  let nextLevel = current.level
  let nextXp = current.xp + xpReward
  let nextXpMax = current.xpMax || getXpMax(current.level)
  let levelsGained = 0

  while (nextXp >= nextXpMax) {
    nextXp -= nextXpMax
    nextLevel += 1
    nextXpMax = getXpMax(nextLevel)
    levelsGained += 1
  }

  return {
    level: nextLevel,
    xp: nextXp,
    xpMax: nextXpMax,
    coins: current.coins + coinReward,
    leveledUp: levelsGained > 0,
    newLevel: nextLevel,
    levelsGained,
  }
}