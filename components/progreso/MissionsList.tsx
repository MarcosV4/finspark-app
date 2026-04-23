type Mission = {
  id: number
  title: string
  done: boolean
}

type Props = {
  missions: Mission[]
  onToggleMission: (id: number) => void
}

export default function MissionsList({
  missions,
  onToggleMission,
}: Props) {
  const QUIZ_MISSION_ID = 3

  return (
    <section style={{ marginBottom: '20px' }}>
      <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>
        Misiones
      </h2>

      {missions.map((mission) => {
        const isAutomaticQuizMission = mission.id === QUIZ_MISSION_ID

        return (
          <button
            key={mission.id}
            onClick={() => {
              if (isAutomaticQuizMission) return
              onToggleMission(mission.id)
            }}
            style={{
              width: '100%',
              background: '#fff',
              borderRadius: '14px',
              padding: '14px',
              border: '1px solid #e5e5e5',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: isAutomaticQuizMission ? 'default' : 'pointer',
              textAlign: 'left',
              opacity: isAutomaticQuizMission ? 0.85 : 1,
            }}
          >
            <div>
              <span style={{ fontSize: '14px', display: 'block' }}>
                {mission.title}
              </span>

              {isAutomaticQuizMission && (
                <span
                  style={{
                    fontSize: '12px',
                    color: '#666',
                    display: 'block',
                    marginTop: '4px',
                  }}
                >
                  Se completa automáticamente
                </span>
              )}
            </div>

            <span style={{ fontSize: '18px' }}>
              {mission.done ? '✅' : '⬜'}
            </span>
          </button>
        )
      })}
    </section>
  )
}