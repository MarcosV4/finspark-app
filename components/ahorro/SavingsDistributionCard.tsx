type Props = {
  emergencyFund: number
  personalGoal: number
}

export default function SavingsDistributionCard({
  emergencyFund,
  personalGoal,
}: Props) {
  const total = emergencyFund + personalGoal || 1
  const emergencyPct = Math.round((emergencyFund / total) * 100)
  const personalPct = Math.round((personalGoal / total) * 100)

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
        Distribución del ahorro
      </h2>

      <div
        style={{
          width: '100%',
          height: '12px',
          borderRadius: '999px',
          overflow: 'hidden',
          display: 'flex',
          marginBottom: '14px',
          background: '#ececec',
        }}
      >
        <div
          style={{
            width: `${emergencyPct}%`,
            background: '#3d8cff',
          }}
        />
        <div
          style={{
            width: `${personalPct}%`,
            background: '#6d49ff',
          }}
        />
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        <LegendItem
          label="Colchón de emergencia"
          value={`€${emergencyFund}`}
          percent={`${emergencyPct}%`}
          color="#3d8cff"
        />
        <LegendItem
          label="Objetivo personal"
          value={`€${personalGoal}`}
          percent={`${personalPct}%`}
          color="#6d49ff"
        />
      </div>
    </section>
  )
}

function LegendItem({
  label,
  value,
  percent,
  color,
}: {
  label: string
  value: string
  percent: string
  color: string
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '999px',
            background: color,
            display: 'inline-block',
          }}
        />
        <span style={{ fontSize: '14px' }}>{label}</span>
      </div>

      <span style={{ fontSize: '14px', color: '#666' }}>
        {value} · {percent}
      </span>
    </div>
  )
}