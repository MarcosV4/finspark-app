type Props = {
  stocks: number
  bonds: number
  crypto: number
  others: number
}

export default function InvestmentDistributionCard({
  stocks,
  bonds,
  crypto,
  others,
}: Props) {
  const total = stocks + bonds + crypto + others || 1

  const stocksPct = Math.round((stocks / total) * 100)
  const bondsPct = Math.round((bonds / total) * 100)
  const cryptoPct = Math.round((crypto / total) * 100)
  const othersPct = Math.round((others / total) * 100)

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
        Distribución de la inversión
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
        <div style={{ width: `${stocksPct}%`, background: '#3d8cff' }} />
        <div style={{ width: `${bondsPct}%`, background: '#1ea672' }} />
        <div style={{ width: `${cryptoPct}%`, background: '#6d49ff' }} />
        <div style={{ width: `${othersPct}%`, background: '#e5674f' }} />
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        <LegendItem
          label="Acciones"
          value={`€${stocks}`}
          percent={`${stocksPct}%`}
          color="#3d8cff"
        />
        <LegendItem
          label="Renta fija"
          value={`€${bonds}`}
          percent={`${bondsPct}%`}
          color="#1ea672"
        />
        <LegendItem
          label="Crypto"
          value={`€${crypto}`}
          percent={`${cryptoPct}%`}
          color="#6d49ff"
        />
        <LegendItem
          label="Otros"
          value={`€${others}`}
          percent={`${othersPct}%`}
          color="#e5674f"
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