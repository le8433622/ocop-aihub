import Link from 'next/link'

export default function CartPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl mb-12">Your <span className="text-emerald-700">Selection</span></h1>

        <div className="grid gap-8">
          {/* Cart Item Placeholder */}
          <div className="glass p-6 rounded-3xl flex gap-6 items-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-100 to-amber-100 flex-shrink-0"></div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">Premium OCOP Tea</h3>
              <p className="text-zinc-500 text-sm">5 Stars Certification</p>
            </div>
            <div className="flex items-center gap-4">
               <span className="font-black text-xl">$45.00</span>
               <div className="w-24 h-10 bg-white/50 dark:bg-black/50 rounded-full flex items-center justify-around px-2 border border-zinc-200 dark:border-zinc-800">
                  <button className="font-bold">-</button>
                  <span className="font-bold">1</span>
                  <button className="font-bold">+</button>
               </div>
               <button className="text-destructive font-bold ml-4">✕</button>
            </div>
          </div>

          <div className="mt-12 border-t border-zinc-200 dark:border-zinc-800 pt-8 flex justify-between items-end">
            <div>
              <p className="text-zinc-500 mb-1">Subtotal</p>
              <p className="text-4xl font-black">$45.00</p>
            </div>
            <Link href="/checkout" className="btn-primary px-12 py-4 text-lg">Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
