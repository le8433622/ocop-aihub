'use client'

import { useEffect, useState } from 'react'
import { Chart } from '../../../components/Chart'

export default function AnalyticsPage() {
  const [data, setData] = useState({
    orders: [] as number[],
    revenue: [] as number[],
    labels: [] as string[],
  })

  useEffect(() => {
    // Mock data - in production, fetch from API
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    setData({
      orders: [12, 19, 25, 32, 28, 35],
      revenue: [1200000, 1900000, 2500000, 3200000, 2800000, 3500000],
      labels: months,
    })
  }, [])

  return (
    <main className="max-w-6xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
      <p className="mt-2 text-gray-600">Track your store performance over time.</p>

      <div className="mt-8 grid md:grid-cols-4 gap-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-3xl font-bold">171</p>
          <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-3xl font-bold">₫15.1M</p>
          <p className="text-sm text-green-600 mt-2">↑ 18% from last month</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Avg Order Value</p>
          <p className="text-3xl font-bold">₫88K</p>
          <p className="text-sm text-green-600 mt-2">↑ 5% from last month</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Conversion Rate</p>
          <p className="text-3xl font-bold">3.2%</p>
          <p className="text-sm text-red-600 mt-2">↓ 1% from last month</p>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-8">
        <Chart
          data={data.orders}
          labels={data.labels}
          title="Orders by Month"
          type="bar"
        />
        <Chart
          data={data.revenue.map(r => r / 1000)}
          labels={data.labels}
          title="Revenue (K VND) by Month"
          type="line"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Top Products</h2>
        <div className="rounded-xl border bg-white overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { name: 'Premium Honey', orders: 45, revenue: 4500000 },
                { name: 'Organic Tea', orders: 38, revenue: 3040000 },
                { name: 'Dried Fruits', orders: 28, revenue: 1960000 },
                { name: 'Coffee Beans', orders: 22, revenue: 2200000 },
                { name: 'Handicrafts', orders: 18, revenue: 1800000 },
              ].map((p, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">{p.name}</td>
                  <td className="px-6 py-4">{p.orders}</td>
                  <td className="px-6 py-4">₫{p.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}