'use client'

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin`} />
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}

export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}