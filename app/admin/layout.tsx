import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-bold text-gray-900">
                Admin Dashboard
              </Link>
              <div className="flex gap-6">
                <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                  Overview
                </Link>
                <Link href="/admin/orders" className="text-gray-600 hover:text-gray-900">
                  Orders
                </Link>
                <Link href="/admin/analytics" className="text-gray-600 hover:text-gray-900">
                  Analytics
                </Link>
                <Link href="/admin/autonomous" className="text-green-600 hover:text-green-700 font-medium">
                  🤖 Autonomous
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}