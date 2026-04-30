const RATE_LIMIT_WINDOW = 60 // seconds
const RATE_LIMIT_MAX = 100 // max requests per window

const requestCounts = new Map<string, { count: number, resetTime: number }>()

export async function rateLimitCheck(req: Request): Promise<boolean> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] 
    || req.headers.get('x-real-ip') 
    || 'unknown'
  
  const now = Date.now()
  const record = requestCounts.get(ip)
  
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW * 1000 })
    return true
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return false
  }
  
  record.count++
  return true
}

export const RATE_LIMIT_CONFIG = {
  window: RATE_LIMIT_WINDOW,
  max: RATE_LIMIT_MAX,
}