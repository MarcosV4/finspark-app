'use client'

import { useAppContext } from '../../components/providers/AppProvider'

function formatMoney(value: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

function getPetEmoji(petKey: string | null) {
  switch (petKey) {
    case 'pig':
      return '🐷'
    case 'owl':
      return '🦉'
    case 'bee':
      return '🐝'
    case 'fox':
      return '🦊'
    case 'lion':
      return '🦁'
    case 'wolf':
      return '🐺'
    case 'eagle':
      return '🦅'
    default:
      return '✨'
  }
}

export default function DashboardPage() {
  const { user, visibleStreak, financialProfile } = useAppContext()

  const income = financialProfile?.monthlyIncome ?? 0
  const expenses = financialProfile?.monthlyExpenses ?? 0
  const savings = financialProfile?.monthlySavings ?? 0
  const investment = financialProfile?.monthlyInvestment ?? 0

  const available = income - expenses - savings - investment
  const fixedExpensePercent = income > 0 ? Math.round((expenses / income) * 100) : 0

  const petEmoji = getPetEmoji(user.petKey)

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, rgba(91,46,255,0.22), transparent 35%), #0B0B12',
        color: '#F5F7FB',
        padding: '24px 18px 110px',
      }}
    >
      <div
        style={{
          maxWidth: 560,
          margin: '0 auto',
          display: 'grid',
          gap: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: '#9CA3AF',
                fontSize: 14,
              }}
            >
              Hola
            </p>

            <h1
              style={{
                margin: '6px 0 0 0',
                fontSize: 30,
                fontWeight: 800,
                lineHeight: 1.1,
              }}
            >
              {user.name || 'Usuario'}
            </h1>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 18,
              padding: '12px 14px',
              minWidth: 92,
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.22)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div style={{ fontSize: 12, color: '#9CA3AF' }}>Racha</div>
            <div
              style={{
                marginTop: 4,
                fontSize: 22,
                fontWeight: 800,
                color: '#22FF88',
              }}
            >
              {visibleStreak}
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24,
            padding: 20,
            boxShadow: '0 12px 36px rgba(0,0,0,0.28)',
            backdropFilter: 'blur(14px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  color: '#9CA3AF',
                }}
              >
                Tu división actual
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 34,
                  fontWeight: 900,
                  lineHeight: 1,
                  color: '#F5F7FB',
                }}
              >
                {user.leagueName} {user.leagueDivision}
              </div>

              <div
                style={{
                  marginTop: 10,
                  fontSize: 14,
                  color: '#A78BFA',
                  fontWeight: 700,
                }}
              >
                {user.petName ? `Compañero: ${user.petName}` : 'Estás construyendo tu perfil'}
              </div>
            </div>

            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: 22,
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(180deg, rgba(91,46,255,0.35), rgba(159,107,255,0.18))',
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: 42,
                boxShadow: '0 0 30px rgba(91,46,255,0.18)',
              }}
            >
              {petEmoji}
            </div>
          </div>

          {user.petDescription && (
            <p
              style={{
                margin: '16px 0 0 0',
                color: '#C9CCD6',
                lineHeight: 1.55,
                fontSize: 14,
              }}
            >
              {user.petDescription}
            </p>
          )}
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(91,46,255,0.22), rgba(159,107,255,0.10))',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24,
            padding: 20,
            boxShadow: '0 12px 36px rgba(0,0,0,0.28)',
          }}
        >
          <div style={{ fontSize: 13, color: '#C4B5FD' }}>Dinero disponible este mes</div>

          <div
            style={{
              marginTop: 8,
              fontSize: 38,
              fontWeight: 900,
              letterSpacing: '-0.02em',
            }}
          >
            {formatMoney(available)}
          </div>

          <div
            style={{
              marginTop: 10,
              color: '#C9CCD6',
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            Calculado como ingresos menos gastos, ahorro mensual e inversión mensual.
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: 16,
              boxShadow: '0 10px 28px rgba(0,0,0,0.22)',
            }}
          >
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>Ingresos</div>
            <div
              style={{
                marginTop: 8,
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              {formatMoney(income)}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: 16,
              boxShadow: '0 10px 28px rgba(0,0,0,0.22)',
            }}
          >
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>Gastos</div>
            <div
              style={{
                marginTop: 8,
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              {formatMoney(expenses)}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: 16,
              boxShadow: '0 10px 28px rgba(0,0,0,0.22)',
            }}
          >
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>Ahorro mensual</div>
            <div
              style={{
                marginTop: 8,
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              {formatMoney(savings)}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: 16,
              boxShadow: '0 10px 28px rgba(0,0,0,0.22)',
            }}
          >
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>Inversión mensual</div>
            <div
              style={{
                marginTop: 8,
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              {formatMoney(investment)}
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24,
            padding: 20,
            boxShadow: '0 10px 28px rgba(0,0,0,0.22)',
          }}
        >
          <div style={{ fontSize: 13, color: '#9CA3AF' }}>Lectura rápida</div>

          <div
            style={{
              marginTop: 14,
              display: 'grid',
              gap: 10,
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 16,
                background: 'rgba(91,46,255,0.10)',
                color: '#D8CCFF',
              }}
            >
              Tus gastos representan aproximadamente <strong>{fixedExpensePercent}%</strong> de tus ingresos.
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 16,
                background: 'rgba(91,46,255,0.10)',
                color: '#D8CCFF',
              }}
            >
              Estás ahorrando <strong>{formatMoney(savings)}</strong> al mes e invirtiendo <strong>{formatMoney(investment)}</strong>.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}