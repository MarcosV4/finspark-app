'use client'

import { useEffect, useState } from 'react'
import { completeDailyQuiz } from '../../lib/quiz'
import { supabase } from '../../lib/supabase'
import { useAppContext } from '../providers/AppProvider'

export default function QuizCard() {
  const { missions, toggleMission, refreshAppData } = useAppContext()

  const [step, setStep] = useState<'intro' | 'question' | 'result'>('intro')
  const [selected, setSelected] = useState<number | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alreadyCompletedToday, setAlreadyCompletedToday] = useState(false)

  const correctAnswer = 1
  const QUIZ_MISSION_ID = 3

  useEffect(() => {
    async function checkQuizStatus() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session?.user) return

        const { data, error } = await supabase
          .from('profiles')
          .select('last_quiz_date')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('Error checking quiz status:', error)
          return
        }

        const today = new Date().toISOString().split('T')[0]
        setAlreadyCompletedToday(data?.last_quiz_date === today)
      } catch (error) {
        console.error('Unexpected quiz status error:', error)
      }
    }

    checkQuizStatus()
  }, [])

  function handleStart() {
    if (alreadyCompletedToday) return

    setStep('question')
    setSelected(null)
    setFeedbackMessage(null)
    setErrorMessage(null)
  }

  function handleAnswer(index: number) {
    setSelected(index)
    setStep('result')
    setErrorMessage(null)
  }

  async function handleFinish() {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      setFeedbackMessage(null)
      setErrorMessage(null)

      console.log('[Quiz] Completing daily quiz...')

      const result = await completeDailyQuiz()
      console.log('[Quiz] completeDailyQuiz result:', result)

      if (result.alreadyCompleted) {
        setAlreadyCompletedToday(true)
        setFeedbackMessage('Ya completaste el quiz de hoy ✅')
        setStep('intro')
        setSelected(null)
        await refreshAppData()
        return
      }

      // Refrescamos primero para traer streak/xp/coins nuevos del quiz
      await refreshAppData()
      console.log('[Quiz] App data refreshed after quiz reward')

      // Si existe la misión del quiz y aún no está hecha, la completamos
      const quizMission = missions.find((m) => m.id === QUIZ_MISSION_ID)
      console.log('[Quiz] quizMission:', quizMission)

      if (quizMission && !quizMission.done) {
        await toggleMission(QUIZ_MISSION_ID)
        console.log('[Quiz] Quiz mission toggled')
      }

      // Refrescamos otra vez para dejar todo consistente
      await refreshAppData()
      console.log('[Quiz] App data refreshed after mission sync')

      setAlreadyCompletedToday(true)
     let message = `+${result.xp} XP 🧠  +${result.coins} 🪙  ·  Racha: ${result.streak} 🔥`

if (result.leveledUp) {
  message = `🚀 Subiste a nivel ${result.newLevel}!\n\n` + message
}

setFeedbackMessage(message)
      setStep('intro')
      setSelected(null)
    } catch (error) {
      console.error('[Quiz] handleFinish error:', error)

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Hubo un error al completar el quiz.'
      )
    } finally {
      setIsSubmitting(false)
    }
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

          {alreadyCompletedToday && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(0, 200, 120, 0.15)',
                border: '1px solid rgba(0, 200, 120, 0.4)',
                fontSize: '14px',
              }}
            >
              Ya completaste el quiz de hoy ✅
            </div>
          )}

          {feedbackMessage && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(109, 73, 255, 0.18)',
                border: '1px solid rgba(109, 73, 255, 0.35)',
                fontSize: '14px',
              }}
            >
              {feedbackMessage}
            </div>
          )}

          {errorMessage && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(255, 80, 80, 0.15)',
                border: '1px solid rgba(255, 80, 80, 0.4)',
                fontSize: '14px',
                color: '#ffd6d6',
              }}
            >
              {errorMessage}
            </div>
          )}

          <button
            onClick={handleStart}
            disabled={alreadyCompletedToday || isSubmitting}
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: alreadyCompletedToday ? '#666' : '#6d49ff',
              color: '#fff',
              fontWeight: 600,
              cursor: alreadyCompletedToday ? 'default' : 'pointer',
            }}
          >
            {alreadyCompletedToday ? 'Completado hoy' : 'Empezar'}
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
            Recompensa: +25 XP 🧠  +10 🪙
          </div>

          {errorMessage && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(255, 80, 80, 0.15)',
                border: '1px solid rgba(255, 80, 80, 0.4)',
                fontSize: '14px',
                color: '#ffd6d6',
              }}
            >
              {errorMessage}
            </div>
          )}

          <button
            onClick={handleFinish}
            disabled={isSubmitting}
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: isSubmitting ? '#666' : '#6d49ff',
              color: '#fff',
              cursor: isSubmitting ? 'default' : 'pointer',
              fontWeight: 600,
            }}
          >
            {isSubmitting ? 'Guardando...' : 'Finalizar'}
          </button>
        </>
      )}
    </section>
  )
}