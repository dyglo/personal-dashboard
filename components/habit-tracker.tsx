"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Plus, Trash2, Target, Flame } from "lucide-react"

export interface Habit {
  id: string
  name: string
  category: string
  streak: number
  completed: boolean
  target: number
  completions: string[] // Array of completion dates
  createdAt: string
}

interface HabitTrackerProps {
  habits: Habit[]
  onHabitsChange: (habits: Habit[]) => void
}

const categories = ["Health & Fitness", "Learning", "Productivity", "Mindfulness", "Social", "Creative", "Other"]

export function HabitTracker({ habits, onHabitsChange }: HabitTrackerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newHabit, setNewHabit] = useState({
    name: "",
    category: "",
    target: 30,
  })

  const today = new Date().toISOString().split("T")[0]

  const addHabit = () => {
    if (!newHabit.name.trim() || !newHabit.category) return

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name.trim(),
      category: newHabit.category,
      streak: 0,
      completed: false,
      target: newHabit.target,
      completions: [],
      createdAt: new Date().toISOString(),
    }

    onHabitsChange([...habits, habit])
    setNewHabit({ name: "", category: "", target: 30 })
    setIsAddDialogOpen(false)
  }

  const toggleHabitCompletion = (habitId: string) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const isCompletedToday = habit.completions.includes(today)
        let newCompletions: string[]
        let newStreak = habit.streak

        if (isCompletedToday) {
          // Remove today's completion
          newCompletions = habit.completions.filter((date) => date !== today)
          newStreak = Math.max(0, habit.streak - 1)
        } else {
          // Add today's completion
          newCompletions = [...habit.completions, today]
          // Calculate new streak
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().split("T")[0]

          if (habit.completions.includes(yesterdayStr) || habit.streak === 0) {
            newStreak = habit.streak + 1
          } else {
            newStreak = 1 // Reset streak if there was a gap
          }
        }

        return {
          ...habit,
          completed: newCompletions.includes(today),
          completions: newCompletions,
          streak: newStreak,
        }
      }
      return habit
    })

    onHabitsChange(updatedHabits)
  }

  const deleteHabit = (habitId: string) => {
    onHabitsChange(habits.filter((habit) => habit.id !== habitId))
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-primary"
    if (streak >= 14) return "text-orange-400"
    if (streak >= 7) return "text-blue-400"
    return "text-muted-foreground"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Your Habits</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add New Habit
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">Add New Habit</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Create a new habit to track your daily progress.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="habit-name" className="text-card-foreground">
                  Habit Name
                </Label>
                <Input
                  id="habit-name"
                  placeholder="e.g., Morning Exercise"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  className="bg-input border-border text-card-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="habit-category" className="text-card-foreground">
                  Category
                </Label>
                <Select
                  value={newHabit.category}
                  onValueChange={(value) => setNewHabit({ ...newHabit, category: value })}
                >
                  <SelectTrigger className="bg-input border-border text-card-foreground">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="text-popover-foreground">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="habit-target" className="text-card-foreground">
                  Target Days
                </Label>
                <Input
                  id="habit-target"
                  type="number"
                  min="1"
                  max="365"
                  value={newHabit.target}
                  onChange={(e) => setNewHabit({ ...newHabit, target: Number.parseInt(e.target.value) || 30 })}
                  className="bg-input border-border text-card-foreground"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                Cancel
              </Button>
              <Button
                onClick={addHabit}
                disabled={!newHabit.name.trim() || !newHabit.category}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Add Habit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {habits.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto text-muted mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">No habits yet</h3>
            <p className="text-muted-foreground mb-4">Start building better habits by adding your first one.</p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Habit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {habits.map((habit) => (
            <Card key={habit.id} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleHabitCompletion(habit.id)}
                      className={`w-8 h-8 rounded-full p-0 ${
                        habit.completed
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border-2 border-muted hover:border-primary"
                      }`}
                    >
                      {habit.completed && <CheckCircle2 className="w-4 h-4" />}
                    </Button>
                    <div>
                      <h3 className="font-semibold text-card-foreground">{habit.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Flame className={`w-4 h-4 ${getStreakColor(habit.streak)}`} />
                          <span className={getStreakColor(habit.streak)}>{habit.streak} day streak</span>
                        </span>
                        <Badge variant="outline" className="border-accent text-accent">
                          {habit.category}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          Target: {habit.target} days
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Progress</div>
                      <div className="text-lg font-semibold text-primary">
                        {Math.round((habit.streak / habit.target) * 100)}%
                      </div>
                    </div>
                    <Progress value={(habit.streak / habit.target) * 100} className="w-24" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteHabit(habit.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Habit Statistics */}
      {habits.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Total Habits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{habits.length}</div>
              <p className="text-xs text-muted-foreground">active habits</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Completed Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{habits.filter((h) => h.completed).length}</div>
              <p className="text-xs text-muted-foreground">of {habits.length} habits</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Longest Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0}
              </div>
              <p className="text-xs text-muted-foreground">days in a row</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
