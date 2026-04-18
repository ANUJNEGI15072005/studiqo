import { NextResponse } from "next/server"
import Notification from "@/models/Notification"
import { connectDB } from "@/lib/mongodb"

export async function GET(req: Request) {
  await connectDB()

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json([])
  }

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })

  return NextResponse.json(notifications)
}

export async function POST(req: Request) {
  await connectDB()

  const body = await req.json()

  const notif = await Notification.create({
    userId: body.userId,
    message: body.message,
    type: body.type
  })

  return NextResponse.json(notif)
}

export async function PUT(req: Request) {
  await connectDB()

  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }
  
  await Notification.findByIdAndUpdate(id, {
    read: true
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  await connectDB()

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  await Notification.findByIdAndDelete(id)

  return NextResponse.json({ success: true })
}