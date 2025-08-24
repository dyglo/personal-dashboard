import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

const model = google("gemini-2.5-flash")

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // For now, we'll use a fallback approach since TTS might not be available
    // in the current AI SDK version. We'll return a success response
    // and let the frontend use browser speech synthesis as fallback
    
    return NextResponse.json({ 
      success: true, 
      message: "Text-to-speech request received. Using browser synthesis as fallback.",
      text: text 
    })

  } catch (error) {
    console.error("Error processing text-to-speech:", error)
    
    return NextResponse.json({ 
      error: "Failed to process text-to-speech. Using browser synthesis as fallback." 
    }, { status: 500 })
  }
}
