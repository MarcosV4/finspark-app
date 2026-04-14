import Screen from '../../components/Screen'
import SavingsHeader from '../../components/ahorro/SavingsHeader'
import TotalSavingsCard from '../../components/ahorro/TotalSavingsCard'
import EmergencyFundStatus from '../../components/ahorro/EmergencyFundStatus'
import SavingsGoalsCard from '../../components/ahorro/SavingsGoalsCard'
import SavingsDistributionCard from '../../components/ahorro/SavingsDistributionCard'
import SavingsRecommendationCard from '../../components/ahorro/SavingsRecommendationCard'

export default function AhorroPage() {
  const data = {
    totalSavings: 320,
    target: 3300,
    emergencyFundCurrent: 320,
    emergencyFundGoal: 3300,
    personalGoalCurrent: 0,
    personalGoalTarget: 800,
    recommendation:
      'Ahora mismo te conviene priorizar completar tu colchón de emergencia antes de repartir más ahorro a otros objetivos.',
  }

  return (
    <Screen>
      <SavingsHeader />

      <TotalSavingsCard
        totalSavings={data.totalSavings}
        target={data.target}
      />

      <SavingsGoalsCard
        goals={[
          {
            id: 1,
            name: 'Colchón de emergencia',
            current: data.emergencyFundCurrent,
            target: data.emergencyFundGoal,
          },
          {
            id: 2,
            name: 'Objetivo personal',
            current: data.personalGoalCurrent,
            target: data.personalGoalTarget,
          },
        ]}
      />

      <SavingsDistributionCard
        emergencyFund={data.emergencyFundCurrent}
        personalGoal={data.personalGoalCurrent}
      />

      <EmergencyFundStatus
        current={data.emergencyFundCurrent}
        goal={data.emergencyFundGoal}
      />

      <SavingsRecommendationCard message={data.recommendation} />
    </Screen>
  )
}