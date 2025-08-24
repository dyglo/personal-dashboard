import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

const model = google("gemini-2.5-flash")

export async function POST(request: NextRequest) {
  try {
    const { query, habits, goals, conversationId, conversationHistory } = await request.json()

    // Build conversation context
    let conversationContext = ""
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = "\n\nCONVERSATION HISTORY:\n" + conversationHistory
        .map((msg: any) => `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.content}`)
        .join("\n")
    }

    const prompt = `
You are a personal analytics AI assistant helping users understand their habits and goals data through natural conversation.

USER'S CURRENT QUESTION: "${query}"

CURRENT HABITS DATA:
${JSON.stringify(habits, null, 2)}

CURRENT GOALS DATA:
${JSON.stringify(goals, null, 2)}${conversationContext}

Please provide a helpful, personalized response based on the user's actual data and conversation context. Be specific, actionable, and encouraging. If the user asks about patterns, trends, or recommendations, analyze their actual data to provide insights.

Keep your response conversational and natural (2-4 sentences). Focus on actionable advice and specific observations from their data. If this is a follow-up question, reference the conversation history to provide contextually relevant responses.

Write in plain English with a supportive, encouraging tone. Do not use JSON formatting or technical jargon.

IMPORTANT: Write in plain, clean English text. Do not use any special formatting symbols like **, #, &, or markdown syntax. Use simple, clear language that reads naturally.
`

    const { text } = await generateText({
      model,
      prompt,
      maxTokens: 300,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error processing query:", error)
    return NextResponse.json({ error: "Failed to process query" }, { status: 500 })
  }
}
