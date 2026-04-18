'use client'

import Screen from '../../components/Screen'
import { useAppContext } from '../../components/providers/AppProvider'

function formatMoney(value: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

function getInvestorProfile(monthlyIncome: number, monthlyInvestment: number) {
  if (monthlyIncome <= 0 || monthlyInvestment <= 0) {
    return {
      label: 'Sin estrategia definida',
      description: 'Todavía no registras inversión mensual, así que aún no hay una señal clara de hábito inversor.',
    }
  }

  const ratio = (monthlyInvestment / monthlyIncome) * 100

  if (ratio < 5) {
    return {
      label: 'Perfil prudente',
      description: 'Estás empezando a construir hábito inversor con una parte pequeña de tus ingresos.',
    }
  }

  if (ratio < 10) {
    return {
      label: 'Perfil equilibrado',
      description: 'Ya estás destinando una parte relevante de tus ingresos a inversión de forma bastante sana.',
    }
  }

  return {
    label: 'Perfil muy activo',
    description: 'Tu porcentaje mensual invertido es alto y muestra una intención fuerte de construir patrimonio.',
  }
}

export default function InversionPage() {
  const { financialProfile } = useAppContext()

  const currentInvested = financialProfile?.currentInvestedBalance ?? 0
  const monthlyInvestment = financialProfile?.monthlyInvestment ?? 0
  const monthlyIncome = financialProfile?.monthlyIncome ?? 0
  const monthlySavings = financialProfile?.monthlySavings ?? 0

  const investmentRate =
    monthlyIncome > 0 ? Math.round((monthlyInvestment / monthlyIncome) * 100) : 0

  const totalCapital = currentInvested + (financialProfile?.currentSavingsBalance ?? 0)
  const investedWeight =
    totalCapital > 0 ? Math.round((currentInvested / totalCapital) * 100) : 0

  const profile = getInvestorProfile(monthlyIncome, monthlyInvestment)

  return (
    <Screen>
      <div style={{ display: 'grid', gap: 16 }}>
        <div>
          <p
            style={{
              margin: 0,
              color: '#6c4cff',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Inversión
          </p>
          <h1 style={{ margin: '8px 0 0 0', fontSize: 28 }}>Tu situación inversora</h1>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>
            De momento esta sección resume tu punto de partida y tu hábito de inversión actual.
          </p>
        </div>

        <div
          style={{
            background: '#fff',
            borderRadius: 20,
            padding: 20,
            boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ fontSize: 14, color: '#666' }}>Capital invertido actual</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6 }}>
            {formatMoney(currentInvested)}
          </div>
          <div style={{ marginTop: 8, color: '#6c4cff', fontWeight: 700 }}>
            Inviertes {formatMoney(monthlyInvestment)} al mes
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div
            style={{
              background: '#fff',
              borderRadius: 18,
              padding: 16,
              boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ fontSize: 13, color: '#666' }}>Tasa de inversión</div>
            <div style={{ marginTop: 8, fontSize: 24, fontWeight: 800 }}>
              {investmentRate}%
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: '#777' }}>
              Sobre tus ingresos mensuales
            </div>
          </div>

          <div
            style={{
              background: '#fff',
              borderRadius: 18,
              padding: 16,
              boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ fontSize: 13, color: '#666' }}>Peso invertido</div>
            <div style={{ marginTop: 8, fontSize: 24, fontWeight: 800 }}>
              {investedWeight}%
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: '#777' }}>
              Frente a ahorro + inversión
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#fff',
            borderRadius: 20,
            padding: 20,
            boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 800 }}>Lectura de tu perfil</div>

          <div
            style={{
              marginTop: 14,
              borderRadius: 16,
              background: '#f7f5ff',
              padding: 16,
            }}
          >
            <div style={{ fontWeight: 800, color: '#3b2f82' }}>{profile.label}</div>
            <div style={{ marginTop: 8, color: '#5b5670', lineHeight: 1.45 }}>
              {profile.description}
            </div>
          </div>

          <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 14,
                background: '#fafafa',
              }}
            >
              Hoy tienes <strong>{formatMoney(currentInvested)}</strong> invertidos.
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 14,
                background: '#fafafa',
              }}
            >
              Tu aportación mensual es de <strong>{formatMoney(monthlyInvestment)}</strong>.
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 14,
                background: '#fafafa',
              }}
            >
              Comparado con tu ahorro mensual, estás destinando{' '}
              <strong>
                {monthlySavings > 0
                  ? `${Math.round((monthlyInvestment / monthlySavings) * 100)}%`
                  : '0%'}
              </strong>{' '}
              de esa magnitud a inversión.
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#fff',
            borderRadius: 20,
            padding: 20,
            boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 800 }}>Distribución conceptual</div>
          <p style={{ marginTop: 8, marginBottom: 16, color: '#666' }}>
            Todavía no estás asignando categorías reales. Esta sección es una guía visual temporal hasta construir la inversión completa.
          </p>

          <div style={{ display: 'grid', gap: 12 }}>
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                  fontSize: 14,
                }}
              >
                <span>Base conservadora</span>
                <strong>50%</strong>
              </div>
              <div
                style={{
                  height: 10,
                  background: '#ece8ff',
                  borderRadius: 999,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '50%',
                    height: '100%',
                    background: '#6c4cff',
                  }}
                />
              </div>
            </div>

            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                  fontSize: 14,
                }}
              >
                <span>Crecimiento</span>
                <strong>30%</strong>
              </div>
              <div
                style={{
                  height: 10,
                  background: '#ece8ff',
                  borderRadius: 999,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '30%',
                    height: '100%',
                    background: '#6c4cff',
                  }}
                />
              </div>
            </div>

            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                  fontSize: 14,
                }}
              >
                <span>Mayor riesgo</span>
                <strong>20%</strong>
              </div>
              <div
                style={{
                  height: 10,
                  background: '#ece8ff',
                  borderRadius: 999,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '20%',
                    height: '100%',
                    background: '#6c4cff',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {!financialProfile && (
          <div
            style={{
              background: '#fff7ed',
              border: '1px solid #fed7aa',
              color: '#9a3412',
              borderRadius: 18,
              padding: 16,
            }}
          >
            Todavía no hay perfil financiero cargado. Completa el onboarding para ver tu inversión inicial.
          </div>
        )}
      </div>
    </Screen>
  )
}