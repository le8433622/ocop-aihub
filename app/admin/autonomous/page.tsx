'use client'

import { useState, useEffect } from 'react'

interface Task {
  id: string
  type: string
  status: string
  priority: number
  description: string
  branch: string | null
  prurl: string | null
  createdat: string
  updatedat: string
}

export default function AutonomousDashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [newPrompt, setNewPrompt] = useState('')
  const [executing, setExecuting] = useState<string | null>(null)

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/autonomous')
      const data = await res.json()
      setTasks(data.tasks || [])
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
    const interval = setInterval(fetchTasks, 10000)
    return () => clearInterval(interval)
  }, [])

  const createTask = async () => {
    if (!newPrompt.trim()) return
    
    try {
      const res = await fetch('/api/autonomous', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: newPrompt })
      })
      const data = await res.json()
      if (data.task) {
        setTasks([data.task, ...tasks])
        setNewPrompt('')
      }
    } catch (err) {
      console.error('Failed to create task:', err)
    }
  }

  const executeTask = async (taskId: string) => {
    setExecuting(taskId)
    try {
      await fetch('/api/autonomous/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
      })
      fetchTasks()
    } catch (err) {
      console.error('Failed to execute task:', err)
    } finally {
      setExecuting(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'executing': return 'bg-blue-100 text-blue-800'
      case 'reviewing': return 'bg-purple-100 text-purple-800'
      case 'merged': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🤖 Autonomous AIHub</h1>
          <p className="text-gray-600">Self-programming system for OCOP AIHub</p>
        </div>

        {/* Create Task */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              placeholder="Describe what you want AI to build..."
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              onKeyDown={(e) => e.key === 'Enter' && createTask()}
            />
            <button
              onClick={createTask}
              disabled={!newPrompt.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Create Task
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Tasks ({tasks.length})</h2>
            <button onClick={fetchTasks} className="text-sm text-gray-500 hover:text-gray-700">
              Refresh
            </button>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : tasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No tasks yet. Create one above!</div>
          ) : (
            <div className="divide-y">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{task.description}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span>ID: {task.id.slice(0, 8)}...</span>
                        <span>Priority: {task.priority}</span>
                        <span>Created: {new Date(task.createdat).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      {task.status === 'pending' && (
                        <button
                          onClick={() => executeTask(task.id)}
                          disabled={executing === task.id}
                          className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          {executing === task.id ? 'Running...' : 'Execute'}
                        </button>
                      )}
                      {task.prurl && (
                        <a
                          href={task.prurl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View PR
                        </a>
                      )}
                    </div>
                  </div>
                  {task.branch && (
                    <div className="text-sm text-gray-500 mt-1">
                      Branch: <code className="bg-gray-100 px-2 py-0.5 rounded">{task.branch}</code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-gray-900">{tasks.filter(t => t.status === 'pending').length}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-blue-600">{tasks.filter(t => t.status === 'executing').length}</div>
            <div className="text-sm text-gray-500">Executing</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-purple-600">{tasks.filter(t => t.status === 'reviewing').length}</div>
            <div className="text-sm text-gray-500">Reviewing</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-red-600">{tasks.filter(t => t.status === 'failed').length}</div>
            <div className="text-sm text-gray-500">Failed</div>
          </div>
        </div>
      </div>
    </div>
  )
}