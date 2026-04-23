type Props = {
  totalInvested: number
  investedPercent: number
}

export default function TotalInvestedCard({
  totalInvested,
  investedPercent,
}: Props) {
  return (
    <section
      style={{
        background: '#111',
        color: '#fff',
        borderRadius: '20px',
        padding: '22px 18px',
        marginBottom: '16px',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '12px',
          opacity: 0.75,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        Dinero invertido total
      </p>

      <div
        style={{
          fontSize: '46px',
          fontWeight: 800,
          lineHeight: 1,
          marginTop: '10px',
        }}
      >
        €{totalInvested}
      </div>

      <p
        style={{
          margin: '10px 0 0 0',
          fontSize: '14px',
          opacity: 0.8,
        }}
      >
        Representa el {investedPercent}% de tu dinero ahorrado
      </p>
    </section>
  )
}