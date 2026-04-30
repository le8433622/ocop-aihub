import prisma from '../../lib/prisma'
import Link from 'next/link'
import { ProductCard } from '../../lib/components/ProductCard'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const stats = {
    suppliers: await prisma.supplier.count(),
    products: await prisma.product.count({ where: { approvalStatus: 'REVIEW' } }),
    orders: await prisma.order.count({ where: { status: 'UNPAID' } }),
    aiGenerations: await prisma.aiGeneration.count(),
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <header className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-4xl mb-2">Platform <span className="text-emerald-700 font-black">Operations</span></h1>
            <p className="text-zinc-500 font-medium">Monitoring OCOP heritage commerce and AIHub performance.</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                System Live
             </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="glass p-8 rounded-3xl border-emerald-500/10">
            <span className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-4">Pending Approval</span>
            <span className="text-5xl font-black text-emerald-900 dark:text-emerald-400">{stats.products}</span>
            <p className="text-sm text-zinc-500 mt-2 font-medium">New OCOP Products</p>
          </div>
          <div className="glass p-8 rounded-3xl border-amber-500/10">
            <span className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-4">Active Suppliers</span>
            <span className="text-5xl font-black text-amber-600">{stats.suppliers}</span>
            <p className="text-sm text-zinc-500 mt-2 font-medium">Verified Cooperatives</p>
          </div>
          <div className="glass p-8 rounded-3xl border-zinc-500/10">
            <span className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-4">Awaiting Payment</span>
            <span className="text-5xl font-black text-zinc-900 dark:text-white">{stats.orders}</span>
            <p className="text-sm text-zinc-500 mt-2 font-medium">Checkout Sessions</p>
          </div>
          <div className="glass p-8 rounded-3xl border-purple-500/10">
            <span className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-4">AI Generations</span>
            <span className="text-5xl font-black text-purple-600">{stats.aiGenerations}</span>
            <p className="text-sm text-zinc-500 mt-2 font-medium">Total AIHub Tasks</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Main Controls */}
          <div className="md:col-span-2 space-y-12">
            <section>
              <h3 className="text-2xl mb-8">Management <span className="text-emerald-700">Modules</span></h3>
              <div className="grid grid-cols-2 gap-6">
                <Link href="/admin/suppliers" className="card-premium group hover:border-emerald-500">
                  <h4 className="text-xl mb-2 font-bold">Suppliers</h4>
                  <p className="text-sm text-zinc-500 mb-6">Approve cooperatives and manage documents.</p>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 group-hover:translate-x-2 transition-transform inline-block">Explore &rarr;</span>
                </Link>
                <Link href="/admin/products" className="card-premium group hover:border-emerald-500">
                  <h4 className="text-xl mb-2 font-bold">Product Review</h4>
                  <p className="text-sm text-zinc-500 mb-6">Verify OCOP star ratings and certificates.</p>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 group-hover:translate-x-2 transition-transform inline-block">Explore &rarr;</span>
                </Link>
                <Link href="/admin/orders" className="card-premium group hover:border-emerald-500">
                  <h4 className="text-xl mb-2 font-bold">Orders</h4>
                  <p className="text-sm text-zinc-500 mb-6">Process payments and update shipping.</p>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 group-hover:translate-x-2 transition-transform inline-block">Explore &rarr;</span>
                </Link>
                <Link href="/admin/audit" className="card-premium group hover:border-emerald-500">
                  <h4 className="text-xl mb-2 font-bold">Audit Logs</h4>
                  <p className="text-sm text-zinc-500 mb-6">Review system actions and state changes.</p>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 group-hover:translate-x-2 transition-transform inline-block">Explore &rarr;</span>
                </Link>
              </div>
            </section>
          </div>

          {/* AIHub Monitoring */}
          <aside>
             <div className="glass p-10 rounded-[2.5rem]">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-2xl font-black">AIHub <span className="text-purple-600">Health</span></h3>
                   <Link href="/api/ai/health" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-purple-600">API &rarr;</Link>
                </div>
                
                <div className="space-y-6">
                   <div className="p-6 rounded-2xl bg-zinc-950 text-white font-mono text-sm border border-zinc-800">
                      <p className="text-emerald-400 mb-2">{`// Active Provider`}</p>
                      <p>NVIDIA_NIM</p>
                      <p className="text-emerald-400 mt-4 mb-2">{`// Current Model`}</p>
                      <p className="text-xs text-zinc-400">llama-3.1-nemotron-70b</p>
                   </div>
                   
                   <div className="space-y-4 pt-4">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-zinc-500">Safety Policy</span>
                         <span className="text-emerald-500 font-bold">ACTIVE</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-zinc-500">Quota Usage</span>
                         <span className="font-bold">12.5%</span>
                      </div>
                      <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                         <div className="w-[12.5%] h-full bg-purple-600"></div>
                      </div>
                   </div>
                </div>

                <div className="mt-10 pt-10 border-t border-zinc-200 dark:border-zinc-800">
                   <button className="btn-primary w-full bg-purple-600 shadow-purple-600/20 text-sm">Review AI Drafts</button>
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
