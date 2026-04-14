type DashboardHeaderProps = {
  name: string
  streak: number
  level: string
}

export default function DashboardHeader({
  name,
  streak,
  level,
}: DashboardHeaderProps) {
  return (
    <section
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px',
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: 700,
          }}
        >
          Hola, {name} 👋
        </h1>
        <p
          style={{
            margin: '6px 0 0 0',
            color: '#666',
            fontSize: '14px',
          }}
        >
          {level}
        </p>
      </div>

      <div
        style={{
          background: '#f3d8b6',
          padding: '8px 14px',
          borderRadius: '999px',
          fontWeight: 700,
          fontSize: '14px',
        }}
      >
        🔥 {streak}
      </div>
    </section>
  )
}