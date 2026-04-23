type Props = {
  completed: number
  total: number
}

export default function DailyProgress({ completed, total }: Props) {
  const percent = (completed / total) * 100

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
      <div style={{ marginBottom: '8px', fontWeight: 600 }}>
        {completed} de {total} acciones completadas
      </div>

      <div
        style={{
          height: '10px',
          background: '#eee',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            background: '#6d49ff',
          }}
        />
      </div>
    </section>
  )
}