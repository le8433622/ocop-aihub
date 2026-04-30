import Link from 'next/link'

export default function CheckoutPage({ searchParams }: { searchParams: { productId?: string; quantity?: string } }) {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
        {/* Checkout Form */}
        <div className="space-y-12">
          <header>
             <h1 className="text-4xl mb-4">Complete Your <span className="text-emerald-700">Order</span></h1>
             <p className="text-zinc-500">Fast, secure checkout for premium Vietnamese OCOP heritage.</p>
          </header>

          <section className="space-y-6">
            <h3 className="text-xl font-bold">Shipping Information</h3>
            <div className="grid gap-4">
              <input type="text" placeholder="Full Name" className="w-full h-14 px-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
              <input type="email" placeholder="Email Address" className="w-full h-14 px-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
              <div className="grid grid-cols-2 gap-4">
                 <input type="text" placeholder="Phone Number" className="w-full h-14 px-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                 <input type="text" placeholder="City" className="w-full h-14 px-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
              </div>
              <textarea placeholder="Full Shipping Address" className="w-full h-32 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"></textarea>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-bold">Payment Method</h3>
            <div className="grid gap-4">
               <label className="flex items-center gap-4 p-6 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-emerald-500 cursor-pointer">
                  <div className="w-6 h-6 rounded-full border-4 border-emerald-500"></div>
                  <div>
                    <span className="font-bold block">Manual Bank Transfer</span>
                    <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Recommended for high-value OCOP</span>
                  </div>
               </label>
               <label className="flex items-center gap-4 p-6 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 opacity-50 cursor-not-allowed">
                  <div className="w-6 h-6 rounded-full border-2 border-zinc-300"></div>
                  <div>
                    <span className="font-bold block">Cash on Delivery</span>
                    <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Not available for this region</span>
                  </div>
               </label>
            </div>
          </section>

          <button className="btn-secondary w-full py-5 text-xl">Place Order & View Payment Info</button>
        </div>

        {/* Order Summary */}
        <aside>
          <div className="glass p-10 rounded-[2.5rem] sticky top-32">
            <h3 className="text-2xl mb-8">Order <span className="text-emerald-700 font-black">Summary</span></h3>
            <div className="space-y-6 mb-10">
               <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                     <div className="w-16 h-16 rounded-xl bg-zinc-200 dark:bg-zinc-800"></div>
                     <div>
                        <p className="font-bold">Premium OCOP Tea</p>
                        <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Qty: {searchParams.quantity || '1'}</p>
                     </div>
                  </div>
                  <span className="font-black">$45.00</span>
               </div>
            </div>

            <div className="space-y-4 border-t border-zinc-200 dark:border-zinc-800 pt-8 mb-10">
               <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span className="font-bold">$45.00</span>
               </div>
               <div className="flex justify-between text-zinc-500">
                  <span>Shipping Fee</span>
                  <span className="font-bold">$5.00</span>
               </div>
               <div className="flex justify-between items-end pt-4">
                  <span className="text-xl">Total</span>
                  <span className="text-4xl font-black text-emerald-800 dark:text-emerald-400">$50.00</span>
               </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 text-sm flex gap-3">
               <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
               <p>Every purchase supports Vietnamese local cooperatives and preserves cultural heritage.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
