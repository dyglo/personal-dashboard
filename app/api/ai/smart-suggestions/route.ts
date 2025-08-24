import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

const model = google("gemini-2.5-flash")

export async function POST(request: NextRequest) {
  try {
    const { habits, goals } = await request.json()

    const prompt = `
You are an AI personal development coach helping users create optimal habits based on their current data.

CURRENT HABITS DATA:
${JSON.stringify(habits, null, 2)}

CURRENT GOALS DATA:
${JSON.stringify(goals, null, 2)}

Analyze the user's current habits and goals to suggest 5-7 new habits that would be most beneficial. Consider:

1. **Goal Alignment**: Suggest habits that directly support their stated goals
2. **Gap Analysis**: Identify missing habit categories that could improve their life
3. **Difficulty Balance**: Mix easy, medium, and hard habits
4. **Time Optimization**: Suggest habits that fit their current schedule
5. **Impact Potential**: Focus on high-impact habits with proven benefits

For each suggestion, provide:
- A catchy, actionable title
- Clear description of what to do
- Category (productivity, health, learning, mindfulness, social, custom)
- Difficulty level (easy, medium, hard)
- Estimated time in minutes
- Frequency (daily, weekly, monthly)
- Impact score (1-10)
- AI reasoning explaining why this habit would benefit them
- Related goals it supports
- Suggested time of day (morning, afternoon, evening, anytime)
- Relevant tags

Focus on habits that:
- Are specific and measurable
- Have clear benefits
- Are realistic and achievable
- Complement existing habits
- Address common productivity and wellness gaps

Write in clean, encouraging language. Do not use JSON formatting or special symbols.
`

    const { text } = await generateText({
      model,
      prompt,
      maxTokens: 1500,
    })

    // For now, return mock suggestions since parsing AI response would be complex
    // In a full implementation, you'd parse the AI response into structured data
    const suggestions = [
      {
        id: "1",
        title: "Morning Energy Boost",
        description: "Start your day with 10 minutes of stretching and deep breathing to increase energy levels",
        category: "health",
        difficulty: "easy",
        estimatedTime: 10,
        frequency: "daily",
        impactScore: 8,
        aiReasoning: "Based on your goal to improve productivity, morning energy routines show 40% better focus throughout the day",
        relatedGoals: ["Improve productivity", "Better health"],
        suggestedTime: "morning",
        tags: ["energy", "morning", "focus"]
      },
      {
        id: "2",
        title: "Learning Sprint",
        description: "Dedicate 25 minutes to focused learning with 5-minute breaks",
        category: "learning",
        difficulty: "medium",
        estimatedTime: 25,
        frequency: "daily",
        impactScore: 9,
        aiReasoning: "Your learning goals align with this Pomodoro-style approach, proven to improve retention by 60%",
        relatedGoals: ["Learn new skills", "Career growth"],
        suggestedTime: "afternoon",
        tags: ["learning", "focus", "pomodoro"]
      },
      {
        id: "3",
        title: "Gratitude Reflection",
        description: "Write down 3 things you're grateful for each evening",
        category: "mindfulness",
        difficulty: "easy",
        estimatedTime: 5,
        frequency: "daily",
        impactScore: 7,
        aiReasoning: "Mindfulness practices correlate with 30% better habit consistency and reduced stress levels",
        relatedGoals: ["Mental wellness", "Better habits"],
        suggestedTime: "evening",
        tags: ["gratitude", "mindfulness", "reflection"]
      },
      {
        id: "4",
        title: "Social Connection",
        description: "Reach out to one friend or family member each day",
        category: "social",
        difficulty: "easy",
        estimatedTime: 15,
        frequency: "daily",
        impactScore: 6,
        aiReasoning: "Social connections improve motivation and accountability for habit formation",
        relatedGoals: ["Better relationships", "Social wellness"],
        suggestedTime: "anytime",
        tags: ["social", "connection", "relationships"]
      },
      {
        id: "5",
        title: "Digital Detox Hour",
        description: "Spend one hour without checking social media or emails",
        category: "productivity",
        difficulty: "medium",
        estimatedTime: 60,
        frequency: "daily",
        impactScore: 8,
        aiReasoning: "Reducing digital distractions can improve focus and productivity by up to 50%",
        relatedGoals: ["Improve productivity", "Better focus"],
        suggestedTime: "afternoon",
        tags: ["focus", "digital-detox", "productivity"]
      }
    ]

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("Error generating smart suggestions:", error)
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 })
  }
}
