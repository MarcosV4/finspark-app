import { supabase } from './supabase'
import { calculateInitialMoneyScore } from './moneyScore'
import {
  assignFinancialCompanion,
  type MotivationAnswer,
} from './financialCompanion'

export type CompleteOnboardingInput = {
  displayName: string
  age: number
  monthlyIncome: number
  monthlyExpenses: number
  monthlySavings: number
  monthlyInvestment: number
  badDebtTotal: number
  currentSavingsBalance: number
  currentInvestedBalance: number

  riskAnswer: 1 | 2 | 3 | 4
  disciplineAnswer: 1 | 2 | 3 | 4
  motivationAnswer: MotivationAnswer
  emotionAnswer: 1 | 2 | 3 | 4 | 5
}

export async function completeOnboarding(
  userId: string,
  input: CompleteOnboardingInput
) {
  console.log('[onboarding] start completeOnboarding', { userId, input })

  const scoreResult = calculateInitialMoneyScore({
    monthlyIncome: input.monthlyIncome,
    monthlyExpenses: input.monthlyExpenses,
    monthlySavings: input.monthlySavings,
    monthlyInvestment: input.monthlyInvestment,
    badDebtTotal: input.badDebtTotal,
    consistencyMonths: 0,
  })

  console.log('[onboarding] score calculated', scoreResult)

  const companion = assignFinancialCompanion({
    riskAnswer: input.riskAnswer,
    disciplineAnswer: input.disciplineAnswer,
    motivationAnswer: input.motivationAnswer,
    emotionAnswer: input.emotionAnswer,
    monthlyIncome: input.monthlyIncome,
    monthlyExpenses: input.monthlyExpenses,
    monthlySavings: input.monthlySavings,
    monthlyInvestment: input.monthlyInvestment,
    badDebtTotal: input.badDebtTotal,
    displayedScore: scoreResult.displayedScore,
  })

  console.log('[onboarding] companion assigned', companion)

  const financialPayload = {
    user_id: userId,
    age: input.age,
    monthly_income: input.monthlyIncome,
    monthly_expenses: input.monthlyExpenses,
    monthly_savings: input.monthlySavings,
    monthly_investment: input.monthlyInvestment,
    bad_debt_total: input.badDebtTotal,
    current_savings_balance: input.currentSavingsBalance,
    current_invested_balance: input.currentInvestedBalance,
    consistency_months: 0,
  }

  console.log('[onboarding] checking financial_profiles existing row...')
  const existingFinancialProfileResponse = await supabase
    .from('financial_profiles')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()

  console.log(
    '[onboarding] financial_profiles existing row response',
    existingFinancialProfileResponse
  )

  if (existingFinancialProfileResponse.error) {
    throw new Error(
      `Error checking financial profile: ${existingFinancialProfileResponse.error.message}`
    )
  }

  if (existingFinancialProfileResponse.data) {
    console.log('[onboarding] updating financial_profiles...')
    const updateFinancialProfileResponse = await supabase
      .from('financial_profiles')
      .update(financialPayload)
      .eq('user_id', userId)

    console.log(
      '[onboarding] financial_profiles update response',
      updateFinancialProfileResponse
    )

    if (updateFinancialProfileResponse.error) {
      throw new Error(
        `Error updating financial profile: ${updateFinancialProfileResponse.error.message}`
      )
    }
  } else {
    console.log('[onboarding] inserting financial_profiles...')
    const insertFinancialProfileResponse = await supabase
      .from('financial_profiles')
      .insert(financialPayload)

    console.log(
      '[onboarding] financial_profiles insert response',
      insertFinancialProfileResponse
    )

    if (insertFinancialProfileResponse.error) {
      throw new Error(
        `Error inserting financial profile: ${insertFinancialProfileResponse.error.message}`
      )
    }
  }

  console.log('[onboarding] updating profile...')
  const profileResponse = await supabase
    .from('profiles')
    .update({
      display_name: input.displayName,
      has_completed_onboarding: true,
      money_score: scoreResult.displayedScore,
      money_score_real: scoreResult.realScore,
      league_key: scoreResult.league.key,
      league_name: scoreResult.league.name,
      league_division: scoreResult.league.division,
      pet_key: companion.key,
      pet_name: companion.name,
      pet_description: companion.description,
      onboarding_risk_answer: input.riskAnswer,
      onboarding_discipline_answer: input.disciplineAnswer,
      onboarding_motivation_answer: input.motivationAnswer,
      onboarding_emotion_answer: input.emotionAnswer,
    })
    .eq('id', userId)

  console.log('[onboarding] profile update response', profileResponse)

  if (profileResponse.error) {
    throw new Error(`Error updating profile: ${profileResponse.error.message}`)
  }

  console.log('[onboarding] completeOnboarding success')

  return {
    scoreResult,
    companion,
  }
}