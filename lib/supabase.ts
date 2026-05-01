import { createClient } from '@supabase/supabase-js'

function requireEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export function createServerSupabaseClient() {
  return createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_ANON_KEY'))
}

export function createRequestSupabaseClient(req: Request) {
  const authHeader = req.headers.get('Authorization') ?? ''
  return createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_ANON_KEY'), {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  })
}

export async function getBearerUser(req: Request) {
  const authHeader = req.headers.get('Authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!token) return null

  const supabase = createRequestSupabaseClient(req)
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return null
  return data.user
}

export type UserRole = 'ADMIN' | 'SUPPLIER' | 'RESELLER' | 'CUSTOMER' | null

export async function getUserRole(supabase: any, userId: string): Promise<UserRole> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (error || !data) return 'CUSTOMER'
  return data.role as UserRole
}

export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions: Record<string, string[]> = {
    ADMIN: ['admin:access', 'products:write', 'orders:write', 'reports:access', 'coupons:write', 'suppliers:write'],
    SUPPLIER: ['products:write', 'products:own', 'orders:access'],
    RESELLER: ['checkout:create', 'orders:access'],
    CUSTOMER: ['checkout:create', 'orders:own', 'wishlist:write', 'reviews:write'],
  }
  return permissions[role || 'CUSTOMER']?.includes(permission) ?? false
}

export async function requireRole(req: Request, allowedRoles: UserRole[]): Promise<{ user: any; role: UserRole } | null> {
  const user = await getBearerUser(req)
  if (!user) return null

  const supabase = createRequestSupabaseClient(req)
  const role = await getUserRole(supabase, user.id)

  if (!allowedRoles.includes(role)) return null
  return { user, role }
}

export async function requireAdmin(req: Request) {
  const result = await requireRole(req, ['ADMIN'])
  if (!result) {
    return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403 })
  }
  return result
}

export async function requireSupplier(req: Request) {
  const result = await requireRole(req, ['ADMIN', 'SUPPLIER'])
  if (!result) {
    return new Response(JSON.stringify({ error: 'Supplier access required' }), { status: 403 })
  }
  return result
}
