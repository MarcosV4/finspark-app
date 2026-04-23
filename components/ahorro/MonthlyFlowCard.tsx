type Props = {
  income: number
  expenses: number
  generatedSavings: number
}

export default function MonthlyFlowCard({
  income,
  expenses,
  generatedSavings,
}: Props) {
  return (
    <section
      style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid #e5e5e5',
      }}
    >
      <h2 style={{ margin: '0 0 14px 0', fontSize: '18px' }}>
        Flujo del mes
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '10px',
        }}
      >
        <FlowItem label="Ingresos" value={`€${income}`} color="#1ea672" />
        <FlowItem label="Gastos" value={`€${expenses}`} color="#e5674f" />
        <FlowItem
          label="Ahorro"
          value={`€${generatedSavings}`}
          color="#3d8cff"
        />
      </div>
    </section>
  )
}

function FlowItem({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: string
}) {
  return (
    <div
      style={{
        minWidth: 0,
        background: '#fafafa',
        borderRadius: '14px',
        padding: '14px 12px',
        border: '1px solid #efefef',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '11px',
          color: '#777',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </p>

      <div
        style={{
          marginTop: '8px',
          fontSize: '22px',
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
    </div>
  )
}