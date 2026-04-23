export type MoneyScoreInput = {
  monthlyIncome: number
  monthlyExpenses: number
  monthlySavings: number
  monthlyInvestment: number
  badDebtTotal: number
  consistencyMonths: number
}

export type LeagueResult = {
  key: string
  name: string
  division: string
  label: string
}

export type MoneyScoreBreakdown = {
  savingsRatePoints: number
  debtControlPoints: number
  investmentPoints: number
  expenseRatioPoints: number
  consistencyPoints: number
}

export type MoneyScoreResult = {
  realScore: number
  displayedScore: number
  breakdown: MoneyScoreBreakdown
  league: LeagueResult
}

type LeagueRange = {
  min: number
  max: number
  key: string
  name: string
  division: string
  label: string
}

const LEAGUE_TABLE: LeagueRange[] = [
  { min: 0, max: 5, key: 'bronze-v', name: 'Bronce', division: 'V', label: 'Bronce V' },
  { min: 6, max: 11, key: 'bronze-iv', name: 'Bronce', division: 'IV', label: 'Bronce IV' },
  { min: 12, max: 17, key: 'bronze-iii', name: 'Bronce', division: 'III', label: 'Bronce III' },
  { min: 18, max: 23, key: 'bronze-ii', name: 'Bronce', division: 'II', label: 'Bronce II' },
  { min: 24, max: 29, key: 'bronze-i', name: 'Bronce', division: 'I', label: 'Bronce I' },

  { min: 30, max: 32, key: 'silver-v', name: 'Plata', division: 'V', label: 'Plata V' },
  { min: 33, max: 35, key: 'silver-iv', name: 'Plata', division: 'IV', label: 'Plata IV' },
  { min: 36, max: 38, key: 'silver-iii', name: 'Plata', division: 'III', label: 'Plata III' },
  { min: 39, max: 41, key: 'silver-ii', name: 'Plata', division: 'II', label: 'Plata II' },
  { min: 42, max: 44, key: 'silver-i', name: 'Plata', division: 'I', label: 'Plata I' },

  { min: 45, max: 47, key: 'gold-v', name: 'Oro', division: 'V', label: 'Oro V' },
  { min: 48, max: 50, key: 'gold-iv', name: 'Oro', division: 'IV', label: 'Oro IV' },
  { min: 51, max: 53, key: 'gold-iii', name: 'Oro', division: 'III', label: 'Oro III' },
  { min: 54, max: 56, key: 'gold-ii', name: 'Oro', division: 'II', label: 'Oro II' },
  { min: 57, max: 59, key: 'gold-i', name: 'Oro', division: 'I', label: 'Oro I' },

  { min: 60, max: 62, key: 'platinum-v', name: 'Platino', division: 'V', label: 'Platino V' },
  { min: 63, max: 65, key: 'platinum-iv', name: 'Platino', division: 'IV', label: 'Platino IV' },
  { min: 66, max: 68, key: 'platinum-iii', name: 'Platino', division: 'III', label: 'Platino III' },
  { min: 69, max: 70, key: 'platinum-ii', name: 'Platino', division: 'II', label: 'Platino II' },
  { min: 71, max: 72, key: 'platinum-i', name: 'Platino', division: 'I', label: 'Platino I' },

  { min: 73, max: 75, key: 'emerald-v', name: 'Esmeralda', division: 'V', label: 'Esmeralda V' },
  { min: 76, max: 77, key: 'emerald-iv', name: 'Esmeralda', division: 'IV', label: 'Esmeralda IV' },
  { min: 78, max: 80, key: 'emerald-iii', name: 'Esmeralda', division: 'III', label: 'Esmeralda III' },
  { min: 81, max: 82, key: 'emerald-ii', name: 'Esmeralda', division: 'II', label: 'Esmeralda II' },
  { min: 83, max: 84, key: 'emerald-i', name: 'Esmeralda', division: 'I', label: 'Esmeralda I' },

  { min: 85, max: 87, key: 'diamond-v', name: 'Diamante', division: 'V', label: 'Diamante V' },
  { min: 88, max: 90, key: 'diamond-iv', name: 'Diamante', division: 'IV', label: 'Diamante IV' },
  { min: 91, max: 93, key: 'diamond-iii', name: 'Diamante', division: 'III', label: 'Diamante III' },
  { min: 94, max: 96, key: 'diamond-ii', name: 'Diamante', division: 'II', label: 'Diamante II' },
  { min: 97, max: 100, key: 'diamond-i', name: 'Diamante', division: 'I', label: 'Diamante I' },
]

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)))
}

