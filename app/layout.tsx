import './globals.css'
import { AppProvider } from '../components/providers/AppProvider'
import AuthGuard from '../components/AuthGuard'
import AppShell from '../components/AppShell'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthGuard>
          <AppProvider>
            <AppShell>{children}</AppShell>
          </AppProvider>
        </AuthGuard>
      </body>
    </html>
  )
}