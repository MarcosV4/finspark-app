type Props = {
  current: number
  goal: number
}

export default function EmergencyFundStatus({
  current,
  goal,
}: Props) {
  const progress = Math.min((current / goal) * 100, 100)

  let status = 'Bajo'
  if (progress >= 33) status = 'Mínimo'
  if (progress >= 100) status = 'Ideal'

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '18px' }}>
          Colchón de emergencia
        </h2>

        <span
          style={{
            fontWeight: 700,
            color: '#3d8cff',
          }}
        >
          {Math.round(progress)}%
        </span>
      </div>

      <div
        style={{
          width: '100%',
          height: '10px',
          background: '#ececec',
          borderRadius: '999px',
          overflow: 'hidden',
          marginBottom: '10px',
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

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '14px',
          color: '#666',
          marginBottom: '10px',
        }}
      >
        <span>€{current} ahorrados</span>
        <span>meta: €{goal}</span>
      </div>

      <div
        style={{
          display: 'inline-block',
          padding: '6px 10px',
          borderRadius: '999px',
          background: '#eef4ff',
          color: '#3d8cff',
          fontSize: '12px',
          fontWeight: 700,
        }}
      >
        Estado: {status}
      </div>
    </section>
  )
}