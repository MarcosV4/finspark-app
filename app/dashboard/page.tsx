'use client'

import Screen from '../../components/Screen'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import AvailableMoneyCard from '../../components/dashboard/AvailableMoneyCard'
import StatsRow from '../../components/dashboard/StatsRow'
import EmergencyFundCard from '../../components/dashboard/EmergencyFundCard'
import LevelCard from '../../components/dashboard/LevelCard'
import { useAppContext } from '../../components/providers/AppProvider'

export default function DashboardPage() {
  const { user, visibleStreak } = useAppContext()

  const data = {
    available: 700,
    income: 1800,
    expenses: 1100,
    savings: 320,
    fixedExpensePercent: 61,
    emergencyFundCurrent: 320,
    emergencyFundGoal: 3300,
  }

  return (
    <Screen>
      <DashboardHeader
        name={user.name}
        streak={visibleStreak}
        level={user.levelLabel}
      />

      <AvailableMoneyCard available={data.available} />

      <StatsRow
        income={data.income}
        expenses={data.expenses}
        savings={data.savings}
        fixedExpensePercent={data.fixedExpensePercent}
      />

      <EmergencyFundCard
        current={data.emergencyFundCurrent}
        goal={data.emergencyFundGoal}
      />

      <LevelCard
        level={user.levelLabel}
        xp={user.xp}
        xpMax={user.xpMax}
      />
    </Screen>
  )
}