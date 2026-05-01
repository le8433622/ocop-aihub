'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [role, setRole] = useState('customer')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      })
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register')
      }

      // Automatically redirect to login or log them in
      router.push('/login')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
         <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6">
        <div className="glass p-12 rounded-[3rem] border-white/20 shadow-2xl">
          <header className="text-center mb-10">
            <Link href="/" className="text-3xl font-black gradient-text inline-block mb-4">OCOP AIHub</Link>
            <h1 className="text-2xl font-bold">Create Your Account</h1>
            <p className="text-zinc-500 text-sm mt-2">Select your role and join the Vietnamese local specialties ecosystem.</p>
          </header>

          <form onSubmit={handleRegister} className="space-y-6">
            {error && <div className="p-4 bg-red-500/10 text-red-500 rounded-xl text-sm font-bold text-center border border-red-500/20">{error}</div>}

            <div className="grid grid-cols-3 gap-4 mb-10">
               {['Customer', 'Supplier', 'Reseller'].map((r) => (
                 <label key={r} className="cursor-pointer group">
                    <input 
                      type="radio" 
                      name="role" 
                      value={r.toLowerCase()} 
                      checked={role === r.toLowerCase()}
                      onChange={() => setRole(r.toLowerCase())}
                      className="hidden peer" 
                    />
                    <div className="p-4 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-900/20 transition-all text-center">
                       <span className="block font-bold text-sm">{r}</span>
                    </div>
                 </label>
               ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-4">Full Name</label>
                 <input 
                   type="text" 
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   required
                   placeholder="John Doe" 
                   className="w-full h-14 px-8 rounded-2xl bg-white/50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-4">Email Address</label>
                 <input 
                   type="email" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                   placeholder="name@example.com" 
                   className="w-full h-14 px-8 rounded-2xl bg-white/50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                 />
               </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-4">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••" 
                className="w-full h-14 px-8 rounded-2xl bg-white/50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
              />
            </div>

            <button disabled={loading} type="submit" className="btn-primary w-full py-4 text-lg disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-10 text-center">
             <p className="text-sm text-zinc-500">
                Already have an account? <Link href="/login" className="text-emerald-700 font-bold hover:underline">Sign In</Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}
