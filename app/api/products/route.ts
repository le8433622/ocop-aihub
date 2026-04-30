import { NextResponse } from 'next/server'
import { getUserIdFromRequest } from '../../../lib/auth'
import prisma from '../../../lib/prisma'

export async function GET(req: Request) {
  // Basic auth check via token
  const userId = getUserIdFromRequest(req)
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }
  const products = await prisma.product.findMany({ take: 100 })
  return NextResponse.json({ products })
}

export async function POST(req: Request) {
  const userId = getUserIdFromRequest(req)
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }
  const body = await req.json()
  if (!body.name || !body.price) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 })
  }
  const product = await prisma.product.create({ data: { name: body.name, price: Number(body.price), description: body.description } })
  return NextResponse.json({ product })
}
