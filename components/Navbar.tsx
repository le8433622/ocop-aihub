'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: '/products', label: 'Products' },
    { href: '/cart', label: 'Cart' },
    { href: '/supplier', label: 'Supplier' },
    { href: '/reseller', label: 'Reseller' },
    { href: '/admin', label: 'Admin' },
    { href: '/login', label: 'Login' },
  ]

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-green-700">OCOP AIHub</Link>

          <div className="hidden md:flex space-x-6">
            {links.map(l => (
              <Link key={l.href} href={l.href} className="text-gray-700 hover:text-green-600 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="block py-2 text-gray-700 hover:text-green-600"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}