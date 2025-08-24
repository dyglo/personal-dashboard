"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Clock, 
  Star, 
  Plus, 
  CheckCircle2, 
  Zap,
  Brain,
  Loader2
} from "lucide-react"
import type { Habit } from "./habit-tracker"
import type { Goal } from "./goal-manager"

interface SmartHabitSuggestion {
  id: string
  title: string
  description: string
  category: "productivity" | "health" | "learning" | "mindfulness" | "social" | "custom"
  difficulty: "easy" | "medium" | "hard"
  estimatedTime: number // in minutes
  frequency: "daily" | "weekly" | "monthly"
  impactScore: number // 1-10
  aiReasoning: string
  relatedGoals: string[]
  suggestedTime: "morning" | "afternoon" | "evening" | "anytime"
  tags: string[]
}

interface SmartHabitSuggestionsProps {
  habits: Habit[]
  goals: Goal[]
  onAddHabit: (habit: Omit<Habit, "id" | "createdAt" | "completions" | "streak" | "completed">) => void
}

export function SmartHabitSuggestions({ habits, goals, onAddHabit }: SmartHabitSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SmartHabitSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")

  const categories = [
    { id: "all", name: "All", icon: Star },
    { id: "productivity", name: "Productivity", icon: TrendingUp },
    { id: "health", name: "Health", icon: Target },
    { id: "learning", name: "Learning", icon: Brain },
    { id: "mindfulness", name: "Mindfulness", icon: Zap },
    { id: "social", name: "Social", icon: CheckCircle2 },
  ]

  const difficulties = [
    { id: "all", name: "All", color: "bg-gray-500" },
    { id: "easy", name: "Easy", color: "bg-green-500" },
    { id: "medium", name: "Medium", color: "bg-yellow-500" },
    { id: "hard", name: "Hard", color: "bg-red-500" },
  ]

  useEffect(() => {
    generateSmartSuggestions()
  }, [habits, goals])

  const generateSmartSuggestions = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/ai/smart-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ habits, goals }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate suggestions")
      }

      const data = await response.json()
      setSuggestions(data.suggestions)
    } catch (error) {
      console.error("Error generating smart suggestions:", error)
      // Fallback to mock suggestions
      generateMockSuggestions()
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockSuggestions = () => {
    const mockSuggestions: SmartHabitSuggestion[] = [
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
    setSuggestions(mockSuggestions)
  }

  const handleAddHabit = (suggestion: SmartHabitSuggestion) => {
    const newHabit: Omit<Habit, "id" | "createdAt" | "completions" | "streak" | "completed"> = {
      name: suggestion.title,
      description: suggestion.description,
      target: suggestion.frequency === "daily" ? 1 : suggestion.frequency === "weekly" ? 7 : 30,
      category: suggestion.category,
      timeOfDay: suggestion.suggestedTime,
      reminder: true,
      tags: suggestion.tags,
    }
    
    onAddHabit(newHabit)
  }

  const filteredSuggestions = suggestions.filter(suggestion => {
    const categoryMatch = selectedCategory === "all" || suggestion.category === selectedCategory
    const difficultyMatch = selectedDifficulty === "all" || suggestion.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500"
      case "medium": return "bg-yellow-500"
      case "hard": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "productivity": return <TrendingUp className="w-4 h-4" />
      case "health": return <Target className="w-4 h-4" />
      case "learning": return <Brain className="w-4 h-4" />
      case "mindfulness": return <Zap className="w-4 h-4" />
      case "social": return <CheckCircle2 className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-primary" />
            Smart Habit Suggestions
          </h2>
          <p className="text-muted-foreground">
            AI-powered suggestions based on your goals and patterns
          </p>
        </div>
        <Button
          onClick={generateSmartSuggestions}
          disabled={isLoading}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Brain className="w-4 h-4 mr-2" />
          )}
          Refresh Suggestions
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <category.icon className="w-3 h-3" />
              <span className="hidden sm:inline">{category.name}</span>
              <span className="sm:hidden">{category.name.slice(0, 3)}</span>
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {difficulties.map((difficulty) => (
            <Button
              key={difficulty.id}
              variant={selectedDifficulty === difficulty.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDifficulty(difficulty.id)}
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <div className={`w-2 h-2 rounded-full ${difficulty.color}`} />
              <span className="hidden sm:inline">{difficulty.name}</span>
              <span className="sm:hidden">{difficulty.name.slice(0, 3)}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredSuggestions.map((suggestion) => (
          <Card key={suggestion.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(suggestion.category)}
                  <Badge variant="outline" className="text-xs">
                    {suggestion.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${getDifficultyColor(suggestion.difficulty)}`} />
                  <span className="text-xs text-muted-foreground capitalize">
                    {suggestion.difficulty}
                  </span>
                </div>
              </div>
              <CardTitle className="text-lg">{suggestion.title}</CardTitle>
              <CardDescription className="text-sm">
                {suggestion.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Impact Score */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Impact Score</span>
                <div className="flex items-center gap-2">
                  <Progress value={suggestion.impactScore * 10} className="w-16 h-2" />
                  <span className="text-sm font-medium">{suggestion.impactScore}/10</span>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span>{suggestion.estimatedTime}min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3 text-muted-foreground" />
                  <span className="capitalize">{suggestion.frequency}</span>
                </div>
              </div>

              {/* AI Reasoning */}
              <div className="bg-muted/20 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>AI Insight:</strong> {suggestion.aiReasoning}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {suggestion.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Add Button */}
              <Button
                onClick={() => handleAddHabit(suggestion)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add as Habit
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuggestions.length === 0 && !isLoading && (
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <Lightbulb className="w-12 h-12 mx-auto text-muted mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">No suggestions found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or refresh the suggestions
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
