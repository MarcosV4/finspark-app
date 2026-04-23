type Props = {
  totalSavings: number
  target: number
}

export default function TotalSavingsCard({
  totalSavings,
  target,
}: Props) {
  const remaining = Math.max(target - totalSavings, 0)
  const progress = Math.min((totalSavings / target) * 100, 100)

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
        Ahorro total actual
      </p>

      <div
        style={{
          fontSize: '46px',
          fontWeight: 800,
          lineHeight: 1,
          marginTop: '10px',
        }}
      >
        €{totalSavings}
      </div>

      <p
        style={{
          margin: '10px 0 14px 0',
          fontSize: '14px',
          opacity: 0.8,
        }}
      >
        Te faltan €{remaining} para tu objetivo principal
      </p>

      <div
        style={{
          width: '100%',
          height: '10px',
          background: 'rgba(255,255,255,0.18)',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: '#b6ff35',
          }}
        />
      </div>
    </section>
  )
}