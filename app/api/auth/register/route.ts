import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../lib/supabase'
import prisma from '../../../../lib/prisma'

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { email, password, name, role = 'CUSTOMER' } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role }
      }
    })

    if (authError || !authData.user) {
      return NextResponse.json({ error: authError?.message || 'Failed to register' }, { status: 400 })
    }

    // 2. Create user in Prisma DB
    // Because Supabase handles the actual user ID, we will sync it.
    await prisma.user.create({
      data: {
        id: authData.user.id,
        email: email,
        name: name,
        role: role.toUpperCase(),
      }
    })

    return NextResponse.json({ success: true, user: authData.user })

  } catch (e: any) {
    console.error('[REGISTER_ERROR]', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
