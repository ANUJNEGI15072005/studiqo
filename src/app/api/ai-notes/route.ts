import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { content, type } = await req.json()

        if (!content) {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            )
        }

        let prompt = ""

        if (type === "improve") {
            prompt = `
Improve the following study notes:
- Make them clear and well-structured
- Fix grammar
- Keep meaning same
- Do NOT make it too long

Notes:
${content}
`
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7
            })
        })

        const data = await response.json()

        const result = data?.choices?.[0]?.message?.content || ""

        return NextResponse.json({ result })

    } catch (error) {
        console.error("AI ERROR:", error)

        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        )
    }
}