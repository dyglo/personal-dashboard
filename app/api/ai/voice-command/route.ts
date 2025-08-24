import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

const model = google("gemini-2.5-flash")

export async function POST(request: NextRequest) {
  try {
    const { command, habits, goals, currentTab } = await request.json()

    const prompt = `
You are an AI voice assistant for a personal dashboard app. The user has spoken a voice command and you need to understand and respond appropriately.

USER'S VOICE COMMAND: "${command}"

CURRENT CONTEXT:
- Current tab: ${currentTab}
- User's habits: ${JSON.stringify(habits, null, 2)}
- User's goals: ${JSON.stringify(goals, null, 2)}

AVAILABLE ACTIONS:
1. Navigation: "go to overview", "go to habits", "go to goals", "go to suggestions", "go to gamification", "go to ai insights"
2. Actions: "add new habit", "mark habit complete", "add new goal"
3. Queries: "what's my progress", "show my streaks", "give me insights"
4. System: "help", "stop listening"

TASK:
1. Understand what the user wants to do
2. Provide a helpful, conversational response
3. If it's a navigation command, acknowledge the navigation
4. If it's an action command, provide guidance on how to complete it
5. If it's a query, provide relevant information based on their data
6. If it's unclear, ask for clarification

RESPONSE GUIDELINES:
- Keep responses concise (1-2 sentences)
- Be encouraging and supportive
- Use natural, conversational language
- If asking for clarification, be specific about what you need
- If providing information, make it actionable

Write in clean, encouraging language. Do not use JSON formatting or special symbols.
`

    const { text } = await generateText({
      model,
      prompt,
      maxTokens: 200,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error processing voice command:", error)
    return NextResponse.json({ 
      response: "Sorry, I couldn't process that command. Please try again." 
    }, { status: 500 })
  }
}
