type StatCardProps = {
  label: string
  value: string
  subtitle?: string
  color: string
}

function StatCard({ label, value, subtitle, color }: StatCardProps) {
  return (
    <div
      style={{
        minWidth: 0,
        background: '#fff',
        borderRadius: '16px',
        padding: '14px 12px',
        border: '1px solid #e5e5e5',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '11px',
          color: '#777',
          textTransform: 'uppercase',
          lineHeight: 1.2,
        }}
      >
        {label}
      </p>

      <div
        style={{
          marginTop: '8px',
          fontSize: '24px',
          fontWeight: 800,
          color,
          lineHeight: 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </div>

      {subtitle ? (
        <p
          style={{
            margin: '8px 0 0 0',
            fontSize: '12px',
            color: '#666',
            lineHeight: 1.2,
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}

type StatsRowProps = {
  income: number
  expenses: number
  savings: number
  fixedExpensePercent: number
}

export default function StatsRow({
  income,
  expenses,
  savings,
  fixedExpensePercent,
}: StatsRowProps) {
  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '10px',
        marginBottom: '16px',
      }}
    >
      <StatCard label="Ingresos" value={`€${income}`} color="#1ea672" />
      <StatCard
        label="Gastos"
        value={`€${expenses}`}
        subtitle={`fijos: ${fixedExpensePercent}%`}
        color="#e5674f"
      />
      <StatCard label="Ahorro" value={`€${savings}`} color="#3d8cff" />
    </section>
  )
}