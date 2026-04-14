type LevelCardProps = {
  level: string
  xp: number
  xpMax: number
}

export default function LevelCard({
  level,
  xp,
  xpMax,
}: LevelCardProps) {
  const progress = Math.min((xp / xpMax) * 100, 100)

  return (
    <section
      style={{
        background: '#6d49ff',
        color: '#fff',
        borderRadius: '18px',
        padding: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <div style={{ fontWeight: 700 }}>{level}</div>
        <div style={{ fontWeight: 800 }}>
          {xp}/{xpMax} XP
        </div>
      </div>

      <div
        style={{
          width: '100%',
          height: '10px',
          background: 'rgba(255,255,255,0.25)',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: '#b6ff35',
          }}
        />
      </div>
    </section>
  )
}