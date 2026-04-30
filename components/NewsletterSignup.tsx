'use client'

import { useState } from 'react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    
    if (res.ok) {
      setStatus('success')
      setEmail('')
    } else {
      setStatus('error')
    }
  }

  return (
    <section className="py-20 bg-emerald-900 text-white">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-emerald-200 mb-8">Get the latest OCOP products and exclusive offers delivered to your inbox.</p>
        
        {status === 'success' ? (
          <div className="p-4 bg-emerald-800 rounded-lg">
            ✓ Thanks for subscribing! Check your email for confirmation.
          </div>
        ) : (
          <form onSubmit={subscribe} className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 disabled:opacity-50"
            >
              {status === 'loading' ? '...' : 'Subscribe'}
            </button>
          </form>
        )}
        {status === 'error' && <p className="mt-2 text-red-300">Something went wrong. Please try again.</p>}
      </div>
    </section>
  )
}