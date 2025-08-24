"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Slider } from "@/components/ui/slider"
import { Target, Plus, Trash2, Calendar, Edit, CheckCircle2, Clock, AlertTriangle } from "lucide-react"

export interface Goal {
  id: string
  title: string
  description: string
  category: string
  progress: number
  deadline: string
  priority: "low" | "medium" | "high"
  status: "active" | "completed" | "paused"
  createdAt: string
  completedAt?: string
  milestones: string[]
}

interface GoalManagerProps {
  goals: Goal[]
  onGoalsChange: (goals: Goal[]) => void
}

const goalCategories = [
  "Health & Fitness",
  "Career & Professional",
  "Financial",
  "Learning & Education",
  "Personal Development",
  "Relationships",
  "Travel & Adventure",
  "Creative & Hobbies",
  "Other",
]

const priorityColors = {
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  high: "bg-red-500/20 text-red-400 border-red-500/30",
}

export function GoalManager({ goals, onGoalsChange }: GoalManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "",
    deadline: "",
    priority: "medium" as const,
    milestones: [""],
  })

  const resetNewGoal = () => {
    setNewGoal({
      title: "",
      description: "",
      category: "",
      deadline: "",
      priority: "medium",
      milestones: [""],
    })
  }

  const addGoal = () => {
    if (!newGoal.title.trim() || !newGoal.category || !newGoal.deadline) return

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title.trim(),
      description: newGoal.description.trim(),
      category: newGoal.category,
      progress: 0,
      deadline: newGoal.deadline,
      priority: newGoal.priority,
      status: "active",
      createdAt: new Date().toISOString(),
      milestones: newGoal.milestones.filter((m) => m.trim()),
    }

    onGoalsChange([...goals, goal])
    resetNewGoal()
    setIsAddDialogOpen(false)
  }

  const updateGoal = (updatedGoal: Goal) => {
    const updatedGoals = goals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal))
    onGoalsChange(updatedGoals)
    setEditingGoal(null)
  }

  const deleteGoal = (goalId: string) => {
    onGoalsChange(goals.filter((goal) => goal.id !== goalId))
  }

  const updateProgress = (goalId: string, progress: number) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId) {
        const updatedGoal = { ...goal, progress }
        if (progress >= 100 && goal.status !== "completed") {
          updatedGoal.status = "completed"
          updatedGoal.completedAt = new Date().toISOString()
        } else if (progress < 100 && goal.status === "completed") {
          updatedGoal.status = "active"
          delete updatedGoal.completedAt
        }
        return updatedGoal
      }
      return goal
    })
    onGoalsChange(updatedGoals)
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getDeadlineStatus = (deadline: string, status: string) => {
    if (status === "completed") return "completed"
    const days = getDaysUntilDeadline(deadline)
    if (days < 0) return "overdue"
    if (days <= 7) return "urgent"
    if (days <= 30) return "approaching"
    return "normal"
  }

  const addMilestone = () => {
    setNewGoal({
      ...newGoal,
      milestones: [...newGoal.milestones, ""],
    })
  }

  const updateMilestone = (index: number, value: string) => {
    const updatedMilestones = [...newGoal.milestones]
    updatedMilestones[index] = value
    setNewGoal({
      ...newGoal,
      milestones: updatedMilestones,
    })
  }

  const removeMilestone = (index: number) => {
    setNewGoal({
      ...newGoal,
      milestones: newGoal.milestones.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Your Goals</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">Add New Goal</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Create a SMART goal to track your progress and achievements.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal-title" className="text-card-foreground">
                  Goal Title
                </Label>
                <Input
                  id="goal-title"
                  placeholder="e.g., Complete Marathon Training"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="bg-input border-border text-card-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-description" className="text-card-foreground">
                  Description
                </Label>
                <Textarea
                  id="goal-description"
                  placeholder="Describe your goal in detail..."
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="bg-input border-border text-card-foreground min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-category" className="text-card-foreground">
                    Category
                  </Label>
                  <Select
                    value={newGoal.category}
                    onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}
                  >
                    <SelectTrigger className="bg-input border-border text-card-foreground">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {goalCategories.map((category) => (
                        <SelectItem key={category} value={category} className="text-popover-foreground">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal-priority" className="text-card-foreground">
                    Priority
                  </Label>
                  <Select
                    value={newGoal.priority}
                    onValueChange={(value: "low" | "medium" | "high") => setNewGoal({ ...newGoal, priority: value })}
                  >
                    <SelectTrigger className="bg-input border-border text-card-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="low" className="text-popover-foreground">
                        Low
                      </SelectItem>
                      <SelectItem value="medium" className="text-popover-foreground">
                        Medium
                      </SelectItem>
                      <SelectItem value="high" className="text-popover-foreground">
                        High
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-deadline" className="text-card-foreground">
                  Deadline
                </Label>
                <Input
                  id="goal-deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="bg-input border-border text-card-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Milestones (Optional)</Label>
                {newGoal.milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Milestone ${index + 1}`}
                      value={milestone}
                      onChange={(e) => updateMilestone(index, e.target.value)}
                      className="bg-input border-border text-card-foreground"
                    />
                    {newGoal.milestones.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeMilestone(index)}
                        className="border-destructive text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMilestone}
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Milestone
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false)
                  resetNewGoal()
                }}
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                Cancel
              </Button>
              <Button
                onClick={addGoal}
                disabled={!newGoal.title.trim() || !newGoal.category || !newGoal.deadline}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Add Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {goals.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <Target className="w-12 h-12 mx-auto text-muted mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">No goals yet</h3>
            <p className="text-muted-foreground mb-4">Start achieving your dreams by setting your first goal.</p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Set Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal) => {
            const deadlineStatus = getDeadlineStatus(goal.deadline, goal.status)
            const daysUntilDeadline = getDaysUntilDeadline(goal.deadline)

            return (
              <Card key={goal.id} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-card-foreground text-lg">{goal.title}</h3>
                          <Badge className={priorityColors[goal.priority]}>{goal.priority}</Badge>
                          <Badge variant="outline" className="border-accent text-accent">
                            {goal.category}
                          </Badge>
                        </div>
                        {goal.description && <p className="text-muted-foreground text-sm mb-3">{goal.description}</p>}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Due: {new Date(goal.deadline).toLocaleDateString()}
                          </span>
                          {deadlineStatus === "overdue" && (
                            <span className="flex items-center gap-1 text-red-400">
                              <AlertTriangle className="w-4 h-4" />
                              {Math.abs(daysUntilDeadline)} days overdue
                            </span>
                          )}
                          {deadlineStatus === "urgent" && (
                            <span className="flex items-center gap-1 text-yellow-400">
                              <Clock className="w-4 h-4" />
                              {daysUntilDeadline} days left
                            </span>
                          )}
                          {deadlineStatus === "approaching" && (
                            <span className="flex items-center gap-1 text-blue-400">
                              <Clock className="w-4 h-4" />
                              {daysUntilDeadline} days left
                            </span>
                          )}
                          {goal.status === "completed" && (
                            <span className="flex items-center gap-1 text-primary">
                              <CheckCircle2 className="w-4 h-4" />
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingGoal(goal)}
                          className="text-muted-foreground hover:text-card-foreground"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteGoal(goal.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-primary font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Update:</span>
                        <Slider
                          value={[goal.progress]}
                          onValueChange={(value) => updateProgress(goal.id, value[0])}
                          max={100}
                          step={5}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    {goal.milestones.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-card-foreground">Milestones:</h4>
                        <ul className="space-y-1">
                          {goal.milestones.map((milestone, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              {milestone}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Goal Statistics */}
      {goals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Total Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{goals.length}</div>
              <p className="text-xs text-muted-foreground">active goals</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {goals.filter((g) => g.status === "completed").length}
              </div>
              <p className="text-xs text-muted-foreground">goals achieved</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Average Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">across all goals</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Urgent Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {goals.filter((g) => getDeadlineStatus(g.deadline, g.status) === "urgent").length}
              </div>
              <p className="text-xs text-muted-foreground">due within 7 days</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
