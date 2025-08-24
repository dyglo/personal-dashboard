"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Target,
  TrendingUp,
  Award,
  BarChart3,
  Zap,
  Trophy,
  Star,
  CheckCircle2,
  Plus,
  PieChart,
  FileDown,
  Lightbulb,
} from "lucide-react"
import { HabitTracker, type Habit } from "@/components/habit-tracker"
import { GoalManager, type Goal } from "@/components/goal-manager"
import { AIInsights } from "@/components/ai-insights"
import { GamificationSystem } from "@/components/gamification-system"
import { DataVisualization } from "@/components/data-visualization"
import { PDFReportGenerator } from "@/components/pdf-report-generator"
import { SmartHabitSuggestions } from "@/components/smart-habit-suggestions"
import { toast } from "sonner"

export default function TafaDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [habits, setHabits] = useState<Habit[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [userLevel, setUserLevel] = useState(12)
  const [userXP, setUserXP] = useState(2450)

  useEffect(() => {
    const savedHabits = localStorage.getItem("tafa-habits")
    const savedGoals = localStorage.getItem("tafa-goals")

    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits))
      } catch (error) {
        console.error("Failed to parse saved habits:", error)
      }
    }

    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals))
      } catch (error) {
        console.error("Failed to parse saved goals:", error)
      }
    }

    // Load user stats
    const savedStats = localStorage.getItem("tafa-user-stats")
    if (savedStats) {
      try {
        const stats = JSON.parse(savedStats)
        setUserLevel(stats.level)
        setUserXP(stats.totalXP)
      } catch (error) {
        console.error("Failed to parse user stats:", error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("tafa-habits", JSON.stringify(habits))
  }, [habits])

  useEffect(() => {
    localStorage.setItem("tafa-goals", JSON.stringify(goals))
  }, [goals])

  const handleXPGained = (xp: number) => {
    toast.success(`+${xp} XP earned!`, {
      description: "Keep up the great work!",
    })
  }

  const completedToday = habits.filter((h) => h.completed).length
  const longestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0
  const averageHabitProgress =
    habits.length > 0 ? Math.round(habits.reduce((acc, h) => acc + (h.streak / h.target) * 100, 0) / habits.length) : 0

  const completedGoals = goals.filter((g) => g.status === "completed").length
  const averageGoalProgress =
    goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) : 0

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
              <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Tafa</h1>
            <p className="text-secondary mt-1">My personal dashboard ...</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs sm:text-sm">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Level {userLevel}
            </Badge>
            <Badge variant="outline" className="border-accent text-accent text-xs sm:text-sm">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {userXP.toLocaleString()} XP
            </Badge>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-full bg-card overflow-x-auto scrollbar-hide min-h-[44px]">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-1.5 sm:px-2 md:px-3 py-2 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline whitespace-nowrap">Overview</span>
              <span className="sm:hidden whitespace-nowrap">Over</span>
            </TabsTrigger>
            <TabsTrigger
              value="habits"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-1.5 sm:px-2 md:px-3 py-2 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline whitespace-nowrap">Habits</span>
              <span className="sm:hidden whitespace-nowrap">Hab</span>
            </TabsTrigger>
            <TabsTrigger
              value="goals"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-1.5 sm:px-2 md:px-3 py-2 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline whitespace-nowrap">Goals</span>
              <span className="sm:hidden whitespace-nowrap">Goal</span>
            </TabsTrigger>
            <TabsTrigger
              value="visualization"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-1.5 sm:px-2 md:px-3 py-2 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline whitespace-nowrap">Charts</span>
              <span className="sm:hidden whitespace-nowrap">Cht</span>
            </TabsTrigger>
            <TabsTrigger
              value="suggestions"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-1.5 sm:px-2 md:px-3 py-2 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline whitespace-nowrap">Suggestions</span>
              <span className="sm:hidden whitespace-nowrap">Sug</span>
            </TabsTrigger>
            <TabsTrigger
              value="gamification"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-1.5 sm:px-2 md:px-3 py-2 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline whitespace-nowrap">Gamification</span>
              <span className="sm:hidden whitespace-nowrap">Game</span>
            </TabsTrigger>
            <TabsTrigger
              value="insights"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-1.5 sm:px-2 md:px-3 py-2 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline whitespace-nowrap">AI Insights</span>
              <span className="sm:hidden whitespace-nowrap">AI</span>
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-1.5 sm:px-2 md:px-3 py-2 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline whitespace-nowrap">PDF Reports</span>
              <span className="sm:hidden whitespace-nowrap">PDF</span>
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-1.5 sm:px-2 md:px-3 py-2 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline whitespace-nowrap">Legacy</span>
              <span className="sm:hidden whitespace-nowrap">Leg</span>
            </TabsTrigger>
          </TabsList>

          <div className="md:hidden mt-2">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full p-3 bg-card border border-border rounded-md text-card-foreground text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="overview">Overview</option>
              <option value="habits">Habits</option>
              <option value="goals">Goals</option>
              <option value="visualization">Charts</option>
              <option value="suggestions">Suggestions</option>
              <option value="gamification">Gamification</option>
              <option value="insights">AI Insights</option>
              <option value="reports">PDF Reports</option>
              <option value="achievements">Legacy</option>
            </select>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Active Habits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{habits.length}</div>
                  <p className="text-xs text-muted-foreground">total habits</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Active Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{goals.length}</div>
                  <p className="text-xs text-muted-foreground">{completedGoals} completed</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Longest Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{longestStreak}</div>
                  <p className="text-xs text-muted-foreground">days in a row</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Overall Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {Math.round((averageHabitProgress + averageGoalProgress) / 2)}%
                  </div>
                  <p className="text-xs text-muted-foreground">habits & goals</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
                <CardDescription className="text-muted-foreground">Get started with your daily routine</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setActiveTab("habits")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Habit
                </Button>
                <Button
                  onClick={() => setActiveTab("goals")}
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Set Goal
                </Button>
                <Button
                  onClick={() => setActiveTab("visualization")}
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                >
                  <PieChart className="w-4 h-4 mr-2" />
                  View Charts
                </Button>
                <Button
                  onClick={() => setActiveTab("reports")}
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Habits Tab */}
          <TabsContent value="habits" className="space-y-4">
            <HabitTracker habits={habits} onHabitsChange={setHabits} />
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-4">
            <GoalManager goals={goals} onGoalsChange={setGoals} />
          </TabsContent>

          {/* Data Visualization Tab */}
          <TabsContent value="visualization" className="space-y-4">
            <DataVisualization habits={habits} goals={goals} />
          </TabsContent>

          {/* Smart Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-4">
            <SmartHabitSuggestions 
              habits={habits} 
              goals={goals} 
              onAddHabit={(newHabit) => {
                const habit: Habit = {
                  ...newHabit,
                  id: Date.now().toString(),
                  createdAt: new Date().toISOString(),
                  completions: [],
                  streak: 0,
                  completed: false,
                }
                setHabits([...habits, habit])
                toast.success("Habit added successfully!", {
                  description: "Your new habit has been added to your tracker.",
                })
              }}
            />
          </TabsContent>

          {/* Gamification Tab */}
          <TabsContent value="gamification" className="space-y-4">
            <GamificationSystem habits={habits} goals={goals} onXPGained={handleXPGained} />
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <AIInsights habits={habits} goals={goals} />
          </TabsContent>

          {/* PDF Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <PDFReportGenerator habits={habits} goals={goals} />
          </TabsContent>

          {/* Legacy Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Legacy Achievements</h2>
            <p className="text-muted-foreground mb-4">
              These are your original achievements. Check out the new Gamification tab for the full experience!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: 1, name: "First Steps", description: "Complete your first habit", unlocked: true, icon: "🎯" },
                {
                  id: 2,
                  name: "Streak Master",
                  description: "Maintain a 7-day streak",
                  unlocked: longestStreak >= 7,
                  icon: "🔥",
                },
                {
                  id: 3,
                  name: "Goal Getter",
                  description: "Complete your first goal",
                  unlocked: completedGoals > 0,
                  icon: "🏆",
                },
                {
                  id: 4,
                  name: "Consistency King",
                  description: "Complete 30 habits total",
                  unlocked: habits.reduce((acc, h) => acc + h.completions.length, 0) >= 30,
                  icon: "👑",
                },
                {
                  id: 5,
                  name: "Multi-tasker",
                  description: "Have 5 active habits",
                  unlocked: habits.length >= 5,
                  icon: "⚡",
                },
                {
                  id: 6,
                  name: "Perfectionist",
                  description: "Achieve 100% completion rate",
                  unlocked: averageHabitProgress === 100,
                  icon: "💎",
                },
              ].map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`bg-card border-border ${achievement.unlocked ? "ring-2 ring-primary" : "opacity-60"}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-card-foreground">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      {achievement.unlocked && (
                        <Badge className="bg-primary text-primary-foreground">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Unlocked
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
