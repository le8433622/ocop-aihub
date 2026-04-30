'use client'

import { useEffect, useRef } from 'react'

interface ChartProps {
  data: number[]
  labels: string[]
  title: string
  type?: 'line' | 'bar'
}

export function Chart({ data, labels, title, type = 'line' }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 40

    ctx.clearRect(0, 0, width, height)
    
    const maxVal = Math.max(...data) * 1.1
    const minVal = 0
    const range = maxVal - minVal

    // Draw axes
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw data
    const stepX = (width - 2 * padding) / (data.length - 1)
    const scaleY = (height - 2 * padding) / range

    ctx.strokeStyle = type === 'line' ? '#10b981' : '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()

    data.forEach((val, i) => {
      const x = padding + i * stepX
      const y = height - padding - (val - minVal) * scaleY
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // Fill area for line chart
    if (type === 'line') {
      ctx.fillStyle = type === 'line' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)'
      ctx.lineTo(width - padding, height - padding)
      ctx.lineTo(padding, height - padding)
      ctx.closePath()
      ctx.fill()
    }

    // Draw bars for bar chart
    if (type === 'bar') {
      const barWidth = (width - 2 * padding) / data.length * 0.6
      data.forEach((val, i) => {
        const x = padding + i * stepX - barWidth / 2
        const barHeight = ((val - minVal) / range) * (height - 2 * padding)
        ctx.fillStyle = '#3b82f6'
        ctx.fillRect(x, height - padding - barHeight, barWidth, barHeight)
      })
    }

    // Draw labels
    ctx.fillStyle = '#6b7280'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    labels.forEach((label, i) => {
      const x = padding + i * stepX
      ctx.fillText(label, x, height - padding + 20)
    })

  }, [data, labels, type])

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
      <canvas ref={canvasRef} width={400} height={200} className="w-full" />
    </div>
  )
}