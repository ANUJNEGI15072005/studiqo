import { NextResponse } from "next/server"
import Notification from "@/models/Notification"
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

        const sessions = await Study.find({ userId })
            .sort({ createdAt: -1 })
            .limit(10)

        return NextResponse.json(sessions)

    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Failed" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        await connectDB()

        const body = await req.json()
        const { subject, duration, date, userId, taskId } = body

        if (!subject || !duration || !date || !userId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        const newSession = await Study.create({
            subject,
            duration,
            date,
            userId,
            taskId
        })

        await Notification.create({
            userId,
            message: `📚 Study session added: ${subject} (${duration} hr)`,
            read: false,
            createdAt: new Date(),
        })

        const todaySessions = await Study.find({ userId, date })

        const totalTodayHours = todaySessions.reduce(
            (sum, s) => sum + s.duration,
            0
        )

        if (totalTodayHours >= 5) {
            await Notification.create({
                userId,
                message: `🔥 Amazing! You studied ${totalTodayHours} hours today`,
                read: false,
                createdAt: new Date(),
            })
        }

        if (duration >= 2) {
            await Notification.create({
                userId,
                message: `💪 Long focus session completed (${duration} hr)`,
                read: false,
                createdAt: new Date(),
            })
        }

        return NextResponse.json(newSession)

    } catch (err) {
        console.error("POST ERROR:", err)
        return NextResponse.json({ error: "Failed to save" }, { status: 500 })
    }
}