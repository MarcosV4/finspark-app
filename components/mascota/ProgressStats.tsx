type Props = {
  streak: number
  missions: number
}

export default function ProgressStats({ streak, missions }: Props) {
  return (
    <section
      style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '16px',
      }}
    >
      <Stat label="Racha" value={`${streak} días`} />
      <Stat label="Misiones" value={`${missions}`} />
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        flex: 1,
        background: '#fff',
        borderRadius: '14px',
        padding: '14px',
        border: '1px solid #e5e5e5',
        textAlign: 'center',
      }}
    >
      <p style={{ margin: 0, fontSize: '12px', color: '#777' }}>
        {label}
      </p>
      <div style={{ fontWeight: 800, marginTop: '6px' }}>{value}</div>
    </div>
  )
}