'use client'

import Screen from '../../components/Screen'
import ProgressHeader from '../../components/progreso/ProgressHeader'
import DailyProgress from '../../components/progreso/DailyProgress'
import MissionsList from '../../components/progreso/MissionsList'
import QuizCard from '../../components/progreso/QuizCard'
import { useAppContext } from '../../components/providers/AppProvider'

export default function ProgresoPage() {
  const { missions, toggleMission } = useAppContext()

  const completed = missions.filter((m) => m.done).length

  return (
    <Screen>
      <ProgressHeader />

      <DailyProgress completed={completed} total={missions.length} />

      <MissionsList
        missions={missions}
        onToggleMission={toggleMission}
      />

      <QuizCard />
    </Screen>
  )
}