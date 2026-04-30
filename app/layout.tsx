import './styles/globals.css'
import Navbar from '../components/Navbar'
import AiChatWidget from '../lib/components/AiChatWidget'
import Link from 'next/link'

export const metadata = {
  title: 'OCOP AIHub | Premium Vietnamese Heritage',
  description: 'The luxury white-label commerce platform for OCOP products, powered by NVIDIA AI.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased selection:bg-emerald-500/30">
        <Navbar />
        
        <main className="min-h-screen">
          {children}
        </main>

        <footer className="bg-zinc-950 text-white py-24 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-16">
            <div className="md:col-span-2">
               <Link href="/" className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-black text-xl">O</div>
                  <span className="text-2xl font-black tracking-tighter">AIHub</span>
               </Link>
               <p className="text-zinc-500 max-w-md leading-relaxed mb-10">
                  Elevating Vietnamese local specialties through the power of artificial intelligence 
                  and modern digital commerce. Empowering cooperatives to reach global standards.
               </p>
               <div className="flex gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center hover:border-emerald-500 transition-colors cursor-pointer">
                       <div className="w-4 h-4 bg-zinc-700 rounded-sm"></div>
                    </div>
                  ))}
               </div>
            </div>
            
            <div>
               <h4 className="font-bold mb-8 uppercase text-xs tracking-widest text-emerald-500">Platform</h4>
               <ul className="space-y-4 text-zinc-400 text-sm font-medium">
                  <li><Link href="/products" className="hover:text-white transition-colors">Product Catalog</Link></li>
                  <li><Link href="/reseller" className="hover:text-white transition-colors">Reseller Network</Link></li>
                  <li><Link href="/supplier" className="hover:text-white transition-colors">Supplier Portal</Link></li>
                  <li><Link href="/admin" className="hover:text-white transition-colors">System Admin</Link></li>
               </ul>
            </div>

            <div>
               <h4 className="font-bold mb-8 uppercase text-xs tracking-widest text-emerald-500">Legal</h4>
               <ul className="space-y-4 text-zinc-400 text-sm font-medium">
                  <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-white transition-colors">OCOP Standards</Link></li>
               </ul>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">© 2026 OCOP AIHub. All rights reserved.</p>
             <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <span>Backed by NVIDIA NIM</span>
                <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                <span>Vietnam Local Product Support</span>
             </p>
          </div>
        </footer>

        {/* Global Components */}
        <AiChatWidget />
      </body>
    </html>
  )
}
