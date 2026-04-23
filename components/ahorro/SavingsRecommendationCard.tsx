type Props = {
  message: string
}

export default function SavingsRecommendationCard({ message }: Props) {
  return (
    <section
      style={{
        background: '#eef4ff',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid #d9e7ff',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '12px',
          color: '#3d8cff',
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
          color: '#2c3e5c',
          lineHeight: 1.5,
        }}
      >
        {message}
      </p>
    </section>
  )
}