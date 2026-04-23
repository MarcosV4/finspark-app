export default function Screen({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main
      style={{
        flex: 1,
        padding: '20px 16px 16px',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: '#f5f4f0',
      }}
    >
      {children}
    </main>
  )
}