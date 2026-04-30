export default function CheckoutPage({ searchParams }: { searchParams: { productId?: string; quantity?: string } }) {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
      <p className="mt-4 text-gray-600">
        This checkout uses a server-side transaction: approved-product validation, stock lock/decrement, order creation,
        order items, pending payment record, and audit log.
      </p>
      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-800">Selected item</h2>
        <dl className="mt-4 space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <dt>Product ID</dt>
            <dd>{searchParams.productId ?? 'Not selected'}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Quantity</dt>
            <dd>{searchParams.quantity ?? '1'}</dd>
          </div>
        </dl>
        <p className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
          Sign in first, then submit checkout through <code>/api/checkout</code> with your Supabase bearer token.
          Payment remains <code>PENDING_PAYMENT</code> until verified by webhook or admin action.
        </p>
      </div>
    </main>
  )
}
