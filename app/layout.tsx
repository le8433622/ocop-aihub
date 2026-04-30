import './styles/globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'OCOP AIHub',
  description: 'White-Label Commerce Platform for OCOP Products',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-white shadow p-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-green-700">OCOP AIHub</Link>
          <div className="space-x-4">
            <Link href="/products" className="text-gray-700 hover:text-green-600">Products</Link>
            <Link href="/admin" className="text-gray-700 hover:text-green-600">Admin</Link>
            <Link href="/login" className="text-gray-700 hover:text-green-600">Login</Link>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">{children}</main>
        <footer className="bg-gray-800 text-white p-4 text-center">
          © 2026 OCOP AIHub. All rights reserved.
        </footer>
      </body>
    </html>
  )
}
