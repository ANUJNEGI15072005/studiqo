import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { prompt, existingTasks } = await req.json()

    const timeToMinutes = (time: string) => {
        const [h, m] = time.split(":").map(Number)
        return h * 60 + m
    }

    const minutesToTime = (mins: number) => {
        const h = Math.floor(mins / 60)
        const m = mins % 60
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
    }

    const findFreeSlots = (existingTasks: any[]) => {
        const dayStart = 6 * 60   
        const dayEnd = 24 * 60   

        const sorted = [...existingTasks].sort(
            (a, b) => timeToMinutes(a.time) - timeToMinutes(b.time)
        )

        let freeSlots: { start: number; end: number }[] = []
        let lastEnd = dayStart

        for (let task of sorted) {
            const start = timeToMinutes(task.time)
            const end = start + task.duration * 60

            if (start > lastEnd) {
                freeSlots.push({ start: lastEnd, end: start })
            }

            lastEnd = Math.max(lastEnd, end)
        }

        if (lastEnd < dayEnd) {
            freeSlots.push({ start: lastEnd, end: dayEnd })
        }

        return freeSlots
    }

    const assignTasksToSlots = (aiTasks: any[], existingTasks: any[]) => {
        const freeSlots = findFreeSlots(existingTasks)
        let result: any[] = []

        for (let task of aiTasks) {
            let duration = task.duration * 60

            for (let slot of freeSlots) {
                const slotDuration = slot.end - slot.start

                if (slotDuration >= duration) {
                    result.push({
                        subject: task.subject,
                        time: minutesToTime(slot.start),
                        duration: task.duration
                    })

                    slot.start += duration
                    break
                }
            }
        }

        return result
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                temperature: 0.4,
                messages: [
                    {
                        role: "system",
                        content: `
You are a study planner AI.

Return ONLY JSON:
[
  { "subject": "Task name", "duration": number }
]

Rules:
- Do NOT include time
- Duration must be in hours (number)
- No explanation, only JSON
`
                    },
                    {
                        role: "user",
                        content: `
User request:
${prompt}

Generate useful study tasks.
Return JSON only.
`
                    }
                ]
            })
        })

        const data = await response.json()
        const text = data.choices?.[0]?.message?.content || ""

        const match = text.match(/\[[\s\S]*\]/)

        if (!match) {
            console.error("AI RESPONSE:", text)
            return NextResponse.json({ error: "Invalid AI format" }, { status: 500 })
        }

        let aiTasks = JSON.parse(match[0])

        aiTasks = aiTasks
            .map((t: any) => ({
                subject: String(t.subject || "").trim(),
                duration: Number(t.duration)
            }))
            .filter((t: any) =>
                t.subject &&
                !isNaN(t.duration) &&
                t.duration > 0
            )

        const scheduledTasks = assignTasksToSlots(aiTasks, existingTasks)
        return NextResponse.json(scheduledTasks)

    } catch (err) {
        console.error("ERROR:", err)
        return NextResponse.json({ error: "AI failed" }, { status: 500 })
    }
}