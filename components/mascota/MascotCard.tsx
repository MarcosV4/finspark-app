type EquippedItems = {
  hat?: number
  glasses?: number
  outfit?: number
}

type Props = {
  name: string
  level: string
  xp: number
  xpMax: number
  equippedItems: EquippedItems
}

export default function MascotCard({
  name,
  level,
  xp,
  xpMax,
  equippedItems,
}: Props) {
  const progress = (xp / xpMax) * 100

  return (
    <section
      style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '20px',
        textAlign: 'center',
        marginBottom: '16px',
        border: '1px solid #e5e5e5',
      }}
    >
      <div
        style={{
          position: 'relative',
          fontSize: '60px',
          marginBottom: '10px',
        }}
      >
        🐷

        {equippedItems.hat && (
          <div
            style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '28px',
            }}
          >
            🎩
          </div>
        )}

        {equippedItems.glasses && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '26px',
            }}
          >
            🕶️
          </div>
        )}
      </div>

      <h2 style={{ margin: 0 }}>{name}</h2>

      <p style={{ margin: '6px 0 10px 0', color: '#666' }}>
        {level}
      </p>

      <div
        style={{
          height: '10px',
          background: '#eee',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: '#6d49ff',
          }}
        />
      </div>

      <p style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
        {xp}/{xpMax} XP
      </p>
    </section>
  )
}