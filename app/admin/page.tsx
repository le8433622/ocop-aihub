import { getUserIdFromRequest } from '../../../lib/auth'
import { Pool } from 'pg'

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'ocopdb3',
  user: 'postgres',
  password: '',
})

export default async function AdminDashboard() {
  const users = await pool.query('SELECT count(*) as count FROM users')
  const products = await pool.query('SELECT count(*) as count FROM products')
  const orders = await pool.query('SELECT count(*) as count FROM orders')
  const audit = await pool.query('SELECT action, count(*) as cnt FROM audit_logs GROUP BY action')
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <h2>Users</h2>
          <p className="text-xl">{users.rows[0].count}</p>
        </div>
        <div className="p-4 border rounded">
          <h2>Products</h2>
          <p className="text-xl">{products.rows[0].count}</p>
        </div>
        <div className="p-4 border rounded">
          <h2>Orders</h2>
          <p className="text-xl">{orders.rows[0].count}</p>
        </div>
      </div>
      <h2 className="mt-8">Audit Log Actions</h2>
      <ul>
        {audit.rows.map((row: any) => (
          <li key={row.action}>{row.action}: {row.cnt}</li>
        ))}
      </ul>
    </main>
  )
}
