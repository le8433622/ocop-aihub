import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-black gradient-text">OCOP AIHub</Link>
          <div className="hidden md:flex gap-8 items-center text-sm font-semibold uppercase tracking-widest">
            <Link href="/products" className="hover:text-amber-500 transition-colors">Catalog</Link>
            <Link href="/reseller" className="hover:text-amber-500 transition-colors">Storefronts</Link>
            <Link href="/admin" className="hover:text-amber-500 transition-colors">Admin</Link>
            <Link href="/login" className="btn-primary py-2 px-6">Sign In</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/hero.png" 
              alt="Luxury OCOP" 
              fill 
              className="object-cover brightness-[0.4]"
              priority
            />
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-8xl text-white mb-6 drop-shadow-2xl">
              Vietnamese <span className="text-amber-400">Heritage</span>, <br/>
              Modern <span className="text-emerald-400">Elegance</span>.
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Discover curated OCOP products from Vietnam&apos;s finest producers, 
              verified by AI, and delivered with premium quality.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-secondary text-lg px-10 py-4">Shop the Collection</Link>
              <Link href="/register" className="btn-primary text-lg px-10 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-emerald-900">Become a Supplier</Link>
            </div>
          </div>
        </section>

        {/* Featured Section */}
        <section className="py-24 bg-white dark:bg-zinc-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h2 className="text-4xl md:text-5xl mb-4">Masterpiece <span className="text-amber-500">Selections</span></h2>
                <p className="text-zinc-500 max-w-lg">Hand-picked 5-star OCOP products representing the pinnacle of Vietnamese craftsmanship.</p>
              </div>
              <Link href="/products" className="text-emerald-700 font-bold hover:underline mb-2">View all 120+ products &rarr;</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-premium group">
                  <div className="relative h-64 mb-6 rounded-xl overflow-hidden bg-zinc-100">
                    <div className="absolute top-4 right-4 z-10 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      5 STARS OCOP
                    </div>
                    <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-amber-100 flex items-center justify-center">
                      <span className="text-zinc-400 font-serif italic text-4xl opacity-50">OCOP Product {i}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl mb-2 group-hover:text-emerald-700 transition-colors">Premium Highlands Coffee</h3>
                  <p className="text-zinc-500 text-sm mb-4 line-clamp-2">Authentic Arabica coffee from Da Lat, processed using traditional methods with a modern touch.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black text-zinc-900 dark:text-white">$45.00</span>
                    <button className="text-emerald-700 font-bold uppercase text-xs tracking-widest border-b-2 border-transparent hover:border-emerald-700 transition-all py-1">Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AIHub Teaser */}
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div className="glass p-12 rounded-[2.5rem] border-emerald-500/20">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/20">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h2 className="text-4xl mb-6">AI-Powered <span className="text-emerald-600">Shopping</span></h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                Our AIHub helps you find the perfect Vietnamese gift. Ask about origins, 
                flavor profiles, or request a custom gift combo tailored to your budget 
                and occasion.
              </p>
              <div className="p-4 bg-white/50 dark:bg-black/50 rounded-xl border border-white/20 mb-8 font-mono text-sm text-emerald-700">
                &quot;Hi! I need a gift set for a tea lover who likes floral notes...&quot;
              </div>
              <button className="btn-primary w-full md:w-auto">Talk to AI Assistant</button>
            </div>
            <div className="relative">
               <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl"></div>
               <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"></div>
               <h3 className="text-6xl font-black opacity-10 uppercase tracking-tighter leading-none mb-4">Intelligence</h3>
               <h3 className="text-6xl font-black opacity-10 uppercase tracking-tighter leading-none mb-4">Heritage</h3>
               <h3 className="text-6xl font-black opacity-10 uppercase tracking-tighter leading-none mb-4">Quality</h3>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 bg-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <h2 className="text-3xl font-black text-amber-400 mb-6">OCOP AIHub</h2>
            <p className="text-zinc-400 max-w-md">The premier platform for Vietnamese OCOP products, connecting local producers with the world through technology and trust.</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-zinc-100">Platform</h4>
            <ul className="space-y-4 text-zinc-400">
              <li><Link href="/products">All Products</Link></li>
              <li><Link href="/reseller">Storefronts</Link></li>
              <li><Link href="/supplier">Suppliers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-zinc-100">Company</h4>
            <ul className="space-y-4 text-zinc-400">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
