"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Calendar, TrendingUp, BarChart3, PieChartIcon, Activity, Target } from "lucide-react"
import type { Habit } from "./habit-tracker"
import type { Goal } from "./goal-manager"

interface DataVisualizationProps {
  habits: Habit[]
  goals: Goal[]
}

interface ChartData {
  date: string
  completions: number
  streaks: number
  [key: string]: any
}

interface CategoryData {
  category: string
  count: number
  completionRate: number
  averageStreak: number
}

interface GoalProgressData {
  goal: string
  progress: number
  target: number
  category: string
  daysLeft: number
  priority: number
}

export function DataVisualization({ habits, goals }: DataVisualizationProps) {
  const [timeRange, setTimeRange] = useState("30") // days
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Color palette for charts (using Tafa theme colors)
  const colors = {
    primary: "#FFFF00", // Yellow
    secondary: "#FFFFFF", // White
    accent: "#FFD700", // Gold
    muted: "#808080", // Gray
    success: "#00FF00", // Green
    warning: "#FFA500", // Orange
    danger: "#FF0000", // Red
  }

  const chartColors = [colors.primary, colors.accent, colors.secondary, colors.muted, colors.success, colors.warning]

  // Generate time series data for habits
  const habitTimeSeriesData = useMemo(() => {
    const days = Number.parseInt(timeRange)
    const data: ChartData[] = []
    const today = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const dayCompletions = habits.reduce((acc, habit) => {
        return acc + (habit.completions.includes(dateStr) ? 1 : 0)
      }, 0)

      const avgStreak = habits.length > 0 ? habits.reduce((acc, habit) => acc + habit.streak, 0) / habits.length : 0

      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        completions: dayCompletions,
        streaks: Math.round(avgStreak),
        totalHabits: habits.length,
      })
    }

    return data
  }, [habits, timeRange])

  // Generate category analysis data
  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, { count: number; totalCompletions: number; totalStreaks: number }>()

    habits.forEach((habit) => {
      const category = habit.category
      const existing = categoryMap.get(category) || { count: 0, totalCompletions: 0, totalStreaks: 0 }

      categoryMap.set(category, {
        count: existing.count + 1,
        totalCompletions: existing.totalCompletions + habit.completions.length,
        totalStreaks: existing.totalStreaks + habit.streak,
      })
    })

    const data: CategoryData[] = Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      count: stats.count,
      completionRate: stats.count > 0 ? Math.round((stats.totalCompletions / stats.count) * 10) / 10 : 0,
      averageStreak: stats.count > 0 ? Math.round(stats.totalStreaks / stats.count) : 0,
    }))

    return data.sort((a, b) => b.count - a.count)
  }, [habits])

  // Generate goal progress data
  const goalProgressData = useMemo(() => {
    return goals.map((goal) => {
      const deadline = new Date(goal.deadline)
      const today = new Date()
      const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      return {
        goal: goal.title.length > 20 ? goal.title.substring(0, 20) + "..." : goal.title,
        progress: goal.progress,
        target: 100,
        category: goal.category,
        daysLeft: Math.max(0, daysLeft),
        priority: goal.priority,
      }
    })
  }, [goals])

  // Generate habit distribution data for pie chart
  const habitDistributionData = useMemo(() => {
    const distribution = categoryData.map((cat, index) => ({
      name: cat.category,
      value: cat.count,
      color: chartColors[index % chartColors.length],
    }))
    return distribution
  }, [categoryData])

  // Generate streak heatmap data
  const streakHeatmapData = useMemo(() => {
    const data = []
    const today = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const completions = habits.reduce((acc, habit) => {
        return acc + (habit.completions.includes(dateStr) ? 1 : 0)
      }, 0)

      const completionRate = habits.length > 0 ? (completions / habits.length) * 100 : 0

      data.push({
        date: date.getDate(),
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        completionRate: Math.round(completionRate),
        completions,
      })
    }

    return data
  }, [habits])

  const filteredHabits =
    selectedCategory === "all" ? habits : habits.filter((habit) => habit.category === selectedCategory)

  const categories = ["all", ...Array.from(new Set(habits.map((h) => h.category)))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Data Visualization</h2>
          <p className="text-muted-foreground">Analyze your habits and goals with interactive charts</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-input border-border text-card-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="7" className="text-popover-foreground">
                7 days
              </SelectItem>
              <SelectItem value="30" className="text-popover-foreground">
                30 days
              </SelectItem>
              <SelectItem value="90" className="text-popover-foreground">
                90 days
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-input border-border text-card-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="text-popover-foreground">
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="flex w-full bg-card overflow-x-auto scrollbar-hide">
          <TabsTrigger
            value="trends"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-2 md:px-3 py-2 text-xs md:text-sm"
          >
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 flex-shrink-0" />
            <span className="whitespace-nowrap">Trends</span>
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-2 md:px-3 py-2 text-xs md:text-sm"
          >
            <PieChartIcon className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 flex-shrink-0" />
            <span className="whitespace-nowrap">Categories</span>
          </TabsTrigger>
          <TabsTrigger
            value="goals"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-2 md:px-3 py-2 text-xs md:text-sm"
          >
            <Target className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 flex-shrink-0" />
            <span className="whitespace-nowrap">Goals</span>
          </TabsTrigger>
          <TabsTrigger
            value="heatmap"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-2 md:px-3 py-2 text-xs md:text-sm"
          >
            <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 flex-shrink-0" />
            <span className="whitespace-nowrap">Heatmap</span>
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-2 md:px-3 py-2 text-xs md:text-sm"
          >
            <BarChart3 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 flex-shrink-0" />
            <span className="whitespace-nowrap">Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Habit Completions Over Time</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Daily habit completion trends for the last {timeRange} days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={habitTimeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="completions"
                      stroke={colors.primary}
                      strokeWidth={3}
                      name="Daily Completions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Average Streak Progress</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Average streak length across all habits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={habitTimeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="streaks"
                      stroke={colors.accent}
                      fill={colors.accent}
                      fillOpacity={0.3}
                      name="Average Streak"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Habit Distribution by Category</CardTitle>
                <CardDescription className="text-muted-foreground">
                  How your habits are distributed across categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={habitDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {habitDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Category Performance</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Average completion rates and streaks by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="averageStreak" fill={colors.primary} name="Avg Streak" />
                    <Bar dataKey="completionRate" fill={colors.accent} name="Completion Rate" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Category Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryData.map((category, index) => (
              <Card key={category.category} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-card-foreground">{category.category}</h3>
                    <Badge
                      style={{
                        backgroundColor: chartColors[index % chartColors.length] + "20",
                        color: chartColors[index % chartColors.length],
                      }}
                    >
                      {category.count} habits
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Avg Streak: {category.averageStreak} days</p>
                    <p>Completion Rate: {category.completionRate}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Goal Progress Overview</CardTitle>
              <CardDescription className="text-muted-foreground">Current progress on all your goals</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={goalProgressData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" domain={[0, 100]} stroke="#9CA3AF" />
                  <YAxis dataKey="goal" type="category" stroke="#9CA3AF" width={150} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                    }}
                  />
                  <Bar dataKey="progress" fill={colors.primary} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Goal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => {
              const deadline = new Date(goal.deadline)
              const today = new Date()
              const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

              return (
                <Card key={goal.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-card-foreground text-sm">{goal.title}</h3>
                        <Badge variant="outline" className="border-accent text-accent text-xs">
                          {goal.category}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-primary font-medium">{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-muted/20 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Priority: {goal.priority}</span>
                          <span>{daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Heatmap Tab */}
        <TabsContent value="heatmap" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">30-Day Consistency Heatmap</CardTitle>
              <CardDescription className="text-muted-foreground">
                Visual representation of your daily habit completion rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 gap-1 mb-4">
                {streakHeatmapData.map((day, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-sm flex items-center justify-center text-xs font-medium relative group cursor-pointer"
                    style={{
                      backgroundColor:
                        day.completionRate === 0
                          ? "#374151"
                          : day.completionRate < 50
                            ? "#FFA500" + "40"
                            : colors.primary + "60",
                      color: day.completionRate > 50 ? "#000000" : "#FFFFFF",
                    }}
                    title={`${day.day} ${day.date}: ${day.completionRate}% completion (${day.completions}/${habits.length})`}
                  >
                    {day.date}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Less consistent</span>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-muted/40"></div>
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#FFA500" + "40" }}></div>
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.primary + "60" }}></div>
                </div>
                <span>More consistent</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Completions</p>
                    <p className="text-2xl font-bold text-primary">
                      {habits.reduce((acc, h) => acc + h.completions.length, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Completion Rate</p>
                    <p className="text-2xl font-bold text-primary">
                      {habits.length > 0
                        ? Math.round((habits.filter((h) => h.completed).length / habits.length) * 100)
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Goals On Track</p>
                    <p className="text-2xl font-bold text-primary">
                      {goals.filter((g) => g.progress >= 50).length}/{goals.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Best Category</p>
                    <p className="text-lg font-bold text-primary">
                      {categoryData.length > 0 ? categoryData[0].category : "None"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Performance Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-card-foreground mb-3">Top Performing Habits</h4>
                  <div className="space-y-2">
                    {habits
                      .sort((a, b) => b.streak - a.streak)
                      .slice(0, 5)
                      .map((habit, index) => (
                        <div key={habit.id} className="flex items-center justify-between p-2 rounded bg-muted/10">
                          <span className="text-sm text-card-foreground">{habit.name}</span>
                          <Badge variant="outline" className="border-primary text-primary">
                            {habit.streak} days
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-card-foreground mb-3">Goals Needing Attention</h4>
                  <div className="space-y-2">
                    {goals
                      .filter((g) => g.progress < 50)
                      .sort((a, b) => a.progress - b.progress)
                      .slice(0, 5)
                      .map((goal) => (
                        <div key={goal.id} className="flex items-center justify-between p-2 rounded bg-muted/10">
                          <span className="text-sm text-card-foreground">{goal.title}</span>
                          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                            {goal.progress}%
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export type { ChartData, CategoryData, GoalProgressData }
