import { ReactNode } from 'react'

export default function GlassCard({
  children,
  style,
}: {
  children: ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        background: 'rgba(91, 46, 255, 0.08)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: 20,
        boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
        backdropFilter: 'blur(12px)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}