import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Note from "@/models/Note"
import Notification from "@/models/Notification"

export async function GET(req: Request) {
    try {
        await connectDB()

        const { searchParams } = new URL(req.url)
        const userId = searchParams.get("userId")

        const notes = await Note.find({ userId }).sort({ updatedAt: -1 })

        return NextResponse.json(notes)

    } catch (err) {
        return NextResponse.json({ error: "Failed" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        await connectDB()

        const { title, content, userId } = await req.json()

        const note = await Note.create({
            title,
            content,
            userId
        })

        await Notification.create({
            userId,
            message: `📝 New note created: ${title || "Untitled"}`,
            read: false,
            createdAt: new Date(),
        })

        return NextResponse.json(note)

    } catch (err) {
        return NextResponse.json({ error: "Failed" }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        await connectDB()

        const { id, title, content } = await req.json()

        const updated = await Note.findByIdAndUpdate(
            id,
            { title, content },
            { new: true }
        )

        await Notification.create({
            userId: updated.userId,
            message: `✏️ Note updated: ${updated.title}`,
            read: false,
            createdAt: new Date(),
        })

        return NextResponse.json(updated)

    } catch (err) {
        return NextResponse.json({ error: "Failed" }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        await connectDB()

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        const note = await Note.findById(id)

        await Note.findByIdAndDelete(id)

        if (note) {
            await Notification.create({
                userId: note.userId,
                message: `🗑 Note deleted: ${note.title}`,
                read: false,
                createdAt: new Date(),
            })
        }

        return NextResponse.json({ success: true })

    } catch (err) {
        return NextResponse.json({ error: "Failed" }, { status: 500 })
    }
}