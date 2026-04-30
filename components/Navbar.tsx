'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

const links = [
    { href: '/products', label: 'Products' },
    { href: '/cart', label: 'Cart' },
    { href: '/my/wishlist', label: 'Wishlist' },
    { href: '/track', label: 'Track' },
    { href: '/supplier', label: 'Supplier' },
    { href: '/reseller', label: 'Reseller' },
    { href: '/admin', label: 'Admin' },
    { href: '/login', label: 'Login' },
  ]

  return (
    <nav className={`fixed top-0 left-0 w-full z-[80] transition-all duration-500 ${
      isScrolled ? 'py-4' : 'py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`glass px-8 h-20 rounded-[2rem] flex items-center justify-between border-white/20 shadow-2xl transition-all ${
          isScrolled ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl' : 'bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl'
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-700/20 group-hover:rotate-12 transition-transform">O</div>
            <span className="text-2xl font-black tracking-tighter gradient-text">AIHub</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {links.map(link => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-emerald-700 ${
                  pathname === link.href ? 'text-emerald-700' : 'text-zinc-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2"></div>
            <Link href="/cart" className="relative group">
              <svg className="w-6 h-6 text-zinc-500 group-hover:text-emerald-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-700 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-950">2</span>
            </Link>
            <Link href="/login" className="btn-primary py-3 px-8 text-xs">Sign In</Link>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-zinc-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 glass p-8 rounded-[2.5rem] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col gap-6">
              {links.map(link => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold text-zinc-700"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-zinc-100 dark:border-zinc-800" />
              <Link href="/login" className="btn-primary text-center">Sign In</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}