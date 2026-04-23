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

export default function AhorroPage() {
  const { financialProfile } = useAppContext()

  const currentSavings = financialProfile?.currentSavingsBalance ?? 0
  const monthlySavings = financialProfile?.monthlySavings ?? 0
  const monthlyExpenses = financialProfile?.monthlyExpenses ?? 0
  const monthlyIncome = financialProfile?.monthlyIncome ?? 0

  const emergencyGoal = monthlyExpenses > 0 ? monthlyExpenses * 3 : 0
  const emergencyProgress =
    emergencyGoal > 0 ? Math.min((currentSavings / emergencyGoal) * 100, 100) : 0

  const remainingToGoal = Math.max(emergencyGoal - currentSavings, 0)
  const savingsRate =
    monthlyIncome > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0

  const monthsToGoal =
    monthlySavings > 0 ? Math.ceil(remainingToGoal / monthlySavings) : null

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
            Ahorro
          </p>
          <h1 style={{ margin: '8px 0 0 0', fontSize: 28 }}>Tu base de ahorro</h1>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>
            Aquí verás cuánto ahorras, cómo va tu colchón y qué margen tienes para mejorar.
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
          <div style={{ fontSize: 14, color: '#666' }}>Ahorro actual</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6 }}>
            {formatMoney(currentSavings)}
          </div>
          <div style={{ marginTop: 8, color: '#6c4cff', fontWeight: 700 }}>
            Ahorras {formatMoney(monthlySavings)} al mes
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
            <div style={{ fontSize: 13, color: '#666' }}>Tasa de ahorro</div>
            <div style={{ marginTop: 8, fontSize: 24, fontWeight: 800 }}>
              {savingsRate}%
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
            <div style={{ fontSize: 13, color: '#666' }}>Aporte mensual</div>
            <div style={{ marginTop: 8, fontSize: 24, fontWeight: 800 }}>
              {formatMoney(monthlySavings)}
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: '#777' }}>
              Ritmo actual de ahorro
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
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, color: '#666' }}>Colchón de emergencia</div>
              <div style={{ marginTop: 6, fontSize: 24, fontWeight: 800 }}>
                {formatMoney(currentSavings)} / {formatMoney(emergencyGoal)}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: '#666' }}>Progreso</div>
              <div style={{ marginTop: 6, fontSize: 22, fontWeight: 800 }}>
                {Math.round(emergencyProgress)}%
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              height: 12,
              borderRadius: 999,
              background: '#ece8ff',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${emergencyProgress}%`,
                height: '100%',
                background: '#6c4cff',
                borderRadius: 999,
              }}
            />
          </div>

          <div style={{ marginTop: 14, color: '#666', fontSize: 14 }}>
            Objetivo sugerido: cubrir 3 meses de gastos.
          </div>

          <div style={{ marginTop: 8, color: '#444', fontSize: 14 }}>
            Te faltan <strong>{formatMoney(remainingToGoal)}</strong> para completarlo.
          </div>

          {monthsToGoal !== null && remainingToGoal > 0 && (
            <div style={{ marginTop: 8, color: '#444', fontSize: 14 }}>
              A tu ritmo actual, podrías alcanzarlo en <strong>{monthsToGoal} meses</strong>.
            </div>
          )}

          {monthlySavings <= 0 && remainingToGoal > 0 && (
            <div style={{ marginTop: 8, color: '#b45309', fontSize: 14 }}>
              Ahora mismo no tienes ahorro mensual registrado, así que no podemos estimar cuándo lo completarías.
            </div>
          )}
        </div>

        <div
          style={{
            background: '#fff',
            borderRadius: 20,
            padding: 20,
            boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 800 }}>Lectura rápida</div>

          <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 14,
                background: '#f7f5ff',
                color: '#3b2f82',
              }}
            >
              Estás guardando <strong>{formatMoney(monthlySavings)}</strong> al mes.
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 14,
                background: '#f7f5ff',
                color: '#3b2f82',
              }}
            >
              Tu colchón actual cubre aproximadamente{' '}
              <strong>
                {monthlyExpenses > 0
                  ? `${(currentSavings / monthlyExpenses).toFixed(1)} meses`
                  : '0 meses'}
              </strong>{' '}
              de gastos.
            </div>

            <div
              style={{
                padding: 14,
                borderRadius: 14,
                background: '#f7f5ff',
                color: '#3b2f82',
              }}
            >
              Tu ahorro representa un <strong>{savingsRate}%</strong> de tus ingresos mensuales.
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
            Todavía no hay perfil financiero cargado. Completa el onboarding para ver tus datos reales.
          </div>
        )}
      </div>
    </Screen>
  )
}