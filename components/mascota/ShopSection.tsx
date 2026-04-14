type Item = {
  id: number
  name: string
  price?: number
  requiredLevel?: number
}

type OwnedItem = {
  id: number
  owned: boolean
}

type EquippedItems = {
  hat?: number
  glasses?: number
  outfit?: number
}

type Props = {
  items: Item[]
  ownedItems: OwnedItem[]
  equippedItems: EquippedItems
  coins: number
  onBuy: (id: number, price: number) => void
  onEquip: (id: number) => void
}

export default function ShopSection({
  items,
  ownedItems,
  equippedItems,
  coins,
  onBuy,
  onEquip,
}: Props) {
  return (
    <section>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '18px' }}>Tienda</h2>

        <div
          style={{
            background: '#f6d7a8',
            padding: '6px 10px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 700,
          }}
        >
          🪙 {coins} monedas
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
        }}
      >
        {items.map((item) => {
          const ownedItem = ownedItems.find((i) => i.id === item.id)
          const isOwned = ownedItem?.owned ?? false

          const isEquippable = [1, 2, 3].includes(item.id)

          const isEquipped =
            equippedItems.hat === item.id ||
            equippedItems.glasses === item.id ||
            equippedItems.outfit === item.id

          const isLocked =
            item.requiredLevel !== undefined && !isOwned

          return (
            <div
              key={item.id}
              onClick={() => {
                if (isOwned && isEquippable) {
                  onEquip(item.id)
                } else if (!isOwned && item.price) {
                  onBuy(item.id, item.price)
                }
              }}
              style={{
                borderRadius: '16px',
                padding: '12px',
                border: '1px solid #e5e5e5',
                background: isOwned ? '#e9f9f1' : '#fff',
                opacity: isLocked ? 0.6 : 1,
                textAlign: 'center',
                cursor:
                  (!isOwned && item.price) || (isOwned && isEquippable)
                    ? 'pointer'
                    : 'default',
              }}
            >
              <div style={{ fontSize: '26px', marginBottom: '6px' }}>
                {item.id === 1 && '🎩'}
                {item.id === 2 && '🕶️'}
                {item.id === 3 && '👔'}
                {item.id === 4 && '🛹'}
                {item.id === 5 && '👑'}
                {item.id === 6 && '🏆'}
                {item.id === 7 && '🏙️'}
                {item.id === 8 && '💼'}
                {item.id === 9 && '🏝️'}
              </div>

              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '6px',
                }}
              >
                {item.name}
              </div>

              {isEquipped && (
                <div style={{ fontSize: '12px', color: '#3d8cff' }}>
                  Equipado
                </div>
              )}

              {!isEquipped && isOwned && isEquippable && (
                <div style={{ fontSize: '12px', color: '#1ea672' }}>
                  ✓ Tuyo
                </div>
              )}

              {!isEquipped && isOwned && !isEquippable && (
                <div style={{ fontSize: '12px', color: '#1ea672' }}>
                  ✓ Comprado
                </div>
              )}

              {!isOwned && !isLocked && item.price && (
                <div style={{ fontSize: '12px', color: '#6d49ff' }}>
                  {item.price} 🪙
                </div>
              )}

              {isLocked && (
                <div style={{ fontSize: '12px', color: '#999' }}>
                  Nv. {item.requiredLevel}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}