function safePercent(amount: number, income: number) {
  if (income <= 0) return 0
  return (amount / income) * 100
}

function getSavingsRatePoints(monthlySavings: number, monthlyIncome: number) {
  const pct = safePercent(monthlySavings, monthlyIncome)

  if (pct <= 0) return 0
  if (pct < 5) return 5
  if (pct < 10) return 10
  if (pct < 15) return 18
  if (pct < 20) return 22
  if (pct < 30) return 26
  return 30
}

function getDebtControlPoints(badDebtTotal: number, monthlyIncome: number) {
  if (badDebtTotal <= 0) return 25
  if (monthlyIncome <= 0) return 5

  const ratio = badDebtTotal / monthlyIncome

  if (ratio < 1) return 20
  if (ratio <= 3) return 15
  if (ratio <= 6) return 10
  return 5
}

function getInvestmentPoints(monthlyInvestment: number, monthlyIncome: number) {
  const pct = safePercent(monthlyInvestment, monthlyIncome)

  if (pct <= 0) return 0
  if (pct < 1) return 4
  if (pct < 5) return 8
  if (pct < 10) return 14
  if (pct < 15) return 18
  return 20
}

function getExpenseRatioPoints(monthlyExpenses: number, monthlyIncome: number) {
  if (monthlyIncome <= 0) {
    return monthlyExpenses <= 0 ? 15 : 0
  }

  const ratioPct = (monthlyExpenses / monthlyIncome) * 100

  if (ratioPct < 50) return 15
  if (ratioPct < 70) return 12
  if (ratioPct < 85) return 8
  if (ratioPct < 100) return 4
  return 0
}

function getConsistencyPoints(consistencyMonths: number) {
  if (consistencyMonths <= 0) return 0
  if (consistencyMonths === 1) return 2
  if (consistencyMonths === 2) return 3
  if (consistencyMonths <= 5) return 5
  if (consistencyMonths <= 11) return 8
  return 10
}

export function getLeagueFromScore(score: number): LeagueResult {
  const normalized = clampScore(score)

  const match =
    LEAGUE_TABLE.find((league) => normalized >= league.min && normalized <= league.max) ??
    LEAGUE_TABLE[0]

  return {
    key: match.key,
    name: match.name,
    division: match.division,
    label: match.label,
  }
}

export function smoothDisplayedScore(previousDisplayedScore: number, realScore: number) {
  if (realScore >= previousDisplayedScore) {
    return clampScore(realScore)
  }

  return clampScore(
    Math.max(realScore, Math.round(0.7 * previousDisplayedScore + 0.3 * realScore))
  )
}

export function calculateMoneyScore(
  input: MoneyScoreInput,
  previousDisplayedScore?: number | null
): MoneyScoreResult {
  const breakdown: MoneyScoreBreakdown = {
    savingsRatePoints: getSavingsRatePoints(input.monthlySavings, input.monthlyIncome),
    debtControlPoints: getDebtControlPoints(input.badDebtTotal, input.monthlyIncome),
    investmentPoints: getInvestmentPoints(input.monthlyInvestment, input.monthlyIncome),
    expenseRatioPoints: getExpenseRatioPoints(input.monthlyExpenses, input.monthlyIncome),
    consistencyPoints: getConsistencyPoints(input.consistencyMonths),
  }

  const realScore = clampScore(
    breakdown.savingsRatePoints +
      breakdown.debtControlPoints +
      breakdown.investmentPoints +
      breakdown.expenseRatioPoints +
      breakdown.consistencyPoints
  )

  const displayedScore =
    previousDisplayedScore === null || previousDisplayedScore === undefined
      ? realScore
      : smoothDisplayedScore(previousDisplayedScore, realScore)

  return {
    realScore,
    displayedScore,
    breakdown,
    league: getLeagueFromScore(displayedScore),
  }
}

export function calculateInitialMoneyScore(input: MoneyScoreInput): MoneyScoreResult {
  const baseResult = calculateMoneyScore(input, null)

  const initialDisplayedScore = Math.max(10, baseResult.displayedScore)

  return {
    ...baseResult,
    displayedScore: initialDisplayedScore,
    league: getLeagueFromScore(initialDisplayedScore),
  }
}