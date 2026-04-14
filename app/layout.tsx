import './globals.css'
import BottomNav from '../components/BottomNav'
import { AppProvider } from '../components/providers/AppProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AppProvider>
          <div className="app-container">
            <div style={{ flex: 1, overflow: 'auto' }}>
              {children}
            </div>

            <BottomNav />
          </div>
        </AppProvider>
      </body>
    </html>
  )
}