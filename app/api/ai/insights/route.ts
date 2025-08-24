import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

const model = google("gemini-2.5-flash")

export async function POST(request: NextRequest) {
  try {
    const { habits, goals } = await request.json()

    const prompt = `
You are a personal analytics AI assistant helping users understand their habits and goals data.

Analyze the following personal analytics data and provide 3-5 actionable insights in plain English:

HABITS DATA:
${JSON.stringify(habits, null, 2)}

GOALS DATA:
${JSON.stringify(goals, null, 2)}

Please provide insights in clean, readable English text. For each insight, include:
1. A clear title describing the main point
2. A detailed explanation of what you found
3. Specific, actionable advice based on the data
4. The priority level (low, medium, or high)

Focus on:
- Habit completion patterns and streak analysis
- Goal progress optimization opportunities
- Behavioral patterns and correlations
- Specific, actionable recommendations
- Areas for improvement with concrete steps

Make insights personal, specific, and actionable based on the actual data provided. Write in a conversational, encouraging tone.

IMPORTANT: Write in plain, clean English text. Do not use any special formatting symbols like **, #, &, or markdown syntax. Use simple, clear language that reads naturally.
`

    const { text } = await generateText({
      model,
      prompt,
      maxTokens: 1000,
    })

    // Create a structured insight from the plain English response
    const insights = [
      {
        id: Date.now().toString(),
        type: "recommendation",
        title: "AI Analysis Complete",
        content: text,
        priority: "medium",
        createdAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json({ insights })
  } catch (error) {
    console.error("Error generating insights:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}
