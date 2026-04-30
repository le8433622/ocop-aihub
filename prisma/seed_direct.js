const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const email = 'admin@example.com'
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log('Admin already exists')
    return
  }
  const hash = await bcrypt.hash('password', 10)
  await prisma.user.create({
    data: {
      email,
      name: 'Admin',
      passwordHash: hash,
      isActive: true,
    }
  })
  console.log('Admin seeded')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
