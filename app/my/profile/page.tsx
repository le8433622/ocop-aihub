'use client'

import { useState, useEffect } from 'react'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        setUser(d.user)
        setName(d.user?.name ?? '')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const updateProfile = async () => {
    await fetch('/api/auth/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    alert('Profile updated!')
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>

      {user ? (
        <div className="mt-8 space-y-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{user.email}</p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            onClick={updateProfile}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <p className="mt-8 text-gray-500">Please log in to view your profile.</p>
      )}
    </main>
  )
}