'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong!</h2>
          <p className="text-gray-600 mb-6">{error.message || 'An unexpected error occurred'}</p>
          {error.digest && <p className="text-sm text-gray-400 mb-4">Error ID: {error.digest}</p>}
          <button
            onClick={reset}
            className="rounded-lg bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}