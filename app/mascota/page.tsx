'use client'

import Screen from '../../components/Screen'
import MascotHeader from '../../components/mascota/MascotHeader'
import MascotCard from '../../components/mascota/MascotCard'
import ProgressStats from '../../components/mascota/ProgressStats'
import ShopSection from '../../components/mascota/ShopSection'
import { useAppContext } from '../../components/providers/AppProvider'

export default function MascotaPage() {
  const { user, shopItems, equippedItems, buyItem, equipItem } =
    useAppContext()

  const items = [
    { id: 1, name: 'Sombrero mago', price: 200 },
    { id: 2, name: 'Gafas premium', price: 200 },
    { id: 3, name: 'Traje elegante', price: 180 },

    { id: 4, name: 'Skate urbano', price: 220 },
    { id: 5, name: 'Corona dorada', price: 400 },
    { id: 6, name: 'Trofeo dorado', price: 350 },

    { id: 7, name: 'Fondo Penthouse', requiredLevel: 4 },
    { id: 8, name: 'Oficina inversor', requiredLevel: 5 },
    { id: 9, name: 'Isla privada', requiredLevel: 6 },
  ]

  return (
    <Screen>
      <MascotHeader />

      <MascotCard
        name="Porkio"
        level={user.levelLabel}
        xp={user.xp}
        xpMax={user.xpMax}
        equippedItems={equippedItems}
      />

      <ProgressStats
        streak={user.streak}
        missions={user.completedMissions}
      />

      <ShopSection
        coins={user.coins}
        items={items}
        ownedItems={shopItems}
        equippedItems={equippedItems}
        onBuy={buyItem}
        onEquip={equipItem}
      />
    </Screen>
  )
}