type Props = {
  message: string
}

export default function InvestmentRecommendationCard({ message }: Props) {
  return (
    <section
      style={{
        background: '#f3edff',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid #e6dbff',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '12px',
          color: '#6d49ff',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        Recomendación
      </p>

      <p
        style={{
          margin: '10px 0 0 0',
          fontSize: '14px',
          color: '#3d2f66',
          lineHeight: 1.5,
        }}
      >
        {message}
      </p>
    </section>
  )
}