type Props = {
  categories: {
    name: string
    description: string
  }[]
}

export default function InvestmentCategoriesCard({ categories }: Props) {
  return (
    <section
      style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid #e5e5e5',
        marginBottom: '16px',
      }}
    >
      <h2 style={{ margin: '0 0 14px 0', fontSize: '18px' }}>
        Tipos de inversión
      </h2>

      <div style={{ display: 'grid', gap: '12px' }}>
        {categories.map((category) => (
          <div
            key={category.name}
            style={{
              padding: '12px',
              borderRadius: '14px',
              background: '#fafafa',
              border: '1px solid #efefef',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '6px' }}>
              {category.name}
            </div>
            <div style={{ fontSize: '14px', color: '#666', lineHeight: 1.4 }}>
              {category.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}