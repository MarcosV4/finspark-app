'use client'

import { useState } from 'react'
import { useAppContext } from '../providers/AppProvider'

export default function QuizCard() {
  const { rewardUser } = useAppContext()

  const [step, setStep] = useState<'intro' | 'question' | 'result'>('intro')
  const [selected, setSelected] = useState<number | null>(null)
  const [rewarded, setRewarded] = useState(false)

  const correctAnswer = 1
  const xpReward = 25
  const coinReward = 10

  function handleAnswer(index: number) {
    setSelected(index)
    setStep('result')
  }

  function handleStart() {
    setStep('question')
  }

  function handleFinish() {
    if (!rewarded) {
      rewardUser(xpReward, coinReward)
      setRewarded(true)
    }

    setStep('intro')
    setSelected(null)
  }

  const isCorrect = selected === correctAnswer

  return (
    <section
      style={{
        background: '#111',
        color: '#fff',
        borderRadius: '18px',
        padding: '20px',
      }}
    >
      {step === 'intro' && (
        <>
          <p style={{ margin: 0, opacity: 0.7, fontSize: '12px' }}>
            QUIZ DEL DÍA
          </p>

          <h2 style={{ margin: '10px 0', fontSize: '20px' }}>
            El colchón de emergencia
          </h2>

          <p style={{ fontSize: '14px', opacity: 0.8 }}>
            Aprende por qué es clave antes de invertir.
          </p>

          <button
            onClick={handleStart}
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: '#6d49ff',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Empezar
          </button>
        </>
      )}

      {step === 'question' && (
        <>
          <h3 style={{ marginTop: 0 }}>
            ¿Cuántos meses de gastos debería cubrir tu colchón?
          </h3>

          {[3, 6, 12].map((value, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              style={{
                display: 'block',
                width: '100%',
                marginTop: '10px',
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: '#fff',
                color: '#111',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {value} meses
            </button>
          ))}
        </>
      )}

      {step === 'result' && (
        <>
          <h3 style={{ marginTop: 0 }}>
            {isCorrect ? 'Correcto 💥' : 'No es la mejor respuesta'}
          </h3>

          <p style={{ opacity: 0.8 }}>
            Lo recomendable suele ser entre 3 y 6 meses de gastos.
          </p>

          <div
            style={{
              marginTop: '14px',
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(109, 73, 255, 0.18)',
              border: '1px solid rgba(109, 73, 255, 0.35)',
              fontSize: '14px',
            }}
          >
            Recompensa: +{xpReward} XP 🧠  +{coinReward} 🪙
          </div>

          <button
            onClick={handleFinish}
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: '#6d49ff',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Finalizar
          </button>
        </>
      )}
    </section>
  )
}