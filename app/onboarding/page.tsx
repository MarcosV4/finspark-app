'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '../../components/providers/AppProvider'
import { useSession } from '../../lib/useSession'
import { completeOnboarding } from '../../lib/financialProfile'

type FormData = {
  displayName: string
  riskAnswer: '' | '1' | '2' | '3' | '4'
  disciplineAnswer: '' | '1' | '2' | '3' | '4'
  motivationAnswer: '' | 'a' | 'b' | 'c' | 'd'
  emotionAnswer: '' | '1' | '2' | '3' | '4' | '5'
  age: string
  monthlyIncome: string
  monthlyExpenses: string
  monthlySavings: string
  monthlyInvestment: string
  badDebtTotal: string
  currentSavingsBalance: string
  currentInvestedBalance: string
}

type OnboardingResult = {
  league: string
  leagueBase: string
  leagueDescription: string
  companionName: string
  companionEmoji: string
  companionDescription: string
}

const initialForm: FormData = {
  displayName: '',
  riskAnswer: '',
  disciplineAnswer: '',
  motivationAnswer: '',
  emotionAnswer: '',
  age: '',
  monthlyIncome: '',
  monthlyExpenses: '',
  monthlySavings: '',
  monthlyInvestment: '',
  badDebtTotal: '',
  currentSavingsBalance: '',
  currentInvestedBalance: '',
}

function getLeagueBaseName(leagueLabel: string) {
  if (leagueLabel.startsWith('Bronce')) return 'Bronce'
  if (leagueLabel.startsWith('Plata')) return 'Plata'
  if (leagueLabel.startsWith('Oro')) return 'Oro'
  if (leagueLabel.startsWith('Platino')) return 'Platino'
  if (leagueLabel.startsWith('Esmeralda')) return 'Esmeralda'
  if (leagueLabel.startsWith('Diamante')) return 'Diamante'
  return leagueLabel
}

function getLeagueVideoSrc(leagueBase: string) {
  switch (leagueBase) {
    case 'Bronce':
      return '/league-videos/bronze.mp4'
    case 'Plata':
      return '/league-videos/silver.mp4'
    case 'Oro':
      return '/league-videos/gold.mp4'
    case 'Platino':
      return '/league-videos/platinum.mp4'
    case 'Esmeralda':
      return '/league-videos/emerald.mp4'
    case 'Diamante':
      return '/league-videos/diamond.mp4'
    default:
      return ''
  }
}

function getLeagueDescription(leagueBase: string) {
  switch (leagueBase) {
    case 'Bronce':
      return 'Aquí empieza todo. Estás pasando de ignorar tu dinero a mirarlo de frente. Puede que aún haya caos o desorden, pero eso ya no importa: has dado el paso más difícil. Cada pequeño hábito que construyas aquí —ahorrar, revisar tus gastos, entender en qué se va tu dinero— es la base de todo lo que vendrá después.'
    case 'Plata':
      return 'Empiezas a tener control real. Ya sabes qué entra, qué sale y dónde puedes mejorar. No todo es perfecto, pero ya no vas a ciegas. Estás tomando decisiones más conscientes y empezando a construir consistencia.'
    case 'Oro':
      return 'Tus finanzas dejan de ser un problema y empiezan a ser una herramienta. Ahorras de forma constante, controlas tus hábitos y has construido una base estable. Ya no reaccionas: decides.'
    case 'Platino':
      return 'Estás dando el salto importante: empiezas a pensar en crecer, no solo en gestionar. Inviertes, eliminas deudas innecesarias y tomas decisiones con visión de futuro. Tu dinero empieza a trabajar contigo.'
    case 'Esmeralda':
      return 'Tu disciplina empieza a dar resultados visibles. Tu patrimonio crece, tus decisiones son más estratégicas y tienes una visión clara de hacia dónde vas. No es suerte, es tu sistema.'
    case 'Diamante':
      return 'El nivel más alto. Tomas decisiones con precisión, maximizas cada oportunidad y construyes riqueza de forma constante y sostenible. Entiendes el sistema… y lo usas a tu favor.'
    default:
      return ''
  }
}

