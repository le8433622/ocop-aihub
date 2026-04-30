import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg px-6">
        <div className="glass p-12 rounded-[3rem] border-white/20 shadow-2xl">
          <header className="text-center mb-10">
            <Link href="/" className="text-3xl font-black gradient-text inline-block mb-4">OCOP AIHub</Link>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-zinc-500 text-sm mt-2">Sign in to manage your OCOP heritage journey.</p>
          </header>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-4">Email Address</label>
              <input type="email" placeholder="name@example.com" className="w-full h-14 px-8 rounded-2xl bg-white/50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Password</label>
                <Link href="#" className="text-xs font-bold text-emerald-700 hover:underline">Forgot?</Link>
              </div>
              <input type="password" placeholder="••••••••" className="w-full h-14 px-8 rounded-2xl bg-white/50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>

            <button type="submit" className="btn-primary w-full py-4 text-lg">Sign In</button>
          </form>

          <div className="mt-10 text-center">
             <p className="text-sm text-zinc-500">
                New to the platform? <Link href="/register" className="text-emerald-700 font-bold hover:underline">Create an account</Link>
             </p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-zinc-400 font-medium uppercase tracking-widest">
           Secure Infrastructure by NVIDIA NIM & Supabase
        </div>
      </div>
    </div>
  )
}
