'use client'

import { useState, useEffect, useRef } from 'react'

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

interface ChatMessage {
  role: 'user' | 'ai' | 'system'
  text: string
  taskId?: string
}

export default function AutonomousDashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [newPrompt, setNewPrompt] = useState('')
  const [executing, setExecuting] = useState<string | null>(null)
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: 'Xin chào! 👋\n\nTôi là AIHub Assistant. Bạn có thể:\n\n• Yêu cầu tôi viết code, tạo feature mới\n• Hỏi về trạng thái hệ thống\n• Tạo và chạy task tự động\n• Xem logs và debug\n\nVí dụ: "Thêm một API endpoint để lấy danh sách sản phẩm" hoặc "Fix bug login"' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const createTask = async (description?: string) => {
    const prompt = description || newPrompt
    if (!prompt.trim()) return
    
    try {
      const res = await fetch('/api/autonomous', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()
      if (data.task) {
        setTasks([data.task, ...tasks])
        setNewPrompt('')
        return data.task
      }
    } catch (err) {
      console.error('Failed to create task:', err)
    }
    return null
  }

  const executeTask = async (taskId: string) => {
    setExecuting(taskId)
    try {
      const res = await fetch('/api/autonomous/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
      })
      const data = await res.json()
      fetchTasks()
      return data
    } catch (err) {
      console.error('Failed to execute task:', err)
      return null
    } finally {
      setExecuting(null)
    }
  }

  const handleChat = async () => {
    if (!chatInput.trim() || chatLoading) return
    
    const userInput = chatInput.trim()
    setChatInput('')
    setMessages(prev => [...prev, { role: 'user', text: userInput }])
    setChatLoading(true)

    try {
      // Check if it's a command
      const lowerInput = userInput.toLowerCase()
      
      if (lowerInput.startsWith('create ') || lowerInput.startsWith('tạo ')) {
        // Create task
        const task = await createTask(userInput.replace(/^(create|tạo)\s+/i, ''))
        if (task) {
          setMessages(prev => [...prev, { 
            role: 'ai', 
            text: `✅ Đã tạo task!\n\n**Task ID:** ${task.id.slice(0, 8)}\n**Description:** ${task.description}\n**Status:** ${task.status}\n\nBạn có muốn tôi execute task này không?`,
            taskId: task.id
          }])
        }
      } else if (lowerInput.startsWith('execute ') || lowerInput.startsWith('chạy ')) {
        // Find task by ID or description and execute
        const taskId = userInput.match(/[a-f0-9]{8,}/i)?.[0]
        if (taskId) {
          const result = await executeTask(taskId)
          if (result?.success) {
            setMessages(prev => [...prev, { 
              role: 'ai', 
              text: `🚀 Đã trigger execution!\n\n**Output:** ${result.output}\n\nWorkflow đang chạy trên GitHub Actions. Bạn có thể xem tiến trình tại: ${result.runUrl || 'GitHub Actions'}`
            }])
          }
        }
      } else if (lowerInput === 'tasks' || lowerInput === 'danh sách task') {
        // Show tasks
        const pendingTasks = tasks.filter(t => t.status === 'pending')
        const otherTasks = tasks.filter(t => t.status !== 'pending').slice(0, 5)
        
        let response = '📋 **Danh sách tasks:**\n\n'
        response += '**Pending:**\n'
        if (pendingTasks.length === 0) response += '  Không có task nào\n'
        else pendingTasks.forEach(t => response += `  - ${t.description.slice(0, 40)}... [${t.id.slice(0, 8)}]\n`)
        
        response += '\n**Đang chạy/Gần đây:**\n'
        otherTasks.forEach(t => response += `  - ${t.status}: ${t.description.slice(0, 30)}...\n`)
        
        setMessages(prev => [...prev, { role: 'ai', text: response }])
      } else if (lowerInput.startsWith('status ') || lowerInput.startsWith('trạng thái ')) {
        // Get specific task status
        const taskId = userInput.match(/[a-f0-9]{8,}/i)?.[0]
        const task = tasks.find(t => t.id.includes(taskId))
        if (task) {
          setMessages(prev => [...prev, { 
            role: 'ai', 
            text: `📊 **Task Status:**\n\n**ID:** ${task.id}\n**Description:** ${task.description}\n**Status:** ${task.status}\n**Branch:** ${task.branch || 'N/A'}\n**PR:** ${task.prurl || 'Chưa tạo'}\n**Created:** ${new Date(task.createdat).toLocaleString()}\n**Updated:** ${new Date(task.updatedat).toLocaleString()}`
          }])
        } else {
          setMessages(prev => [...prev, { role: 'ai', text: 'Không tìm thấy task. ID phải có ít nhất 8 ký tự.' }])
        }
      } else if (lowerInput === 'help' || lowerInput === 'trợ giúp') {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: `📖 **Commands available:**\n\n• \`create [task]\` - Tạo task mới\n• \`execute [task_id]\` - Chạy task\n• \`tasks\` - Xem danh sách task\n• \`status [task_id]\` - Xem trạng thái task\n• \`help\` - Xem help\n\nBạn cũng có thể chat thường để tôi phân tích và thực hiện!` 
        }])
      } else {
        // Use AI to process the request
        const res = await fetch('/api/aihub/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskType: 'CODE_GENERATION',
            input: { 
              prompt: `You are the AIHub Autonomous System. Analyze this request and take appropriate action.\n\nUser request: ${userInput}\n\nCurrent tasks in system: ${tasks.map(t => `${t.id}: ${t.status} - ${t.description}`).join(', ')}\n\nRespond with action to take and explanation. If code needs to be written, respond with "CREATE_TASK:" followed by the task description.`
            }
          })
        })
        
        const data = await res.json()
        
        if (data.response) {
          // Check if AI suggests creating a task
          if (data.response.includes('CREATE_TASK:')) {
            const taskDesc = data.response.split('CREATE_TASK:')[1].trim()
            const task = await createTask(taskDesc)
            if (task) {
              setMessages(prev => [...prev, { 
                role: 'ai', 
                text: `Tôi đã phân tích yêu cầu và tạo task cho bạn:\n\n✅ **Task created:** ${task.description}\n\n**ID:** ${task.id.slice(0, 8)}...\n**Status:** ${task.status}\n\nBạn có muốn tôi execute task này luôn không?`
              }])
            }
          } else {
            setMessages(prev => [...prev, { role: 'ai', text: data.response }])
          }
        } else {
          setMessages(prev => [...prev, { role: 'ai', text: 'Tôi gặp lỗi khi xử lý. Bạn thử lại nhé!' }])
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Lỗi kết nối. Vui lòng thử lại.' }])
    } finally {
      setChatLoading(false)
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🤖 AIHub Autonomous Console</h1>
          <p className="text-gray-600">Chat với AI để lập trình hệ thống</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Chat Panel */}
          <div className="bg-white rounded-lg shadow flex flex-col h-[600px]">
            <div className="p-4 border-b bg-green-50">
              <h2 className="text-lg font-semibold text-green-800">💬 Chat với AIHub</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-green-600 text-white' 
                      : msg.role === 'system'
                      ? 'bg-yellow-100 text-yellow-800 text-sm'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <pre className="whitespace-pre-wrap font-sans text-sm">{msg.text}</pre>
                    {msg.taskId && (
                      <button 
                        onClick={() => executeTask(msg.taskId!)}
                        className="mt-2 text-xs bg-green-700 px-2 py-1 rounded hover:bg-green-800"
                      >
                        ▶ Execute
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <span className="text-gray-400">Đang xử lý...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Nhập yêu cầu... (hoặc gõ 'help' để xem commands)"
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                />
                <button
                  onClick={handleChat}
                  disabled={chatLoading || !chatInput.trim()}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="flex flex-col">
            <div className="bg-white rounded-lg shadow flex-1">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-semibold">📋 Tasks ({tasks.length})</h2>
                <button onClick={fetchTasks} className="text-sm text-gray-500 hover:text-gray-700">
                  Refresh
                </button>
              </div>
              
              {/* Create Task */}
              <div className="p-4 border-b">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    placeholder="Tạo task mới..."
                    className="flex-1 px-3 py-2 border rounded text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && createTask()}
                  />
                  <button
                    onClick={() => createTask()}
                    disabled={!newPrompt.trim()}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Create
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : tasks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No tasks</div>
              ) : (
                <div className="divide-y max-h-[400px] overflow-y-auto">
                  {tasks.map((task) => (
                    <div key={task.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{task.description}</p>
                          <div className="flex gap-3 mt-1 text-xs text-gray-500">
                            <span className="font-mono">{task.id.slice(0, 8)}</span>
                            <span>{new Date(task.createdat).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          {(task.status === 'pending' || task.status === 'failed') && (
                            <button
                              onClick={() => executeTask(task.id)}
                              disabled={executing === task.id}
                              className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                            >
                              {executing === task.id ? '...' : 'Run'}
                            </button>
                          )}
                          {task.prurl && (
                            <a href={task.prurl} target="_blank" className="text-blue-500 text-xs hover:underline">
                              PR
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              <div className="bg-white rounded-lg shadow p-3 text-center">
                <div className="text-xl font-bold text-yellow-600">{tasks.filter(t => t.status === 'pending').length}</div>
                <div className="text-xs text-gray-500">Pending</div>
              </div>
              <div className="bg-white rounded-lg shadow p-3 text-center">
                <div className="text-xl font-bold text-blue-600">{tasks.filter(t => t.status === 'executing').length}</div>
                <div className="text-xs text-gray-500">Running</div>
              </div>
              <div className="bg-white rounded-lg shadow p-3 text-center">
                <div className="text-xl font-bold text-purple-600">{tasks.filter(t => t.status === 'reviewing').length}</div>
                <div className="text-xs text-gray-500">Review</div>
              </div>
              <div className="bg-white rounded-lg shadow p-3 text-center">
                <div className="text-xl font-bold text-red-600">{tasks.filter(t => t.status === 'failed').length}</div>
                <div className="text-xs text-gray-500">Failed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}