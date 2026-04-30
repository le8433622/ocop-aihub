import Link from 'next/link'

export default function ResellerDashboard() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <header className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-4xl mb-2">Reseller <span className="text-emerald-700 font-black">Studio</span></h1>
            <p className="text-zinc-500 font-medium">Build your storefront and grow your OCOP community.</p>
          </div>
          <button className="btn-secondary">Visit My Storefront</button>
        </header>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
            <section className="glass p-10 rounded-[2.5rem]">
               <h3 className="text-2xl mb-8 font-bold">Marketing <span className="text-purple-600">Assistant</span></h3>
               <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 text-white">
                  <p className="text-zinc-400 mb-6 font-mono text-sm">{`// Generate social media post for "Premium Honey"`}</p>
                  <div className="space-y-4 mb-8">
                     <div className="h-4 bg-zinc-800 rounded-full w-3/4 animate-pulse"></div>
                     <div className="h-4 bg-zinc-800 rounded-full w-full animate-pulse"></div>
                     <div className="h-4 bg-zinc-800 rounded-full w-1/2 animate-pulse"></div>
                  </div>
                  <button className="btn-primary w-full bg-purple-600 shadow-purple-600/20">Generate Content</button>
               </div>
            </section>

            <section className="grid grid-cols-2 gap-8">
               <Link href="/reseller/products" className="card-premium group hover:border-emerald-500">
                  <h4 className="text-xl mb-2 font-bold">Select Products</h4>
                  <p className="text-sm text-zinc-500 mb-6">Browse and add approved OCOP items to your shop.</p>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 group-hover:translate-x-2 transition-transform inline-block">Explore &rarr;</span>
               </Link>
               <Link href="/reseller/storefront" className="card-premium group hover:border-emerald-500">
                  <h4 className="text-xl mb-2 font-bold">Store Settings</h4>
                  <p className="text-sm text-zinc-500 mb-6">Customize colors, logo, and your brand story.</p>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 group-hover:translate-x-2 transition-transform inline-block">Settings &rarr;</span>
               </Link>
            </section>
          </div>

          <aside className="space-y-8">
             <div className="glass p-8 rounded-3xl">
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-zinc-400">Your Earnings</h4>
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <span className="text-sm">Total Commissions</span>
                      <span className="text-4xl font-black">$1,240</span>
                   </div>
                   <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-emerald-500"></div>
                   </div>
                   <p className="text-xs text-zinc-400 font-medium">Next payout: May 15, 2026</p>
                </div>
             </div>

             <div className="glass p-8 rounded-3xl border-purple-500/10">
                <h4 className="font-bold mb-4 text-purple-600 uppercase text-xs tracking-widest">AI Insights</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">&quot;Honey and Dried Fruits are trending in your region. Consider creating a &apos;Healthy Mornings&apos; gift combo.&quot;</p>
                <button className="text-xs font-bold uppercase tracking-widest text-purple-600 underline">Create Combo &rarr;</button>
             </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
