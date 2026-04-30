import prisma from '../../lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function SupplierDashboard() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <header className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-4xl mb-2">Supplier <span className="text-emerald-700 font-black">Portal</span></h1>
            <p className="text-zinc-500 font-medium">Manage your OCOP products and certificates.</p>
          </div>
          <Link href="/supplier/products/new" className="btn-primary">Add New Product</Link>
        </header>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <section className="glass p-10 rounded-[2.5rem]">
              <h3 className="text-2xl mb-8 font-bold">Your Products</h3>
              <div className="space-y-6">
                 {/* Placeholder for product list */}
                 <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                       <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800"></div>
                       <div>
                          <p className="font-bold">Premium Honey</p>
                          <p className="text-xs text-zinc-400 uppercase font-bold tracking-widest">Status: Approved</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <button className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-emerald-700">Edit</button>
                       <button className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-destructive">Delete</button>
                    </div>
                 </div>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="glass p-8 rounded-3xl">
               <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-zinc-400">Inventory Status</h4>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-sm">Total SKUs</span>
                     <span className="font-black">12</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-600">
                     <span className="text-sm font-bold">Low Stock Alert</span>
                     <span className="font-black">2</span>
                  </div>
               </div>
            </div>

            <div className="glass p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500/10">
               <h4 className="font-bold mb-4 text-emerald-800 dark:text-emerald-400 uppercase text-xs tracking-widest">OCOP Support</h4>
               <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-6">Need help with your 5-star certification? Use our AI assistant to validate your application docs.</p>
               <button className="text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-400 underline">Start Validation &rarr;</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
