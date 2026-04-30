import './styles/globals.css'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'OCOP AIHub',
  description: 'White-Label Commerce Platform for OCOP Products',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen bg-gray-50">{children}</main>
        <footer className="bg-gray-800 text-white p-4 text-center">
          © 2026 OCOP AIHub. All rights reserved.
        </footer>
      </body>
    </html>
  )
}
