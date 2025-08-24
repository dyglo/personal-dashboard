import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

const model = google("gemini-2.5-flash")

export async function POST(request: NextRequest) {
  try {
    const { habits, goals } = await request.json()

    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    const prompt = `
You are a personal analytics AI assistant helping users understand their weekly progress.

Generate a comprehensive weekly report based on the following personal analytics data:

HABITS DATA:
${JSON.stringify(habits, null, 2)}

GOALS DATA:
${JSON.stringify(goals, null, 2)}

WEEK PERIOD: ${weekStart.toDateString()} to ${weekEnd.toDateString()}

Please provide a weekly report in clean, readable English text. Structure your response with clear sections:

Weekly Summary:
Provide a 2-3 sentence overview of the week's performance and key trends.

Key Achievements:
List 3-5 specific achievements and milestones reached this week.

Recommendations:
Provide 3-5 actionable recommendations for improvement and optimization.

Focus on:
- Overall performance summary with specific metrics
- Notable achievements and milestones reached
- Patterns in habit completion and goal progress
- Specific, actionable recommendations for improvement
- Positive reinforcement for good behaviors
- Constructive suggestions for areas needing attention

Make the report encouraging, specific, and data-driven based on actual performance. Write in a conversational, supportive tone.

IMPORTANT: Write in plain, clean English text. Do not use any special formatting symbols like **, #, &, or markdown syntax. Use simple, clear language that reads naturally.
`

    const { text } = await generateText({
      model,
      prompt,
      maxTokens: 800,
    })

    // Create a structured report from the plain English response
    const report = {
      id: Date.now().toString(),
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      summary: text,
      achievements: ["Analysis completed successfully"],
      recommendations: ["Continue tracking your progress consistently"],
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ report })
  } catch (error) {
    console.error("Error generating weekly report:", error)
    return NextResponse.json({ error: "Failed to generate weekly report" }, { status: 500 })
  }
}
