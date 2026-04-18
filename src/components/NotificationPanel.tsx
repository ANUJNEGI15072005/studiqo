"use client"

import { useEffect, useState } from "react"

type Notification = {
  _id: string
  message: string
  read: boolean
  createdAt: string
}

export default function NotificationPanel({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetchNotifs = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/notifications?userId=${userId}`)
        if (!res.ok) throw new Error("Failed")

        const data = await res.json()
        setNotifications(data)
      } catch (err) {
        console.error("Notification fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifs()

    const interval = setInterval(fetchNotifs, 15000)
    return () => clearInterval(interval)

  }, [userId])

  const markAsRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })

    setNotifications(prev =>
      prev.map(n => n._id === id ? { ...n, read: true } : n)
    )
  }

  const deleteNotif = async (id: string) => {
    await fetch(`/api/notifications?id=${id}`, {
      method: "DELETE"
    })

    setNotifications(prev => prev.filter(n => n._id !== id))
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 mt-2 w-66 md:w-80 bg-[#1e293b] rounded-xl shadow-lg p-2 md:p-4 z-50 border border-white/10"
    >
      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No notifications</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {notifications.map(n => (
            <div
              key={n._id}
              className={`p-3 rounded-lg text-sm flex justify-between items-start gap-2
              ${n.read ? "bg-[#0f172a]" : "bg-blue-500/20"}`}
            >
              <span
                className="cursor-pointer flex-1"
                onClick={() => markAsRead(n._id)}
              >
                {n.message}
              </span>

              <button
                onClick={() => deleteNotif(n._id)}
                className="text-xs text-red-400"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}