function SectionCard({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: 20,
        boxShadow: '0 12px 36px rgba(0,0,0,0.28)',
        backdropFilter: 'blur(14px)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function OptionButton({
  selected,
  onClick,
  title,
  subtitle,
}: {
  selected: boolean
  onClick: () => void
  title: string
  subtitle?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: 16,
        borderRadius: 18,
        border: selected ? '1px solid rgba(167,139,250,0.7)' : '1px solid rgba(255,255,255,0.08)',
        background: selected
          ? 'linear-gradient(180deg, rgba(91,46,255,0.28), rgba(91,46,255,0.12))'
          : 'rgba(255,255,255,0.04)',
        color: '#F5F7FB',
        cursor: 'pointer',
        boxShadow: selected ? '0 0 22px rgba(91,46,255,0.18)' : 'none',
      }}
    >
      <div style={{ fontWeight: 700, lineHeight: 1.35 }}>{title}</div>
      {subtitle && (
        <div
          style={{
            marginTop: 6,
            color: '#9CA3AF',
            fontSize: 13,
            lineHeight: 1.45,
          }}
        >
          {subtitle}
        </div>
      )}
    </button>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const { session } = useSession()
  const { refreshAppData } = useAppContext()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<OnboardingResult | null>(null)
  const [showLeagueIntro, setShowLeagueIntro] = useState(false)

  const steps = [
    'Tu nombre',
    'Tu forma de moverte con el dinero',
    'Qué buscas realmente',
    'Tu situación mensual',
    'Tu punto de partida actual',
  ] as const

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  function isStepValid() {
    switch (step) {
      case 0:
        return form.displayName.trim() !== ''
      case 1:
        return form.riskAnswer !== '' && form.disciplineAnswer !== ''
      case 2:
        return form.motivationAnswer !== '' && form.emotionAnswer !== ''
      case 3:
        return (
          form.age.trim() !== '' &&
          form.monthlyIncome.trim() !== '' &&
          form.monthlyExpenses.trim() !== '' &&
          form.monthlySavings.trim() !== '' &&
          form.monthlyInvestment.trim() !== ''
        )
      case 4:
        return (
          form.currentSavingsBalance.trim() !== '' &&
          form.currentInvestedBalance.trim() !== '' &&
          form.badDebtTotal.trim() !== ''
        )
      default:
        return false
    }
  }

  async function handleNext() {
    if (!isStepValid()) {
      setError('Completa todos los campos antes de continuar.')
      return
    }

    setError(null)

    if (step < steps.length - 1) {
      setStep((prev) => prev + 1)
      return
    }

    if (!session?.user?.id) {
      setError('No se encontró la sesión del usuario.')
      return
    }

    try {
      setLoading(true)

      const onboardingResult = await completeOnboarding(session.user.id, {
        displayName: form.displayName.trim(),
        age: Number(form.age),
        monthlyIncome: Number(form.monthlyIncome),
        monthlyExpenses: Number(form.monthlyExpenses),
        monthlySavings: Number(form.monthlySavings),
        monthlyInvestment: Number(form.monthlyInvestment),
        badDebtTotal: Number(form.badDebtTotal),
        currentSavingsBalance: Number(form.currentSavingsBalance),
        currentInvestedBalance: Number(form.currentInvestedBalance),
        riskAnswer: Number(form.riskAnswer) as 1 | 2 | 3 | 4,
        disciplineAnswer: Number(form.disciplineAnswer) as 1 | 2 | 3 | 4,
        motivationAnswer: form.motivationAnswer as 'a' | 'b' | 'c' | 'd',
        emotionAnswer: Number(form.emotionAnswer) as 1 | 2 | 3 | 4 | 5,
      })

      const league = onboardingResult.scoreResult.league.label
      const leagueBase = getLeagueBaseName(league)

      const finalResult = {
        league,
        leagueBase,
        leagueDescription: getLeagueDescription(leagueBase),
        companionName: onboardingResult.companion.name,
        companionEmoji: onboardingResult.companion.emoji,
        companionDescription: onboardingResult.companion.description,
      }

      setResult(finalResult)
      setShowLeagueIntro(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error completando onboarding'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoToDashboard() {
    await refreshAppData()
    router.push('/dashboard')
  }

  const textInputStyle: React.CSSProperties = {
    width: '100%',
    padding: 14,
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: '#F5F7FB',
    marginTop: 8,
    outline: 'none',
    fontSize: 15,
  }

  const progressPercent = ((step + 1) / steps.length) * 100

  if (showLeagueIntro && result) {
    const videoSrc = getLeagueVideoSrc(result.leagueBase)

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000',
          zIndex: 9999,
        }}
      >
        {videoSrc ? (
          <video
            src={videoSrc}
            autoPlay
            muted
            playsInline
            onEnded={() => setShowLeagueIntro(false)}
            onError={() => setShowLeagueIntro(false)}
            style={{
              width: '100vw',
              height: '100vh',
              objectFit: 'contain',
              display: 'block',
              background: '#000',
            }}
          />
        ) : (
          <div
            style={{
              width: '100vw',
              height: '100vh',
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            {result.leagueBase}
          </div>
        )}

        <button
          onClick={() => setShowLeagueIntro(false)}
          style={{
            position: 'absolute',
            right: 20,
            bottom: 24,
            padding: '12px 18px',
            borderRadius: 999,
            border: 'none',
            background: 'rgba(255,255,255,0.14)',
            color: '#fff',
            fontWeight: 700,
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
          }}
        >
          Continuar
        </button>
      </div>
    )
  }

  if (result) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background:
            'radial-gradient(circle at top, rgba(91,46,255,0.22), transparent 35%), #0B0B12',
          color: '#F5F7FB',
          padding: '20px 16px 40px',
        }}
      >
        <div
          style={{
            maxWidth: 430,
            margin: '0 auto',
          }}
        >
          <SectionCard style={{ textAlign: 'center', padding: 28 }}>
            <p
              style={{
                margin: 0,
                color: '#9CA3AF',
                fontSize: 13,
              }}
            >
              Tu división inicial
            </p>

            <div
              style={{
                marginTop: 8,
                fontSize: 34,
                fontWeight: 900,
                color: '#A78BFA',
                lineHeight: 1,
              }}
            >
              {result.league}
            </div>

            <p
              style={{
                marginTop: 18,
                marginBottom: 0,
                color: '#C9CCD6',
                lineHeight: 1.6,
                fontSize: 14,
              }}
            >
              {result.leagueDescription}
            </p>

            <div style={{ marginTop: 28, fontSize: 78 }}>{result.companionEmoji}</div>

            <h1
              style={{
                marginTop: 12,
                marginBottom: 0,
                fontSize: 30,
              }}
            >
              {result.companionName}
            </h1>

            <p
              style={{
                marginTop: 14,
                marginBottom: 0,
                color: '#C9CCD6',
                lineHeight: 1.6,
                fontSize: 14,
              }}
            >
              {result.companionDescription}
            </p>

            <button
              onClick={handleGoToDashboard}
              style={{
                marginTop: 32,
                width: '100%',
                padding: '14px 16px',
                borderRadius: 14,
                border: 'none',
                background: 'linear-gradient(90deg, #5B2EFF, #9F6BFF)',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 0 24px rgba(91,46,255,0.28)',
              }}
            >
              Entrar al dashboard
            </button>
          </SectionCard>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, rgba(91,46,255,0.22), transparent 35%), #0B0B12',
        color: '#F5F7FB',
        padding: '20px 16px 40px',
      }}
    >
      <div
        style={{
          maxWidth: 430,
          margin: '0 auto',
          display: 'grid',
          gap: 16,
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: '#A78BFA',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Paso {step + 1} de {steps.length}
          </p>

          <h1
            style={{
              margin: '8px 0 0 0',
              fontSize: 30,
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            {steps[step]}
          </h1>

          <div
            style={{
              marginTop: 14,
              height: 10,
              width: '100%',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 999,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                borderRadius: 999,
                background: 'linear-gradient(90deg, #5B2EFF, #9F6BFF)',
                boxShadow: '0 0 18px rgba(91,46,255,0.28)',
              }}
            />
          </div>
        </div>

        {step === 0 && (
          <SectionCard>
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>Empecemos por lo básico</div>
            <div style={{ marginTop: 8, fontSize: 24, fontWeight: 800 }}>
              ¿Cómo quieres que te llamemos?
            </div>
            <div
              style={{
                marginTop: 8,
                color: '#C9CCD6',
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              Este nombre aparecerá en tu dashboard y en tu experiencia dentro de la app.
            </div>

            <input
              type="text"
              value={form.displayName}
              onChange={(e) => updateField('displayName', e.target.value)}
              style={textInputStyle}
              placeholder="Tu nombre"
            />
          </SectionCard>
        )}

        {step === 1 && (
          <SectionCard>
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>Tu perfil financiero</div>
            <div style={{ marginTop: 8, fontSize: 24, fontWeight: 800 }}>
              ¿Cómo te mueves normalmente con el dinero?
            </div>

            <div style={{ marginTop: 18, display: 'grid', gap: 12 }}>
              <div style={{ color: '#C9CCD6', fontWeight: 700 }}>
                Si te sobran 500€ este mes, ¿qué haces?
              </div>

              <OptionButton
                selected={form.riskAnswer === '1'}
                onClick={() => updateField('riskAnswer', '1')}
                title="Los dejo en mi cuenta por si acaso"
              />
              <OptionButton
                selected={form.riskAnswer === '2'}
                onClick={() => updateField('riskAnswer', '2')}
                title="Los meto en un ahorro seguro"
              />
              <OptionButton
                selected={form.riskAnswer === '3'}
                onClick={() => updateField('riskAnswer', '3')}
                title="Los invierto en algo con rentabilidad moderada"
              />
              <OptionButton
                selected={form.riskAnswer === '4'}
                onClick={() => updateField('riskAnswer', '4')}
                title="Los invierto buscando alto rendimiento aunque haya riesgo"
              />
            </div>

            <div style={{ marginTop: 22, display: 'grid', gap: 12 }}>
              <div style={{ color: '#C9CCD6', fontWeight: 700 }}>
                ¿Cómo manejas normalmente tu dinero cada mes?
              </div>

              <OptionButton
                selected={form.disciplineAnswer === '1'}
                onClick={() => updateField('disciplineAnswer', '1')}
                title="Gasto y veo qué queda al final"
              />
              <OptionButton
                selected={form.disciplineAnswer === '2'}
                onClick={() => updateField('disciplineAnswer', '2')}
                title="Intento ahorrar pero no siempre lo consigo"
              />
              <OptionButton
                selected={form.disciplineAnswer === '3'}
                onClick={() => updateField('disciplineAnswer', '3')}
                title="Sigo un presupuesto casi siempre"
              />
              <OptionButton
                selected={form.disciplineAnswer === '4'}
                onClick={() => updateField('disciplineAnswer', '4')}
                title="Tengo todo automatizado"
              />
            </div>
          </SectionCard>
        )}

        {step === 2 && (
          <SectionCard>
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>Tu mentalidad</div>
            <div style={{ marginTop: 8, fontSize: 24, fontWeight: 800 }}>
              ¿Qué buscas realmente con tu dinero?
            </div>

            <div style={{ marginTop: 18, display: 'grid', gap: 12 }}>
              <OptionButton
                selected={form.motivationAnswer === 'a'}
                onClick={() => updateField('motivationAnswer', 'a')}
                title="Tranquilidad y seguridad"
              />
              <OptionButton
                selected={form.motivationAnswer === 'b'}
                onClick={() => updateField('motivationAnswer', 'b')}
                title="Construir patrimonio paso a paso"
              />
              <OptionButton
                selected={form.motivationAnswer === 'c'}
                onClick={() => updateField('motivationAnswer', 'c')}
                title="Hacer crecer mi dinero rápido"
              />
              <OptionButton
                selected={form.motivationAnswer === 'd'}
                onClick={() => updateField('motivationAnswer', 'd')}
                title="Libertad financiera total"
              />
            </div>

            <div style={{ marginTop: 22, display: 'grid', gap: 12 }}>
              <div style={{ color: '#C9CCD6', fontWeight: 700 }}>
                ¿Cuál de estas frases te describe mejor?
              </div>

              <OptionButton
                selected={form.emotionAnswer === '1'}
                onClick={() => updateField('emotionAnswer', '1')}
                title="Me da miedo gastar, prefiero guardar todo"
              />
              <OptionButton
                selected={form.emotionAnswer === '2'}
                onClick={() => updateField('emotionAnswer', '2')}
                title="Soy muy cuidadoso y planifico cada euro"
              />
              <OptionButton
                selected={form.emotionAnswer === '3'}
                onClick={() => updateField('emotionAnswer', '3')}
                title="Analizo bien antes de tomar decisiones"
              />
              <OptionButton
                selected={form.emotionAnswer === '4'}
                onClick={() => updateField('emotionAnswer', '4')}
                title="Me gusta arriesgar si la oportunidad lo vale"
              />
              <OptionButton
                selected={form.emotionAnswer === '5'}
                onClick={() => updateField('emotionAnswer', '5')}
                title="Voy a por todas, no me da miedo perder para ganar"
              />
            </div>
          </SectionCard>
        )}

        {step === 3 && (
          <SectionCard>
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>Tu foto mensual</div>
            <div style={{ marginTop: 8, fontSize: 24, fontWeight: 800 }}>
              Queremos entender tu situación actual
            </div>
            <div
              style={{
                marginTop: 8,
                color: '#C9CCD6',
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              Con esto calcularemos tu división inicial y prepararemos tu experiencia.
            </div>

            <div style={{ marginTop: 18, display: 'grid', gap: 14 }}>
              <div>
                <label style={{ color: '#C9CCD6', fontSize: 14 }}>Edad</label>
                <input
                  type="number"
                  min="1"
                  value={form.age}
                  onChange={(e) => updateField('age', e.target.value)}
                  style={textInputStyle}
                />
              </div>

              <div>
                <label style={{ color: '#C9CCD6', fontSize: 14 }}>Ingresos mensuales netos</label>
                <input
                  type="number"
                  min="0"
                  value={form.monthlyIncome}
                  onChange={(e) => updateField('monthlyIncome', e.target.value)}
                  style={textInputStyle}
                />
              </div>

              <div>
                <label style={{ color: '#C9CCD6', fontSize: 14 }}>Gastos mensuales aproximados</label>
                <input
                  type="number"
                  min="0"
                  value={form.monthlyExpenses}
                  onChange={(e) => updateField('monthlyExpenses', e.target.value)}
                  style={textInputStyle}
                />
              </div>

              <div>
                <label style={{ color: '#C9CCD6', fontSize: 14 }}>Ahorro mensual</label>
                <input
                  type="number"
                  min="0"
                  value={form.monthlySavings}
                  onChange={(e) => updateField('monthlySavings', e.target.value)}
                  style={textInputStyle}
                />
              </div>

              <div>
                <label style={{ color: '#C9CCD6', fontSize: 14 }}>Inversión mensual</label>
                <input
                  type="number"
                  min="0"
                  value={form.monthlyInvestment}
                  onChange={(e) => updateField('monthlyInvestment', e.target.value)}
                  style={textInputStyle}
                />
              </div>
            </div>
          </SectionCard>
        )}

        {step === 4 && (
          <SectionCard>
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>Tu punto de partida</div>
            <div style={{ marginTop: 8, fontSize: 24, fontWeight: 800 }}>
              Últimos datos antes de darte tu resultado
            </div>

            <div style={{ marginTop: 18, display: 'grid', gap: 14 }}>
              <div>
                <label style={{ color: '#C9CCD6', fontSize: 14 }}>Ahorro actual</label>
                <input
                  type="number"
                  min="0"
                  value={form.currentSavingsBalance}
                  onChange={(e) => updateField('currentSavingsBalance', e.target.value)}
                  style={textInputStyle}
                />
              </div>

              <div>
                <label style={{ color: '#C9CCD6', fontSize: 14 }}>Inversión actual</label>
                <input
                  type="number"
                  min="0"
                  value={form.currentInvestedBalance}
                  onChange={(e) => updateField('currentInvestedBalance', e.target.value)}
                  style={textInputStyle}
                />
              </div>

              <div>
                <label style={{ color: '#C9CCD6', fontSize: 14 }}>Deuda mala actual</label>
                <input
                  type="number"
                  min="0"
                  value={form.badDebtTotal}
                  onChange={(e) => updateField('badDebtTotal', e.target.value)}
                  style={textInputStyle}
                />
              </div>
            </div>
          </SectionCard>
        )}

        {error && (
          <div
            style={{
              color: '#FCA5A5',
              background: 'rgba(255,90,95,0.08)',
              border: '1px solid rgba(255,90,95,0.18)',
              borderRadius: 18,
              padding: 14,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          {step > 0 && (
            <button
              onClick={() => {
                setError(null)
                setStep((prev) => prev - 1)
              }}
              style={{
                flex: 1,
                padding: '14px 16px',
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.05)',
                color: '#F5F7FB',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Atrás
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={loading}
            style={{
              flex: 1,
              padding: '14px 16px',
              borderRadius: 14,
              border: 'none',
              background: 'linear-gradient(90deg, #5B2EFF, #9F6BFF)',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 0 24px rgba(91,46,255,0.28)',
            }}
          >
            {loading
              ? 'Preparando resultado...'
              : step === steps.length - 1
                ? 'Ver mi resultado'
                : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  )
}