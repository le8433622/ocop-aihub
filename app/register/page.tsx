import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '../../lib/supabase'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: { message?: string }
}) {
  const signUp = async (formData: FormData) => {
    'use server'
    const supabase = createServerSupabaseClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      return redirect('/register?message=Registration failed')
    }
    return redirect('/login?message=Check your email to confirm registration')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Register</h1>
        {searchParams.message && (
          <p className="mt-4 text-red-600 text-center">{searchParams.message}</p>
        )}
        <form action={signUp} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link href="/login" className="text-green-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </main>
  )
}
