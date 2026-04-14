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
  return (
    <section style={{ marginBottom: '20px' }}>
      <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>
        Misiones
      </h2>

      {missions.map((m) => (
        <button
          key={m.id}
          onClick={() => onToggleMission(m.id)}
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
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: '14px' }}>{m.title}</span>

          <span style={{ fontSize: '18px' }}>
            {m.done ? '✅' : '⬜'}
          </span>
        </button>
      ))}
    </section>
  )
}