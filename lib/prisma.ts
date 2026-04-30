import { PrismaClient } from '@prisma/client'

declare const global: { [key: string]: any }

const prisma = global._PRISMA_CLIENT || new PrismaClient()
if (process.env.NODE_ENV !== 'production') {
  global._PRISMA_CLIENT = prisma
}

export default prisma
