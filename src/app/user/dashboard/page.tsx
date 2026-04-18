"use client"
import Loader from "@/components/Loader"
import { authClient } from "@/lib/auth-client"
import React, { useEffect, useState } from "react"
import { CheckCircle2, Clock } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

type Task = {
  _id: string
  subject: string
  time: string
  duration: number
  status: "pending" | "completed"
  date: string
}

export default function Dashboard() {

  const [user, setUser] = useState<any>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState({
    todayHours: 0,
    monthHours: 0,
    streak: 0
  })

  useEffect(() => {
    const getUser = async () => {
      const session = await authClient.getSession()
      setUser(session?.data?.user)
    }
    getUser()
  }, [])

  const userId = user?.id

  useEffect(() => {
    if (!userId) return

    const today = new Date().toISOString().split("T")[0]

    const fetchAll = async () => {
      try {
        setLoading(true)

        const [tasksRes, studyRes, statsRes] = await Promise.all([
          fetch(`/api/tasks?date=${today}&userId=${userId}`),
          fetch(`/api/study?userId=${userId}`),
          fetch(`/api/study/stats?userId=${userId}`)
        ])

        const tasksData = await tasksRes.json()
        const studyData = await studyRes.json()
        const statsData = await statsRes.json()

        const todaySessions = studyData.filter(
          (s: any) => s.date === today
        )

        setTasks(tasksData)
        setSessions(todaySessions)
        setStats(statsData)

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [userId])

  const completedTasks = tasks.filter(t => t.status === "completed").length

  const progress =
    tasks.length === 0
      ? 0
      : (completedTasks / tasks.length) * 100

  const getLast7DaysData = () => {
    const days: any[] = []

    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)

      const date = d.toISOString().split("T")[0]
      const label = d.toLocaleDateString("en-IN", { weekday: "short" })

      const totalMinutes = sessions
        .filter((s: any) => s.date === date)
        .reduce((sum: number, s: any) => sum + s.duration, 0)

      days.push({
        day: label,
        hours: +(totalMinutes / 60).toFixed(1)
      })
    }

    return days
  }

  const chartData = getLast7DaysData()

  if (loading) return <Loader />

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-3 md:p-6 space-y-6">

      {/* 🔹 Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="bg-[#1e293b] p-4 rounded-xl">
          <p className="text-sm text-gray-400 font-heading">Today</p>
          <h2 className="text-xl font-bold font-body">{stats.todayHours}h</h2>
        </div>

        <div className="bg-[#1e293b] p-4 rounded-xl">
          <p className="text-sm text-gray-400 font-heading">Month</p>
          <h2 className="text-xl font-bold font-body">{stats.monthHours}h</h2>
        </div>

        <div className="bg-[#1e293b] p-4 rounded-xl">
          <p className="text-sm text-gray-400 font-heading">Streak 🔥</p>
          <h2 className="text-xl font-bold font-body">{stats.streak}</h2>
        </div>

        <div className="bg-[#1e293b] p-4 rounded-xl">
          <p className="text-sm text-gray-400 font-heading">Tasks Done</p>
          <h2 className="text-xl font-bold font-body">{completedTasks}</h2>
        </div>

      </div>

      {/* charts */}
      <div className="bg-[#1e293b] p-4 rounded-xl">
        <h2 className="text-sm text-gray-400 mb-3 font-heading">Last 7 Days</h2>

        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="day" stroke="#888" />
              <Tooltip />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🔹 Progress */}
      <div className="bg-[#1e293b] p-4 rounded-xl">
        <div className="flex justify-between text-sm text-gray-400">
          <span className="font-heading">Today&apos;s Progress</span>
          <span className="font-body">{completedTasks}/{tasks.length}</span>
        </div>

        <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 🔹 Today Timeline */}
      <div className="bg-[#1e293b] p-4 rounded-xl">
        <h2 className="text-sm text-gray-400 mb-3 font-heading">
          Today’s Tasks
        </h2>

        {tasks.length === 0 ? (
          <p className="text-gray-500 text-sm font-body">No tasks</p>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => (
              <div
                key={task._id}
                className="flex justify-between items-center text-sm font-body"
              >
                <span>
                  {task.time} • {task.subject}
                </span>

                <span className="flex items-center gap-2">
                  {task.status === "completed" ? (
                    <CheckCircle2 size={18} className="text-green-400" />
                  ) : (
                    <Clock size={18} className="text-yellow-400" />
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔹 Recent Study */}
      <div className="bg-[#1e293b] p-4 mb-5 rounded-xl">
        <h2 className="text-sm text-gray-400 mb-3 font-heading">
          Today’s Study
        </h2>

        {sessions.length === 0 ? (
          <p className="text-gray-500 text-sm font-body">
            No sessions yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">

              <thead className="text-gray-400 border-b border-white/5">
                <tr>
                  <th className="text-left pb-2">Subject</th>
                  <th className="text-right pb-2">Duration</th>
                </tr>
              </thead>

              <tbody>
                {sessions.map((s, i) => (
                  <tr key={i} className="border-t border-white/5">

                    <td className="py-2 pr-2 max-w-[120px] truncate" title={s.subject}>
                      {s.subject}
                    </td>

                    <td className="py-2 text-right whitespace-nowrap text-gray-300">
                      {Math.floor(s.duration / 60)}h {s.duration % 60}m
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