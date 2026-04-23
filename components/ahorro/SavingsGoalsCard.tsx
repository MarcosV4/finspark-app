type Goal = {
  id: number
  name: string
  current: number
  target: number
}

type Props = {
  goals: Goal[]
}

export default function SavingsGoalsCard({ goals }: Props) {
  return (
    <section
      style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid #e5e5e5',
        marginBottom: '16px',
      }}
    >
      <h2 style={{ margin: '0 0 14px 0', fontSize: '18px' }}>
        Objetivos de ahorro
      </h2>

      {goals.map((goal) => {
        const progress = Math.min((goal.current / goal.target) * 100, 100)

        return (
          <div
            key={goal.id}
            style={{
              padding: '12px 0',
              borderBottom:
                goal.id !== goals[goals.length - 1].id
                  ? '1px solid #f0f0f0'
                  : 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontWeight: 600 }}>{goal.name}</span>
              <span style={{ color: '#666', fontSize: '14px' }}>
                €{goal.current} / €{goal.target}
              </span>
            </div>

            <div
              style={{
                width: '100%',
                height: '8px',
                background: '#ececec',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: '#3d8cff',
                }}
              />
            </div>
          </div>
        )
      })}
    </section>
  )
}