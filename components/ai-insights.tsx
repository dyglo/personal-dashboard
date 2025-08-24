"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Zap, Brain, TrendingUp, Target, MessageSquare, FileText, Lightbulb, CheckCircle2, Loader2, Plus } from "lucide-react"
import type { Habit } from "./habit-tracker"
import type { Goal } from "./goal-manager"

interface AIInsightsProps {
  habits: Habit[]
  goals: Goal[]
}

interface Insight {
  id: string
  type: "habit" | "goal" | "pattern" | "recommendation"
  title: string
  content: string
  priority: "low" | "medium" | "high"
  createdAt: string
}

interface WeeklyReport {
  id: string
  weekStart: string
  weekEnd: string
  summary: string
  achievements: string[]
  recommendations: string[]
  createdAt: string
}

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export function AIInsights({ habits, goals }: AIInsightsProps) {
  const [activeTab, setActiveTab] = useState("insights")
  const [insights, setInsights] = useState<Insight[]>([])
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>([])
  const [query, setQuery] = useState("")
  const [queryResponse, setQueryResponse] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isQuerying, setIsQuerying] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)

  const generateInsights = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ habits, goals }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate insights")
      }

      const data = await response.json()
      setInsights(data.insights)
    } catch (error) {
      console.error("Error generating insights:", error)
      // Fallback to mock insights if API fails
      generateMockInsights()
    } finally {
      setIsGenerating(false)
    }
  }

  const generateWeeklyReport = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch("/api/ai/weekly-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ habits, goals }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate weekly report")
      }

      const data = await response.json()
      setWeeklyReports([data.report, ...weeklyReports])
    } catch (error) {
      console.error("Error generating weekly report:", error)
      // Fallback to mock report if API fails
      generateMockWeeklyReport()
    } finally {
      setIsGenerating(false)
    }
  }

  const startNewConversation = () => {
    setConversationHistory([])
    setCurrentConversationId(null)
    setQuery("")
    setQueryResponse("")
  }

  const handleQuery = async () => {
    if (!query.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date()
    }

    // Add user message to conversation history
    const updatedHistory = [...conversationHistory, userMessage]
    setConversationHistory(updatedHistory)
    
    // Generate conversation ID if this is a new conversation
    const conversationId = currentConversationId || `conv_${Date.now()}`
    if (!currentConversationId) {
      setCurrentConversationId(conversationId)
    }

    setIsQuerying(true)

    try {
      const response = await fetch("/api/ai/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          query, 
          habits, 
          goals,
          conversationId,
          conversationHistory: updatedHistory.map(msg => ({
            type: msg.type,
            content: msg.content
          }))
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to process query")
      }

      const data = await response.json()
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date()
      }

      // Add AI response to conversation history
      setConversationHistory([...updatedHistory, aiMessage])
      setQueryResponse(data.response)
      setQuery("") // Clear input for next message
    } catch (error) {
      console.error("Error processing query:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm sorry, I'm having trouble processing your query right now. Please try again later.",
        timestamp: new Date()
      }
      setConversationHistory([...updatedHistory, errorMessage])
      setQueryResponse("I'm sorry, I'm having trouble processing your query right now. Please try again later.")
    } finally {
      setIsQuerying(false)
    }
  }

  const generateMockInsights = () => {
    const mockInsights: Insight[] = [
      {
        id: "1",
        type: "pattern",
        title: "Strong Morning Routine Pattern",
        content:
          "Your morning exercise habit has a 85% completion rate. Consider adding meditation right after exercise to build a stronger morning routine chain.",
        priority: "medium",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        type: "recommendation",
        title: "Goal Deadline Optimization",
        content:
          'Your "Learn Spanish" goal is progressing slower than expected. Consider breaking it into smaller weekly milestones to maintain momentum.',
        priority: "high",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        type: "habit",
        title: "Streak Recovery Strategy",
        content:
          "You tend to restart habits successfully after breaks. Your average recovery time is 3 days, which is excellent for maintaining long-term consistency.",
        priority: "low",
        createdAt: new Date().toISOString(),
      },
    ]
    setInsights(mockInsights)
  }

  const generateMockWeeklyReport = () => {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    const mockReport: WeeklyReport = {
      id: Date.now().toString(),
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      summary:
        "This week showed strong consistency in your morning routines with a 78% completion rate across all habits. Your goal progress increased by an average of 12%, with particularly strong advancement in your fitness-related objectives.",
      achievements: [
        "Maintained 7-day streak in morning exercise",
        "Completed 85% of reading sessions",
        "Advanced Spanish learning goal by 15%",
      ],
      recommendations: [
        "Consider adding a wind-down routine to improve sleep consistency",
        "Schedule goal review sessions on Sundays for better weekly planning",
        "Try habit stacking: link meditation with your existing exercise routine",
      ],
      createdAt: new Date().toISOString(),
    }
    setWeeklyReports([mockReport, ...weeklyReports])
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "habit":
        return <CheckCircle2 className="w-5 h-5" />
      case "goal":
        return <Target className="w-5 h-5" />
      case "pattern":
        return <TrendingUp className="w-5 h-5" />
      case "recommendation":
        return <Lightbulb className="w-5 h-5" />
      default:
        return <Brain className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Insights</h2>
          <p className="text-muted-foreground">Personalized analytics powered by Gemini AI</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={generateInsights}
            disabled={isGenerating}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
            Generate Insights
          </Button>
          <Button
            onClick={generateWeeklyReport}
            disabled={isGenerating}
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
            Weekly Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex w-full bg-card overflow-x-auto scrollbar-hide">
          <TabsTrigger
            value="insights"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-3 py-2 text-sm"
          >
            <Brain className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="whitespace-nowrap">Insights</span>
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-3 py-2 text-sm"
          >
            <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="whitespace-nowrap">Reports</span>
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-3 py-2 text-sm"
          >
            <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="whitespace-nowrap">Ask AI</span>
          </TabsTrigger>
        </TabsList>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          {insights.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <Brain className="w-12 h-12 mx-auto text-muted mb-4" />
                <h3 className="text-lg font-semibold text-card-foreground mb-2">No insights yet</h3>
                <p className="text-muted-foreground mb-4">
                  Generate AI-powered insights based on your habits and goals data.
                </p>
                <Button
                  onClick={generateInsights}
                  disabled={isGenerating}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                  Generate Your First Insights
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {insights.map((insight) => (
                <Card key={insight.id} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-primary mt-1">{getInsightIcon(insight.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-card-foreground">{insight.title}</h3>
                          <Badge className={getPriorityColor(insight.priority)}>{insight.priority}</Badge>
                          <Badge variant="outline" className="border-accent text-accent">
                            {insight.type}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">{insight.content}</p>
                        <p className="text-xs text-muted-foreground mt-3">
                          Generated {new Date(insight.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          {weeklyReports.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted mb-4" />
                <h3 className="text-lg font-semibold text-card-foreground mb-2">No reports yet</h3>
                <p className="text-muted-foreground mb-4">
                  Generate comprehensive weekly reports with AI analysis and recommendations.
                </p>
                <Button
                  onClick={generateWeeklyReport}
                  disabled={isGenerating}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4 mr-2" />
                  )}
                  Generate Weekly Report
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {weeklyReports.map((report) => (
                <Card key={report.id} className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-card-foreground">Weekly Report</CardTitle>
                      <Badge variant="outline" className="border-accent text-accent">
                        {new Date(report.weekStart).toLocaleDateString()} -{" "}
                        {new Date(report.weekEnd).toLocaleDateString()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-card-foreground mb-2">Summary</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{report.summary}</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Achievements
                      </h4>
                      <ul className="space-y-2">
                        {report.achievements.map((achievement, index) => (
                          <li key={index} className="text-muted-foreground text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-primary" />
                        Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {report.recommendations.map((recommendation, index) => (
                          <li key={index} className="text-muted-foreground text-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-card-foreground">Ask AI About Your Progress</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {currentConversationId 
                      ? "Continue your conversation or start a new one." 
                      : "Ask questions about your habits, goals, and progress patterns."
                    }
                  </CardDescription>
                </div>
                {currentConversationId && (
                  <Button
                    onClick={startNewConversation}
                    variant="outline"
                    size="sm"
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ask New
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Conversation History */}
              {conversationHistory.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {conversationHistory.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.type === 'ai' && (
                        <Brain className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted/20 border border-border'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {message.type === 'user' && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-primary-foreground font-medium">U</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  placeholder={
                    currentConversationId 
                      ? "Ask a follow-up question..." 
                      : "e.g., How can I improve my morning routine consistency?"
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleQuery()}
                  className="bg-input border-border text-card-foreground"
                />
                <Button
                  onClick={handleQuery}
                  disabled={isQuerying || !query.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isQuerying ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                </Button>
              </div>

              {/* Help Text */}
              {conversationHistory.length === 0 && (
                <div className="text-xs text-muted-foreground">
                  <p>Try asking questions like:</p>
                  <ul className="mt-2 space-y-1 ml-4">
                    <li>• "What patterns do you see in my habit completion?"</li>
                    <li>• "How can I improve my goal progress?"</li>
                    <li>• "What's the best time for me to work on habits?"</li>
                    <li>• "Which goals should I prioritize this month?"</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
