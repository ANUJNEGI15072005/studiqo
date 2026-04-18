import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Study from "@/models/Study"

export async function GET(req: Request) {
    try {
        await connectDB()

        const { searchParams } = new URL(req.url)
        const userId = searchParams.get("userId")

        if (!userId) {
            return NextResponse.json({ error: "User required" }, { status: 400 })
        }

        const today = new Date()
        const todayStr = today.toISOString().split("T")[0]

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const startMonthStr = startOfMonth.toISOString().split("T")[0]

        // ✅ Today sessions
        const todaySessions = await Study.find({
            userId,
            date: todayStr
        })

        const todayMinutes = todaySessions.reduce((acc, s) => acc + s.duration, 0)

        // ✅ Month sessions
        const monthSessions = await Study.find({
            userId,
            date: { $gte: startMonthStr }
        })

        const monthMinutes = monthSessions.reduce((acc, s) => acc + s.duration, 0)

        // ✅ All sessions
        const allSessions = await Study.find({ userId })

        // 🔥 TOTAL HOURS
        const totalMinutes = allSessions.reduce((acc, s) => acc + s.duration, 0)
        const totalHours = (totalMinutes / 60).toFixed(1)

        // 🔥 STREAK (current)
        const allDatesSet = new Set(allSessions.map(s => s.date))

        const yesterday = new Date()
        yesterday.setDate(today.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split("T")[0]

        let streak = 0
        let currentDate = new Date()

        if (allDatesSet.has(todayStr)) {
            currentDate = new Date()
        } else if (allDatesSet.has(yesterdayStr)) {
            currentDate = new Date()
            currentDate.setDate(currentDate.getDate() - 1)
        } else {
            streak = 0
        }

        while (true) {
            const dateStr = currentDate.toISOString().split("T")[0]

            if (allDatesSet.has(dateStr)) {
                streak++
                currentDate.setDate(currentDate.getDate() - 1)
            } else {
                break
            }
        }

        // 🔥 HIGHEST STREAK
        let highestStreak = 0
        let currentStreak = 0

        const uniqueDates = [...new Set(allSessions.map(s => s.date))].sort()

        for (let i = 0; i < uniqueDates.length; i++) {
            if (i === 0) {
                currentStreak = 1
            } else {
                const prev = new Date(uniqueDates[i - 1])
                const curr = new Date(uniqueDates[i])

                const diff =
                    (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)

                if (diff === 1) {
                    currentStreak++
                } else {
                    currentStreak = 1
                }
            }

            highestStreak = Math.max(highestStreak, currentStreak)
        }

        return NextResponse.json({
            todayHours: (todayMinutes / 60).toFixed(1),
            monthHours: (monthMinutes / 60).toFixed(1),
            totalHours,
            streak,
            highestStreak
        })

    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Failed" }, { status: 500 })
    }
}