'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setSubmitted(true)
  }

  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-gray-800">Contact Us</h1>
      <p className="mt-2 text-gray-600">Have questions? We would love to hear from you.</p>

      {submitted ? (
        <div className="mt-8 p-6 rounded-xl border bg-green-50 text-green-800">
          <h2 className="font-semibold">Thank you for your message!</h2>
          <p className="mt-2">We will get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <select
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
            >
              <option value="">Select a topic</option>
              <option value="general">General Inquiry</option>
              <option value="supplier">Supplier Partnership</option>
              <option value="reseller">Reseller Program</option>
              <option value="support">Technical Support</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              required
              rows={5}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <button type="submit" className="w-full rounded-lg bg-indigo-600 py-3 text-white font-semibold hover:bg-indigo-700">
            Send Message
          </button>
        </form>
      )}

      <div className="mt-12 p-6 rounded-xl border bg-gray-50">
        <h2 className="font-semibold">Other ways to reach us</h2>
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <p>📧 Email: support@ocop-aihub.vercel.app</p>
          <p>📞 Phone: +84 (0) 123 456 789</p>
          <p>📍 Address: Ho Chi Minh City, Vietnam</p>
        </div>
      </div>
    </main>
  )
}