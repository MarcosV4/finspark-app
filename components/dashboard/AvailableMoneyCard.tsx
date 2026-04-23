type AvailableMoneyCardProps = {
  available: number
}

export default function AvailableMoneyCard({
  available,
}: AvailableMoneyCardProps) {
  return (
    <section
      style={{
        background: '#111',
        color: '#fff',
        borderRadius: '20px',
        padding: '24px 20px',
        marginBottom: '16px',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '12px',
          opacity: 0.8,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        Disponible este mes
      </p>

      <div
        style={{
          fontSize: '52px',
          fontWeight: 800,
          lineHeight: 1,
          marginTop: '10px',
        }}
      >
        €{available}
      </div>

      <p
        style={{
          margin: '10px 0 0 0',
          fontSize: '14px',
          opacity: 0.8,
        }}
      >
        Después de cubrir todos tus gastos fijos
      </p>
    </section>
  )
}