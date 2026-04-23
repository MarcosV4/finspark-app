export type MotivationAnswer = 'a' | 'b' | 'c' | 'd'

export type CompanionInput = {
  riskAnswer: 1 | 2 | 3 | 4
  disciplineAnswer: 1 | 2 | 3 | 4
  motivationAnswer: MotivationAnswer
  emotionAnswer: 1 | 2 | 3 | 4 | 5

  monthlyIncome: number
  monthlyExpenses: number
  monthlySavings: number
  monthlyInvestment: number
  badDebtTotal: number

  displayedScore: number
}

export type CompanionResult = {
  key: string
  name: string
  emoji: string
  title: string
  description: string
  risk: number
  discipline: number
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function percent(amount: number, income: number) {
  if (income <= 0) return 0
  return (amount / income) * 100
}

function getCompanionMeta(key: string) {
  switch (key) {
    case 'pig':
      return {
        key: 'pig',
        emoji: '🐷',
        name: 'Cerdito Ahorrador',
        title: 'Cerdito Ahorrador',
        description:
          'Tienes el instinto más valioso del mundo financiero: proteger lo que ganas. Mientras otros pierden dinero por impulsos, tú construyes tu refugio moneda a moneda. Esa base sólida es el superpoder de los grandes patrimonios.',
      }

    case 'owl':
      return {
        key: 'owl',
        emoji: '🦉',
        name: 'Búho Precavido',
        title: 'Búho Precavido',
        description:
          'Eres cuidadoso, reflexivo y nunca tomas decisiones a la ligera. Esa prudencia es oro puro: te protege de errores caros y te mantiene siempre con recursos cuando otros se quedan sin nada.',
      }

    case 'bee':
      return {
        key: 'bee',
        emoji: '🐝',
        name: 'Abeja Constructora',
        title: 'Abeja Constructora',
        description:
          'Planificas, organizas y avanzas con método. Eres de los que construyen imperios ladrillo a ladrillo. Mientras otros buscan atajos, tú estás poniendo cimientos que duran toda la vida.',
      }

    case 'fox':
      return {
        key: 'fox',
        emoji: '🦊',
        name: 'Zorro Estratega',
        title: 'Zorro Estratega',
        description:
          'Combinas cabeza y acción como pocos. No te paralizas por miedo ni te lanzas sin pensar. Tu perfil es el que mejor equilibrio tiene a largo plazo: inteligencia financiera pura.',
      }

    case 'lion':
      return {
        key: 'lion',
        emoji: '🦁',
        name: 'León Valiente',
        title: 'León Valiente',
        description:
          'Tienes la audacia que el 90% de la gente no se atreve a tener. Buscas crecer, no solo sobrevivir. Con esa mentalidad, el techo lo pones tú: vas a por resultados grandes.',
      }

    case 'wolf':
      return {
        key: 'wolf',
        emoji: '🐺',
        name: 'Lobo Alfa',
        title: 'Lobo Alfa',
        description:
          'Tienes algo rarísimo: disciplina y ambición. Ahorras, inviertes, no te endeudas y aún así buscas crecer. Esta es la combinación que distingue a quien alcanza libertad financiera real.',
      }

    case 'eagle':
      return {
        key: 'eagle',
        emoji: '🦅',
        name: 'Águila Visionaria',
        title: 'Águila Visionaria',
        description:
          'Perteneces a una élite pequeñísima. Ves a largo plazo, tomas decisiones sólidas y ya vuelas por encima de la media. Pocos usuarios empiezan donde tú estás empezando.',
      }

    default:
      return {
        key: 'fox',
        emoji: '🦊',
        name: 'Zorro Estratega',
        title: 'Zorro Estratega',
        description:
          'Combinas cabeza y acción como pocos. No te paralizas por miedo ni te lanzas sin pensar. Tu perfil es el que mejor equilibrio tiene a largo plazo: inteligencia financiera pura.',
      }
  }
}

export function assignFinancialCompanion(input: CompanionInput): CompanionResult {
  const savingsPct = percent(input.monthlySavings, input.monthlyIncome)
  const investmentPct = percent(input.monthlyInvestment, input.monthlyIncome)

  let risk: number = input.riskAnswer

  if (input.emotionAnswer === 1) risk -= 1
  if (input.emotionAnswer === 4) risk += 1
  if (input.emotionAnswer === 5) risk += 2

  if (investmentPct >= 10) {
    risk = Math.max(risk, 3)
  }

  if (investmentPct === 0) {
    risk = Math.min(risk, 2)
  }

  if (input.monthlyIncome > 0 && input.badDebtTotal > input.monthlyIncome * 3) {
    risk += 1
  }

  risk = clamp(risk, 1, 5)

  let discipline: number = input.disciplineAnswer

  if (savingsPct >= 15 && input.badDebtTotal <= 0) {
    discipline = Math.max(discipline, 3)
  }

  if (input.monthlyExpenses >= input.monthlyIncome && input.monthlyIncome > 0) {
    discipline = Math.min(discipline, 2)
  }

  if (investmentPct >= 5 && savingsPct >= 10) {
    discipline += 1
  }

  if (input.badDebtTotal > input.monthlyIncome && savingsPct < 5) {
    discipline -= 1
  }

  discipline = clamp(discipline, 1, 5)

  let petKey = 'fox'

  if (
    input.displayedScore >= 85 &&
    discipline >= 4 &&
    risk >= 3 &&
    input.badDebtTotal <= 0
  ) {
    petKey = 'eagle'
  } else if (
    discipline >= 4 &&
    risk >= 3 &&
    savingsPct >= 15 &&
    investmentPct >= 5 &&
    input.badDebtTotal <= 0
  ) {
    petKey = 'wolf'
  } else if (risk >= 4 && discipline <= 3) {
    petKey = 'lion'
  } else if (discipline >= 3 && risk === 3) {
    petKey = 'fox'
  } else if (discipline >= 3 && risk <= 2) {
    petKey = 'bee'
  } else if (risk <= 2 && discipline === 2) {
    petKey = 'owl'
  } else if (risk === 1 && discipline === 1) {
    petKey = 'pig'
  } else {
    if (input.motivationAnswer === 'a') petKey = 'owl'
    if (input.motivationAnswer === 'b') petKey = 'bee'
    if (input.motivationAnswer === 'c') petKey = 'lion'
    if (input.motivationAnswer === 'd') petKey = 'fox'
  }

  const meta = getCompanionMeta(petKey)

  return {
    ...meta,
    risk,
    discipline,
  }
}