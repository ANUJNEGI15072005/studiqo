"use client"
import Loader from "@/components/Loader"
import { authClient } from "@/lib/auth-client"
import React, { useEffect, useState } from 'react'

type Task = {
  _id: string
  subject: string
  time: string
  duration: number
  status: "pending" | "completed"
  date: string,
  userId: string,
}

export default function Study() {

  const [stats, setStats] = useState({
    todayHours: 0,
    monthHours: 0,
    streak: 0
  })

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState("")
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [showTimer, setShowTimer] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showStopModal, setShowStopModal] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const session = await authClient.getSession()
      setUser(session?.data?.user)
    }
    getUser()
  }, [])
  const userId = user?.id

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)

        const session = await authClient.getSession()
        const user = session?.data?.user
        setUser(user)

        if (!user?.id) {
          setLoading(false)
          return
        }

        const today = new Date().toLocaleDateString("en-CA")

        const [tasksRes, statsRes, historyRes] = await Promise.all([
          fetch(`/api/tasks?date=${today}&userId=${user.id}`),
          fetch(`/api/study/stats?userId=${user.id}`),
          fetch(`/api/study?userId=${user.id}`)
        ])

        const tasksData = await tasksRes.json()
        const statsData = await statsRes.json()
        const historyData = await historyRes.json()

        const todaySessions = historyData.filter(
          (s: any) => s.date === today
        )

        const pendingTasks = tasksData.filter(
          (t: any) => t.status === "pending"
        )

        setTasks(pendingTasks)
        setStats(statsData)
        setHistory(todaySessions)

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  useEffect(() => {
    let interval: any
    if (running) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [running])

  const formatTime = () => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  const fetchHistory = async () => {
    try {
      if (!userId) return

      const today = new Date().toLocaleDateString("en-CA")

      const res = await fetch(`/api/study?userId=${userId}`)
      const data = await res.json()

      const todaySessions = data.filter(
        (s: any) => s.date === today
      )

      setHistory(todaySessions)
    } catch (err) {
      console.error(err)
    }
  }

  const handleStopClick = () => {
    setShowStopModal(true)
  }

  const confirmStop = async () => {
    if (!selectedTask) return

    setRunning(false)

    const minutes = Math.ceil(seconds / 60)

    if (minutes > 0) {
      const today = new Date().toLocaleDateString("en-CA")

      try {
        await fetch("/api/study", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            subject: selectedTask.subject,
            userId: userId,
            duration: minutes,
            date: today,
            taskId: selectedTask._id
          })
        })
      } catch (err) {
        console.error("SAVE FAILED:", err)
      }
    }

    setShowStopModal(false)
    setShowTimer(false)
    setSelectedTask(null)
    setSelectedTaskId("")
    setSeconds(0)

    await fetchHistory()
  }

  if (loading) return <Loader />

  return (
    <div className='min-h-screen bg-[#0f172a] text-white p-3 md:p-6 font-body'>

      {/* 🔹 Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <div className="bg-[#1e293b] p-4 rounded-2xl border border-white/5">
          <p className="text-sm text-gray-400 font-heading">Today</p>
          <h2 className="text-xl font-bold font-body">{stats.todayHours}h</h2>
        </div>

        <div className="bg-[#1e293b] p-4 rounded-2xl border border-white/5">
          <p className="text-sm text-gray-400 font-heading">This Month</p>
          <h2 className="text-xl font-bold font-body">{stats.monthHours}h</h2>
        </div>

        <div className="bg-[#1e293b] p-4 rounded-2xl border border-white/5 flex items-center gap-2">
          <div>
            <p className="text-sm text-gray-400 font-heading">
              Streak<span className="text-lg ml-1">🔥</span>
            </p>
            <h2 className="text-xl font-bold font-body">{stats.streak} days</h2>
          </div>
        </div>

      </div>

      {/* 🔹 Task Selector */}
      {tasks.length === 0 ? (
        <p className="text-gray-400 mt-4 text-sm font-body">
          No tasks for today. Go to planner.
        </p>
      ) : (
        <select
          value={selectedTaskId}
          onChange={(e) => {
            const value = e.target.value
            if (!value) return

            setSelectedTaskId(value)
            setRunning(false)

            const task = tasks.find(t => t._id === value)
            if (!task) return

            setSelectedTask(task)
            setShowTimer(true)
            setSeconds(0)
          }}
          className="w-full focus:outline-none rounded-lg bg-[#0f172a] font-body"
        >
          <option value="">Select Task</option>
          {tasks.map(task => (
            <option key={task._id} value={task._id}>
              {task.subject}
            </option>
          ))}
        </select>
      )}

      {/* 🔹 Timer */}
      {showTimer && selectedTask && (
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 text-center space-y-4 mt-4 ">

          <h2 className="text-lg font-semibold font-heading">
            {selectedTask.subject}
          </h2>

          <div className="text-4xl font-bold tracking-wider font-body">
            {formatTime()}
          </div>

          <div className="flex justify-center gap-3 font-body">

            {!running ? (
              <button
                onClick={() => setRunning(true)}
                className="bg-green-500 px-4 py-2 rounded-lg"
              >
                Start
              </button>
            ) : (
              <button
                onClick={() => setRunning(false)}
                className="bg-yellow-500 px-4 py-2 rounded-lg"
              >
                Pause
              </button>
            )}

            <button
              onClick={handleStopClick}
              className="bg-red-500 px-4 py-2 rounded-lg"
            >
              Stop
            </button>

          </div>
        </div>
      )}

      {showStopModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1e293b] p-6 rounded-2xl w-[90%] max-w-sm text-center space-y-4 border border-white/10">

            <h2 className="text-lg font-semibold font-heading">
              Stop Session?
            </h2>

            <p className="text-sm text-gray-400 font-body">
              Your study time will be saved.
            </p>

            <div className="flex justify-center gap-3 mt-4 font-body">
              <button
                onClick={() => setShowStopModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={confirmStop}
                className="px-4 py-2 rounded-lg bg-red-500 font-body"
              >
                Confirm
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🔹 History */}
      <div className="mt-8">
        <h3 className="text-sm text-gray-400 font-heading mb-3">
          Recent Study
        </h3>

        {history.length === 0 ? (
          <p className="text-gray-500 text-sm font-body">No sessions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body border border-white/5 rounded-lg overflow-hidden">

              <thead className="bg-[#1e293b] text-gray-400">
                <tr>
                  <th className="text-left p-3">Subject</th>
                  <th className="text-right p-3">Duration</th>
                </tr>
              </thead>

              <tbody>
                {history.map((session, i) => (
                  <tr
                    key={i}
                    className="border-t border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="p-3 max-w-[140px] truncate">
                      {session.subject}
                    </td>

                    <td className="p-3 text-right text-gray-300 whitespace-nowrap">
                      {Math.floor(session.duration / 60)}h {session.duration % 60}m
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

    </div>
  )
}