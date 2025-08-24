"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { FileDown, Loader2, BarChart3, Target, TrendingUp, CheckCircle2 } from "lucide-react"
import type { Habit } from "./habit-tracker"
import type { Goal } from "./goal-manager"

interface PDFReportGeneratorProps {
  habits: Habit[]
  goals: Goal[]
}

interface ReportSection {
  id: string
  name: string
  description: string
  enabled: boolean
}

export function PDFReportGenerator({ habits, goals }: PDFReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [timeRange, setTimeRange] = useState("30")
  const [reportSections, setReportSections] = useState<ReportSection[]>([
    { id: "overview", name: "Overview", description: "Key metrics and statistics", enabled: true },
    { id: "habits", name: "Habit Analysis", description: "Detailed habit tracking and streaks", enabled: true },
    { id: "goals", name: "Goal Progress", description: "Goal completion and milestones", enabled: true },
    { id: "charts", name: "Data Visualization", description: "Charts and graphs", enabled: true },
    { id: "insights", name: "AI Insights", description: "Personalized recommendations", enabled: false },
    { id: "achievements", name: "Achievements", description: "Unlocked badges and milestones", enabled: false },
  ])

  const reportRef = useRef<HTMLDivElement>(null)

  const toggleSection = (sectionId: string) => {
    setReportSections((prev) =>
      prev.map((section) => (section.id === sectionId ? { ...section, enabled: !section.enabled } : section)),
    )
  }

  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      // Dynamic import to avoid SSR issues
      const jsPDF = (await import("jspdf")).default
      const html2canvas = (await import("html2canvas")).default

      const pdf = new jsPDF("p", "mm", "a4")
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      // Add header
      pdf.setFontSize(24)
      pdf.setTextColor(255, 255, 0) // Yellow
      pdf.text("Tafa Analytics Report", 20, 30)

      pdf.setFontSize(12)
      pdf.setTextColor(128, 128, 128) // Gray
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 40)
      pdf.text(`Time Range: Last ${timeRange} days`, 20, 48)

      let yPosition = 60

      // Add overview section
      if (reportSections.find((s) => s.id === "overview")?.enabled) {
        pdf.setFontSize(16)
        pdf.setTextColor(255, 255, 255) // White
        pdf.text("Overview", 20, yPosition)
        yPosition += 10

        const totalHabits = habits.length
        const completedToday = habits.filter((h) => h.completed).length
        const longestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0
        const totalGoals = goals.length
        const completedGoals = goals.filter((g) => g.status === "completed").length
        const avgGoalProgress =
          goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) : 0

        pdf.setFontSize(10)
        pdf.setTextColor(200, 200, 200)
        pdf.text(`Active Habits: ${totalHabits}`, 20, yPosition)
        pdf.text(`Completed Today: ${completedToday}`, 20, yPosition + 8)
        pdf.text(`Longest Streak: ${longestStreak} days`, 20, yPosition + 16)
        pdf.text(`Active Goals: ${totalGoals}`, 100, yPosition)
        pdf.text(`Completed Goals: ${completedGoals}`, 100, yPosition + 8)
        pdf.text(`Avg Goal Progress: ${avgGoalProgress}%`, 100, yPosition + 16)
        yPosition += 30
      }

      // Add habits section
      if (reportSections.find((s) => s.id === "habits")?.enabled && habits.length > 0) {
        pdf.setFontSize(16)
        pdf.setTextColor(255, 255, 255)
        pdf.text("Habit Analysis", 20, yPosition)
        yPosition += 10

        habits.slice(0, 10).forEach((habit, index) => {
          if (yPosition > pageHeight - 30) {
            pdf.addPage()
            yPosition = 20
          }

          pdf.setFontSize(12)
          pdf.setTextColor(255, 255, 0)
          pdf.text(`${habit.name}`, 20, yPosition)

          pdf.setFontSize(10)
          pdf.setTextColor(200, 200, 200)
          pdf.text(`Category: ${habit.category}`, 20, yPosition + 8)
          pdf.text(`Streak: ${habit.streak} days`, 20, yPosition + 16)
          pdf.text(`Target: ${habit.target} days`, 100, yPosition + 8)
          pdf.text(`Completions: ${habit.completions.length}`, 100, yPosition + 16)

          yPosition += 25
        })
        yPosition += 10
      }

      // Add goals section
      if (reportSections.find((s) => s.id === "goals")?.enabled && goals.length > 0) {
        if (yPosition > pageHeight - 60) {
          pdf.addPage()
          yPosition = 20
        }

        pdf.setFontSize(16)
        pdf.setTextColor(255, 255, 255)
        pdf.text("Goal Progress", 20, yPosition)
        yPosition += 10

        goals.slice(0, 8).forEach((goal, index) => {
          if (yPosition > pageHeight - 30) {
            pdf.addPage()
            yPosition = 20
          }

          pdf.setFontSize(12)
          pdf.setTextColor(255, 255, 0)
          pdf.text(`${goal.title}`, 20, yPosition)

          pdf.setFontSize(10)
          pdf.setTextColor(200, 200, 200)
          pdf.text(`Category: ${goal.category}`, 20, yPosition + 8)
          pdf.text(`Progress: ${goal.progress}%`, 20, yPosition + 16)
          pdf.text(`Priority: ${goal.priority}`, 100, yPosition + 8)
          pdf.text(`Deadline: ${new Date(goal.deadline).toLocaleDateString()}`, 100, yPosition + 16)

          yPosition += 25
        })
      }

      // Add insights section if enabled
      if (reportSections.find((s) => s.id === "insights")?.enabled) {
        if (yPosition > pageHeight - 40) {
          pdf.addPage()
          yPosition = 20
        }

        pdf.setFontSize(16)
        pdf.setTextColor(255, 255, 255)
        pdf.text("AI Insights", 20, yPosition)
        yPosition += 10

        const insights = [
          "Your morning exercise habit shows strong consistency with 85% completion rate.",
          "Consider linking meditation with your existing exercise routine for better habit stacking.",
          "Goal progress has increased by 12% this week, showing excellent momentum.",
        ]

        insights.forEach((insight, index) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage()
            yPosition = 20
          }

          pdf.setFontSize(10)
          pdf.setTextColor(200, 200, 200)
          const lines = pdf.splitTextToSize(`• ${insight}`, pageWidth - 40)
          pdf.text(lines, 20, yPosition)
          yPosition += lines.length * 5 + 5
        })
      }

      // Save the PDF
      const fileName = `tafa-report-${new Date().toISOString().split("T")[0]}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const enabledSections = reportSections.filter((s) => s.enabled)
  const totalHabits = habits.length
  const totalGoals = goals.length
  const completedGoals = goals.filter((g) => g.status === "completed").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">PDF Report Generator</h2>
          <p className="text-muted-foreground">Create comprehensive analytics reports</p>
        </div>
        <Button
          onClick={generatePDF}
          disabled={isGenerating || enabledSections.length === 0}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileDown className="w-4 h-4 mr-2" />}
          Generate PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Report Configuration</CardTitle>
              <CardDescription className="text-muted-foreground">
                Customize your report content and time range
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">Time Range</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="bg-input border-border text-card-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="7" className="text-popover-foreground">
                      Last 7 days
                    </SelectItem>
                    <SelectItem value="30" className="text-popover-foreground">
                      Last 30 days
                    </SelectItem>
                    <SelectItem value="90" className="text-popover-foreground">
                      Last 90 days
                    </SelectItem>
                    <SelectItem value="365" className="text-popover-foreground">
                      Last year
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-card-foreground mb-3 block">Report Sections</label>
                <div className="space-y-3">
                  {reportSections.map((section) => (
                    <div key={section.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={section.id}
                        checked={section.enabled}
                        onCheckedChange={() => toggleSection(section.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor={section.id} className="text-sm font-medium text-card-foreground cursor-pointer">
                          {section.name}
                        </label>
                        <p className="text-xs text-muted-foreground">{section.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Summary */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Data Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Habits</span>
                <Badge variant="outline" className="border-primary text-primary">
                  {totalHabits}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Goals</span>
                <Badge variant="outline" className="border-primary text-primary">
                  {totalGoals}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed Goals</span>
                <Badge variant="outline" className="border-accent text-accent">
                  {completedGoals}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Report Sections</span>
                <Badge variant="outline" className="border-accent text-accent">
                  {enabledSections.length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Report Preview</CardTitle>
              <CardDescription className="text-muted-foreground">Preview of your PDF report content</CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={reportRef} className="space-y-6 p-4 bg-background rounded-lg border border-border">
                {/* Header */}
                <div className="text-center border-b border-border pb-4">
                  <h1 className="text-2xl font-bold text-primary">Tafa Analytics Report</h1>
                  <p className="text-sm text-muted-foreground mt-2">
                    Generated on {new Date().toLocaleDateString()} • Last {timeRange} days
                  </p>
                </div>

                {/* Overview Section */}
                {reportSections.find((s) => s.id === "overview")?.enabled && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Overview
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Active Habits</span>
                          <span className="text-sm font-medium text-primary">{totalHabits}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Longest Streak</span>
                          <span className="text-sm font-medium text-primary">
                            {habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0} days
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Active Goals</span>
                          <span className="text-sm font-medium text-primary">{totalGoals}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Completed Goals</span>
                          <span className="text-sm font-medium text-primary">{completedGoals}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Habits Section */}
                {reportSections.find((s) => s.id === "habits")?.enabled && habits.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      Habit Analysis
                    </h2>
                    <div className="space-y-3">
                      {habits.slice(0, 5).map((habit) => (
                        <div key={habit.id} className="flex items-center justify-between p-3 rounded bg-muted/20">
                          <div>
                            <h3 className="font-medium text-card-foreground">{habit.name}</h3>
                            <p className="text-xs text-muted-foreground">{habit.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-primary">{habit.streak} day streak</p>
                            <p className="text-xs text-muted-foreground">{habit.completions.length} completions</p>
                          </div>
                        </div>
                      ))}
                      {habits.length > 5 && (
                        <p className="text-xs text-muted-foreground text-center">
                          ... and {habits.length - 5} more habits
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Goals Section */}
                {reportSections.find((s) => s.id === "goals")?.enabled && goals.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Goal Progress
                    </h2>
                    <div className="space-y-3">
                      {goals.slice(0, 5).map((goal) => (
                        <div key={goal.id} className="p-3 rounded bg-muted/20">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-card-foreground">{goal.title}</h3>
                            <Badge variant="outline" className="border-accent text-accent text-xs">
                              {goal.progress}%
                            </Badge>
                          </div>
                          <div className="w-full bg-muted/40 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${goal.progress}%` }} />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>{goal.category}</span>
                            <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                      {goals.length > 5 && (
                        <p className="text-xs text-muted-foreground text-center">
                          ... and {goals.length - 5} more goals
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Insights Section */}
                {reportSections.find((s) => s.id === "insights")?.enabled && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      AI Insights
                    </h2>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        • Your morning exercise habit shows strong consistency with high completion rates
                      </p>
                      <p className="text-sm text-muted-foreground">
                        • Consider habit stacking to improve overall routine effectiveness
                      </p>
                      <p className="text-sm text-muted-foreground">
                        • Goal progress has shown positive momentum this period
                      </p>
                    </div>
                  </div>
                )}

                {enabledSections.length === 0 && (
                  <div className="text-center py-8">
                    <FileDown className="w-12 h-12 mx-auto text-muted mb-4" />
                    <p className="text-muted-foreground">Select sections to include in your report</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
