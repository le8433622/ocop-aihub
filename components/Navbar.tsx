'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Notification {
  id: string
  title: string
  message: string
  read: boolean
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotif, setShowNotif] = useState(false)

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(d => setNotifications(d.notifications ?? []))
      .catch(() => {})
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markRead = async (id: string) => {
    await fetch(`/api/notifications?id=${id}`, { method: 'PATCH' })
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const links = [
    { href: '/products', label: 'Products' },
    { href: '/cart', label: 'Cart' },
    { href: '/my/wishlist', label: 'Wishlist' },
    { href: '/track', label: 'Track' },
    { href: '/contact', label: 'Contact' },
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

          <div className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <Link key={l.href} href={l.href} className="text-gray-700 hover:text-green-600 transition-colors">
                {l.label}
              </Link>
            ))}
            <div className="relative">
              <button onClick={() => setShowNotif(!showNotif)} className="relative text-gray-700 hover:text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotif && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border overflow-hidden">
                  <div className="p-3 border-b font-semibold">Notifications</div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-3 text-gray-500 text-sm">No notifications</p>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div
                          key={n.id}
                          onClick={() => markRead(n.id)}
                          className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${!n.read ? 'bg-blue-50' : ''}`}
                        >
                          <p className="font-medium text-sm">{n.title}</p>
                          <p className="text-xs text-gray-500">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
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