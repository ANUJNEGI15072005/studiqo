import { connectDB } from "@/lib/mongodb"
import Task from "@/models/Task"
import { NextResponse } from "next/server"
import Notification from "@/models/Notification"

export async function GET(req: Request) {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const date = searchParams.get("date")
    const userId = searchParams.get("userId")

    const tasks = await Task.find({ date, userId })

    return NextResponse.json(tasks)
}

export async function POST(req: Request) {
    await connectDB()

    const body = await req.json()

    const task = await Task.create(body)

    await Notification.create({
        userId: body.userId,
        message: `📌 New task added: ${body.subject}`,
        read: false,
        createdAt: new Date(),
    })

    return NextResponse.json(task)
}

export async function PUT(req: Request) {
    await connectDB()

    const body = await req.json()
    const { id, ...updates } = body

    const existingTask = await Task.findById(id)

    if (!existingTask) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const updatedTask = await Task.findByIdAndUpdate(
        id,
        updates,
        { new: true }
    )

    let message = ""

    if (updates.status === "completed") {
        message = `🎉 Task completed: ${existingTask.subject}`
    } 
    else if (updates.date && updates.date !== existingTask.date) {
        message = `📅 Task moved to another day: ${existingTask.subject}`
    } 
    else {
        message = `✏️ Task updated: ${existingTask.subject}`
    }

    await Notification.create({
        userId: existingTask.userId,
        message,
        read: false,
        createdAt: new Date(),
    })

    return NextResponse.json(updatedTask)
}

export async function DELETE(req: Request) {
    try {
        await connectDB()

        const { id } = await req.json()

        if (!id) {
            return NextResponse.json({ error: "Task ID required" }, { status: 400 })
        }

        const task = await Task.findById(id)

        await Task.findByIdAndDelete(id)

        if (task) {
            await Notification.create({
                userId: task.userId,
                message: `🗑 Task deleted: ${task.subject}`,
                read: false,
                createdAt: new Date(),
            })
        }

        return NextResponse.json({ success: true })

    } catch (err) {
        console.error("DELETE ERROR:", err)
        return NextResponse.json({ error: "Delete failed" }, { status: 500 })
    }
}