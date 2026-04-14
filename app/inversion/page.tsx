import Screen from '../../components/Screen'
import InvestmentHeader from '../../components/inversion/InvestmentHeader'
import TotalInvestedCard from '../../components/inversion/TotalInvestedCard'
import InvestmentDistributionCard from '../../components/inversion/InvestmentDistributionCard'
import InvestmentCategoriesCard from '../../components/inversion/InvestmentCategoriesCard'
import InvestmentRecommendationCard from '../../components/inversion/InvestmentRecommendationCard'

export default function InversionPage() {
  const data = {
    totalInvested: 120,
    investedPercent: 27,
    stocks: 60,
    bonds: 24,
    crypto: 24,
    others: 12,
    recommendation:
      'Tu distribución actual tiene bastante peso en activos más volátiles. Antes de aumentar riesgo, conviene reforzar primero tu base de ahorro.',
  }

  return (
    <Screen>
      <InvestmentHeader />

      <TotalInvestedCard
        totalInvested={data.totalInvested}
        investedPercent={data.investedPercent}
      />

      <InvestmentDistributionCard
        stocks={data.stocks}
        bonds={data.bonds}
        crypto={data.crypto}
        others={data.others}
      />
      <InvestmentRecommendationCard message={data.recommendation} />
      
      <InvestmentCategoriesCard
        categories={[
          {
            name: 'Acciones',
            description:
              'Suelen ofrecer más crecimiento a largo plazo, pero con más variación en el corto.',
          },
          {
            name: 'Renta fija',
            description:
              'Normalmente son opciones más estables, con menor riesgo y menor rentabilidad esperada.',
          },
          {
            name: 'Crypto',
            description:
              'Activos muy volátiles. Pueden subir mucho, pero también caer fuerte.',
          },
          {
            name: 'Otros',
            description:
              'Incluye inversiones menos comunes o más específicas como materias primas u otros instrumentos.',
          },
        ]}
      />


    </Screen>
  )
}