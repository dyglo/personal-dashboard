"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trophy, Star, Zap, Target, Gamepad2, Gift, Crown, Medal, Flame, CheckCircle2, Play } from "lucide-react"
import type { Habit } from "./habit-tracker"
import type { Goal } from "./goal-manager"

interface GamificationSystemProps {
  habits: Habit[]
  goals: Goal[]
  onXPGained?: (xp: number) => void
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
  category: "habit" | "goal" | "streak" | "consistency" | "milestone"
  requirement: number
  progress: number
  xpReward: number
}

interface UserStats {
  level: number
  xp: number
  xpToNextLevel: number
  totalXP: number
  streakRecord: number
  habitsCompleted: number
  goalsCompleted: number
  daysActive: number
}

interface DailyChallenge {
  id: string
  title: string
  description: string
  type: "habit" | "goal" | "streak" | "completion"
  target: number
  progress: number
  xpReward: number
  completed: boolean
  date: string
}

interface MiniGame {
  id: string
  name: string
  description: string
  type: "memory" | "pattern" | "reflex" | "puzzle"
  unlocked: boolean
  highScore: number
  timesPlayed: number
}

export function GamificationSystem({ habits, goals, onXPGained }: GamificationSystemProps) {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalXP: 0,
    streakRecord: 0,
    habitsCompleted: 0,
    goalsCompleted: 0,
    daysActive: 1,
  })

  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([])
  const [miniGames, setMiniGames] = useState<MiniGame[]>([])
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null)
  const [gameScore, setGameScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)

  // Memory Match Game State
  const [memoryCards, setMemoryCards] = useState<any[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number[]>([])
  const [memoryLevel, setMemoryLevel] = useState(1)
  const [memoryMoves, setMemoryMoves] = useState(0)
  const [memoryTimer, setMemoryTimer] = useState(0)

  // Pattern Master Game State
  const [patternSequence, setPatternSequence] = useState<number[]>([])
  const [userPattern, setUserPattern] = useState<number[]>([])
  const [patternLevel, setPatternLevel] = useState(1)
  const [patternSpeed, setPatternSpeed] = useState(1000)
  const [isShowingPattern, setIsShowingPattern] = useState(false)
  const [isUserTurn, setIsUserTurn] = useState(false)

  // Lightning Reflexes Game State
  const [reflexTarget, setReflexTarget] = useState<{ x: number; y: number } | null>(null)
  const [reflexStartTime, setReflexStartTime] = useState<number | null>(null)
  const [reflexReactionTimes, setReflexReactionTimes] = useState<number[]>([])
  const [reflexLevel, setReflexLevel] = useState(1)
  const [reflexRound, setReflexRound] = useState(0)
  const [reflexMaxRounds] = useState(10)

  // Goal Puzzle Game State
  const [puzzleType, setPuzzleType] = useState<'word' | 'logic' | 'sequence'>('word')
  const [puzzleData, setPuzzleData] = useState<any>(null)
  const [puzzleAnswer, setPuzzleAnswer] = useState('')
  const [puzzleHints, setPuzzleHints] = useState<string[]>([])
  const [puzzleLevel, setPuzzleLevel] = useState(1)

  // Initialize gamification data
  useEffect(() => {
    initializeAchievements()
    initializeDailyChallenges()
    initializeMiniGames()
    loadUserStats()
  }, [])

  // Update stats when habits/goals change
  useEffect(() => {
    updateUserStats()
    updateAchievements()
    updateDailyChallenges()
  }, [habits, goals])

  // Memory game timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameActive && selectedGame?.id === 'memory-match' && memoryCards.length > 0) {
      interval = setInterval(() => {
        setMemoryTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameActive, selectedGame?.id, memoryCards.length])

  // Pattern sequence visualization
  const [activePatternIndex, setActivePatternIndex] = useState(-1)

  const showPatternSequence = async (sequence: number[]) => {
    for (let i = 0; i < sequence.length; i++) {
      setActivePatternIndex(i)
      await new Promise(resolve => setTimeout(resolve, patternSpeed))
    }
    setActivePatternIndex(-1)
    setIsShowingPattern(false)
    setIsUserTurn(true)
  }

  const initializeAchievements = () => {
    const baseAchievements: Achievement[] = [
      {
        id: "first-habit",
        name: "Getting Started",
        description: "Create your first habit",
        icon: "target",
        unlocked: false,
        category: "habit",
        requirement: 1,
        progress: 0,
        xpReward: 50,
      },
      {
        id: "week-streak",
        name: "7-Day Warrior",
        description: "Maintain a 7-day streak",
        icon: "flame",
        unlocked: false,
        category: "streak",
        requirement: 7,
        progress: 0,
        xpReward: 100,
      },
      {
        id: "month-streak",
        name: "Consistency King",
        description: "Maintain a 30-day streak",
        icon: "crown",
        unlocked: false,
        category: "streak",
        requirement: 30,
        progress: 0,
        xpReward: 500,
      },
      {
        id: "goal-crusher",
        name: "Goal Crusher",
        description: "Complete 5 goals",
        icon: "trophy",
        unlocked: false,
        category: "goal",
        requirement: 5,
        progress: 0,
        xpReward: 300,
      },
      {
        id: "habit-master",
        name: "Habit Master",
        description: "Complete 100 habit instances",
        icon: "medal",
        unlocked: false,
        category: "consistency",
        requirement: 100,
        progress: 0,
        xpReward: 1000,
      },
      {
        id: "level-10",
        name: "Rising Star",
        description: "Reach level 10",
        icon: "star",
        unlocked: false,
        category: "milestone",
        requirement: 10,
        progress: 0,
        xpReward: 200,
      },
    ]
    setAchievements(baseAchievements)
  }

  const initializeDailyChallenges = () => {
    const today = new Date().toISOString().split("T")[0]
    const challenges: DailyChallenge[] = [
      {
        id: "daily-complete-3",
        title: "Triple Threat",
        description: "Complete 3 habits today",
        type: "completion",
        target: 3,
        progress: 0,
        xpReward: 75,
        completed: false,
        date: today,
      },
      {
        id: "daily-goal-progress",
        title: "Goal Getter",
        description: "Make progress on any goal",
        type: "goal",
        target: 1,
        progress: 0,
        xpReward: 50,
        completed: false,
        date: today,
      },
      {
        id: "daily-perfect",
        title: "Perfect Day",
        description: "Complete all your habits",
        type: "completion",
        target: habits.length || 1,
        progress: 0,
        xpReward: 150,
        completed: false,
        date: today,
      },
    ]
    setDailyChallenges(challenges)
  }

  const initializeMiniGames = () => {
    const games: MiniGame[] = [
      {
        id: "memory-match",
        name: "Memory Match",
        description: "Match habit icons to improve memory",
        type: "memory",
        unlocked: true,
        highScore: 0,
        timesPlayed: 0,
      },
      {
        id: "pattern-sequence",
        name: "Pattern Master",
        description: "Follow the sequence pattern",
        type: "pattern",
        unlocked: true, // Unlocked by default for better user experience
        highScore: 0,
        timesPlayed: 0,
      },
      {
        id: "reflex-test",
        name: "Lightning Reflexes",
        description: "Test your reaction time",
        type: "reflex",
        unlocked: true, // Unlocked by default for better user experience
        highScore: 0,
        timesPlayed: 0,
      },
      {
        id: "goal-puzzle",
        name: "Goal Puzzle",
        description: "Solve puzzles based on your goals",
        type: "puzzle",
        unlocked: true, // Unlocked by default for better user experience
        highScore: 0,
        timesPlayed: 0,
      },
    ]
    setMiniGames(games)
  }

  const loadUserStats = () => {
    const savedStats = localStorage.getItem("tafa-user-stats")
    if (savedStats) {
      try {
        setUserStats(JSON.parse(savedStats))
      } catch (error) {
        console.error("Failed to load user stats:", error)
      }
    }
  }

  const saveUserStats = (stats: UserStats) => {
    localStorage.setItem("tafa-user-stats", JSON.stringify(stats))
    setUserStats(stats)
  }

  const updateUserStats = () => {
    const completedHabits = habits.filter((h) => h.completed).length
    const completedGoals = goals.filter((g) => g.status === "completed").length
    const longestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0
    const totalHabitCompletions = habits.reduce((acc, h) => acc + h.completions.length, 0)

    const newStats = {
      ...userStats,
      streakRecord: Math.max(userStats.streakRecord, longestStreak),
      habitsCompleted: totalHabitCompletions,
      goalsCompleted: completedGoals,
    }

    // Calculate XP gains
    const xpFromHabits = completedHabits * 10
    const xpFromGoals = completedGoals * 50
    const xpFromStreaks = longestStreak * 5
    const totalNewXP = xpFromHabits + xpFromGoals + xpFromStreaks

    if (totalNewXP > newStats.totalXP) {
      const xpGained = totalNewXP - newStats.totalXP
      newStats.totalXP = totalNewXP
      newStats.xp += xpGained

      // Level up logic
      while (newStats.xp >= newStats.xpToNextLevel) {
        newStats.xp -= newStats.xpToNextLevel
        newStats.level += 1
        newStats.xpToNextLevel = Math.floor(newStats.xpToNextLevel * 1.2)
      }

      onXPGained?.(xpGained)
    }

    saveUserStats(newStats)
  }

  const updateAchievements = () => {
    const updatedAchievements = achievements.map((achievement) => {
      let progress = 0
      let unlocked = achievement.unlocked

      switch (achievement.id) {
        case "first-habit":
          progress = habits.length
          break
        case "week-streak":
          progress = userStats.streakRecord
          break
        case "month-streak":
          progress = userStats.streakRecord
          break
        case "goal-crusher":
          progress = userStats.goalsCompleted
          break
        case "habit-master":
          progress = userStats.habitsCompleted
          break
        case "level-10":
          progress = userStats.level
          break
      }

      if (progress >= achievement.requirement && !unlocked) {
        unlocked = true
        // Award XP for achievement
        const newStats = { ...userStats }
        newStats.xp += achievement.xpReward
        newStats.totalXP += achievement.xpReward
        saveUserStats(newStats)
      }

      return {
        ...achievement,
        progress: Math.min(progress, achievement.requirement),
        unlocked,
        unlockedAt: unlocked && !achievement.unlocked ? new Date().toISOString() : achievement.unlockedAt,
      }
    })

    setAchievements(updatedAchievements)
  }

  const updateDailyChallenges = () => {
    const today = new Date().toISOString().split("T")[0]
    const completedToday = habits.filter((h) => h.completed).length

    const updatedChallenges = dailyChallenges.map((challenge) => {
      if (challenge.date !== today) return challenge

      let progress = 0
      let completed = challenge.completed

      switch (challenge.id) {
        case "daily-complete-3":
          progress = completedToday
          break
        case "daily-goal-progress":
          progress = goals.filter((g) => g.progress > 0).length > 0 ? 1 : 0
          break
        case "daily-perfect":
          progress = completedToday
          challenge.target = habits.length || 1
          break
      }

      if (progress >= challenge.target && !completed) {
        completed = true
        // Award XP for challenge completion
        const newStats = { ...userStats }
        newStats.xp += challenge.xpReward
        newStats.totalXP += challenge.xpReward
        saveUserStats(newStats)
      }

      return {
        ...challenge,
        progress: Math.min(progress, challenge.target),
        completed,
      }
    })

    setDailyChallenges(updatedChallenges)
  }

  const playMiniGame = (game: MiniGame) => {
    if (!game.unlocked) return
    setSelectedGame(game)
    setGameScore(0)
    setGameActive(true)
    
    // Initialize specific game
    switch (game.id) {
      case 'memory-match':
        initializeMemoryGame()
        break
      case 'pattern-sequence':
        initializePatternGame()
        break
      case 'reflex-test':
        initializeReflexGame()
        break
      case 'goal-puzzle':
        initializePuzzleGame()
        break
      default:
        // Simple click game (existing)
        break
    }
  }

  // Memory Match Game Logic
  const initializeMemoryGame = () => {
    const habitIcons = ['🏃', '💧', '📚', '🧘', '🥗', '💤', '🏋️', '🎯', '📝', '🎨', '🎵', '🌱']
    const selectedIcons = habitIcons.slice(0, 6 + memoryLevel * 2) // Increase cards with level
    const cards = [...selectedIcons, ...selectedIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon, isFlipped: false, isMatched: false }))
    
    setMemoryCards(cards)
    setFlippedCards([])
    setMatchedPairs([])
    setMemoryMoves(0)
    setMemoryTimer(0)
  }

  const handleMemoryCardClick = (cardId: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardId) || matchedPairs.includes(cardId)) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setMemoryMoves(prev => prev + 1)
      const [first, second] = newFlippedCards
      
      if (memoryCards[first].icon === memoryCards[second].icon) {
        // Match found
        setMatchedPairs(prev => [...prev, first, second])
        setFlippedCards([])
        
        // Check if game is complete
        if (matchedPairs.length + 2 === memoryCards.length) {
          const score = Math.floor((1000 - memoryMoves * 10 - memoryTimer) * memoryLevel)
          endGame(score)
        }
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  // Pattern Master Game Logic
  const initializePatternGame = () => {
    const newSequence = generatePatternSequence(patternLevel)
    setPatternSequence(newSequence)
    setUserPattern([])
    setPatternSpeed(Math.max(500, 1000 - patternLevel * 50)) // Speed increases with level
    setIsShowingPattern(true)
    setIsUserTurn(false)
    
    // Show pattern sequence
    showPatternSequence(newSequence)
  }

  const generatePatternSequence = (level: number) => {
    const sequence = []
    for (let i = 0; i < 3 + level; i++) {
      sequence.push(Math.floor(Math.random() * 4))
    }
    return sequence
  }



  const handlePatternClick = (buttonIndex: number) => {
    if (!isUserTurn) return
    
    const newUserPattern = [...userPattern, buttonIndex]
    setUserPattern(newUserPattern)
    
    // Check if pattern is correct so far
    const isCorrect = newUserPattern.every((click, index) => click === patternSequence[index])
    
    if (!isCorrect) {
      // Game over
      const score = Math.floor((patternLevel * 100) + (newUserPattern.length * 10))
      endGame(score)
      return
    }
    
    if (newUserPattern.length === patternSequence.length) {
      // Level complete, start next level
      setPatternLevel(prev => prev + 1)
      setTimeout(() => {
        initializePatternGame()
      }, 1000)
    }
  }

  // Lightning Reflexes Game Logic
  const initializeReflexGame = () => {
    setReflexRound(0)
    setReflexReactionTimes([])
    setReflexTarget(null)
    startReflexRound()
  }

  const startReflexRound = () => {
    if (reflexRound >= reflexMaxRounds) {
      const averageReactionTime = reflexReactionTimes.reduce((a, b) => a + b, 0) / reflexReactionTimes.length
      const score = Math.floor((1000 - averageReactionTime) * reflexLevel)
      endGame(score)
      return
    }

    // Random delay before showing target
    const delay = Math.random() * 3000 + 1000 // 1-4 seconds
    setTimeout(() => {
      const x = Math.random() * 300 + 50
      const y = Math.random() * 200 + 50
      setReflexTarget({ x, y })
      setReflexStartTime(Date.now())
    }, delay)
  }

  const handleReflexClick = () => {
    if (!reflexStartTime) return
    
    const reactionTime = Date.now() - reflexStartTime
    setReflexReactionTimes(prev => [...prev, reactionTime])
    setReflexTarget(null)
    setReflexStartTime(null)
    setReflexRound(prev => prev + 1)
    
    setTimeout(() => {
      startReflexRound()
    }, 500)
  }

  // Goal Puzzle Game Logic
  const initializePuzzleGame = () => {
    const puzzle = generateGoalPuzzle(puzzleLevel)
    setPuzzleData(puzzle)
    setPuzzleAnswer('')
    setPuzzleHints(puzzle.hints)
  }

  const generateGoalPuzzle = (level: number) => {
    const puzzleTypes = ['word', 'logic', 'sequence']
    const type = puzzleTypes[level % 3] as 'word' | 'logic' | 'sequence'
    setPuzzleType(type)
    
    switch (type) {
      case 'word':
        return {
          type: 'word',
          question: 'What habit helps you achieve your goals? (Hint: It starts with "C")',
          answer: 'consistency',
          hints: ['Think about what you need to do every day', 'It\'s not about perfection, but about...']
        }
      case 'logic':
        return {
          type: 'logic',
          question: 'If you complete 3 habits daily for 7 days, how many total completions do you have?',
          answer: '21',
          hints: ['Multiply daily habits by number of days', '3 × 7 = ?']
        }
      case 'sequence':
        return {
          type: 'sequence',
          question: 'Complete the sequence: Plan → Execute → ? → Improve',
          answer: 'review',
          hints: ['What do you do after executing?', 'It rhymes with "new"']
        }
      default:
        return {
          type: 'word',
          question: 'What is the key to success?',
          answer: 'persistence',
          hints: ['Keep going even when it\'s hard', 'Don\'t give up']
        }
    }
  }

  const handlePuzzleSubmit = () => {
    if (puzzleAnswer.toLowerCase() === puzzleData.answer.toLowerCase()) {
      const score = Math.floor((puzzleLevel * 150) + (puzzleHints.length * 25))
      endGame(score)
    } else {
      // Wrong answer, give a hint
      if (puzzleHints.length > 0) {
        setPuzzleHints(prev => prev.slice(1))
      }
    }
  }

  const endGame = (score: number) => {
    if (!selectedGame) return

    const updatedGames = miniGames.map((game) => {
      if (game.id === selectedGame.id) {
        return {
          ...game,
          highScore: Math.max(game.highScore, score),
          timesPlayed: game.timesPlayed + 1,
        }
      }
      return game
    })

    setMiniGames(updatedGames)
    setGameActive(false)
    setSelectedGame(null)

    // Award XP based on score
    const xpGained = Math.floor(score / 10)
    if (xpGained > 0) {
      const newStats = { ...userStats }
      newStats.xp += xpGained
      newStats.totalXP += xpGained
      saveUserStats(newStats)
      onXPGained?.(xpGained)
    }
  }

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case "target":
        return <Target className="w-8 h-8" />
      case "flame":
        return <Flame className="w-8 h-8" />
      case "crown":
        return <Crown className="w-8 h-8" />
      case "trophy":
        return <Trophy className="w-8 h-8" />
      case "medal":
        return <Medal className="w-8 h-8" />
      case "star":
        return <Star className="w-8 h-8" />
      default:
        return <Trophy className="w-8 h-8" />
    }
  }

  return (
    <div className="space-y-6">
      {/* User Stats Header */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-card-foreground">Level {userStats.level}</h3>
                <p className="text-muted-foreground">
                  {userStats.xp} / {userStats.xpToNextLevel} XP to next level
                </p>
                <Progress value={(userStats.xp / userStats.xpToNextLevel) * 100} className="w-48 mt-2" />
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{userStats.totalXP}</div>
              <p className="text-sm text-muted-foreground">Total XP</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="flex w-full bg-card overflow-x-auto scrollbar-hide">
          <TabsTrigger
            value="achievements"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-2 md:px-3 py-2 text-xs md:text-sm"
          >
            <span className="whitespace-nowrap">Achievements</span>
          </TabsTrigger>
          <TabsTrigger
            value="challenges"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-2 md:px-3 py-2 text-xs md:text-sm"
          >
            <span className="whitespace-nowrap">Daily Challenges</span>
          </TabsTrigger>
          <TabsTrigger
            value="games"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-2 md:px-3 py-2 text-xs md:text-sm"
          >
            <span className="whitespace-nowrap">Mini Games</span>
          </TabsTrigger>
          <TabsTrigger
            value="rewards"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0 min-w-0 px-2 md:px-3 py-2 text-xs md:text-sm"
          >
            <span className="whitespace-nowrap">Rewards</span>
          </TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`bg-card border-border ${achievement.unlocked ? "ring-2 ring-primary" : "opacity-60"}`}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <div className={`mx-auto ${achievement.unlocked ? "text-primary" : "text-muted"}`}>
                      {getAchievementIcon(achievement.icon)}
                    </div>
                  </div>
                  <h3 className="font-semibold text-card-foreground mb-2">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>

                  {!achievement.unlocked && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>
                          {achievement.progress}/{achievement.requirement}
                        </span>
                      </div>
                      <Progress value={(achievement.progress / achievement.requirement) * 100} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2">
                    <Badge
                      variant={achievement.unlocked ? "default" : "secondary"}
                      className={achievement.unlocked ? "bg-primary text-primary-foreground" : ""}
                    >
                      {achievement.unlocked ? "Unlocked" : "Locked"}
                    </Badge>
                    <Badge variant="outline" className="border-accent text-accent">
                      +{achievement.xpReward} XP
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Daily Challenges Tab */}
        <TabsContent value="challenges" className="space-y-4">
          <div className="grid gap-4">
            {dailyChallenges.map((challenge) => (
              <Card key={challenge.id} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          challenge.completed ? "bg-primary/20" : "bg-muted/20"
                        }`}
                      >
                        {challenge.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        ) : (
                          <Target className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Progress value={(challenge.progress / challenge.target) * 100} className="w-32 h-2" />
                          <span className="text-xs text-muted-foreground">
                            {challenge.progress}/{challenge.target}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={challenge.completed ? "default" : "secondary"}
                        className={challenge.completed ? "bg-primary text-primary-foreground" : ""}
                      >
                        {challenge.completed ? "Complete" : "In Progress"}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">+{challenge.xpReward} XP</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Mini Games Tab */}
        <TabsContent value="games" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {miniGames.map((game) => (
              <Card key={game.id} className={`bg-card border-border ${!game.unlocked ? "opacity-60" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          game.unlocked ? "bg-primary/20" : "bg-muted/20"
                        }`}
                      >
                        <Gamepad2 className={`w-6 h-6 ${game.unlocked ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">{game.name}</h3>
                        <p className="text-sm text-muted-foreground">{game.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <p>High Score: {game.highScore}</p>
                      <p>Times Played: {game.timesPlayed}</p>
                    </div>
                    <Button
                      onClick={() => playMiniGame(game)}
                      disabled={!game.unlocked}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Reward Store</CardTitle>
              <CardDescription className="text-muted-foreground">
                Spend your XP on virtual rewards and customizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Gift className="w-16 h-16 mx-auto text-muted mb-4" />
                <h3 className="text-lg font-semibold text-card-foreground mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">Unlock themes, badges, and special features with your earned XP</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Multi-Game Dialog */}
      <Dialog open={gameActive} onOpenChange={setGameActive}>
        <DialogContent className="bg-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">{selectedGame?.name}</DialogTitle>
            <DialogDescription className="text-muted-foreground">{selectedGame?.description}</DialogDescription>
          </DialogHeader>
          
          {/* Game Content */}
          <div className="py-6">
            {selectedGame?.id === 'memory-match' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Level: {memoryLevel} | Moves: {memoryMoves}
                  </div>
                  <div className="text-lg font-bold text-primary">{gameScore}</div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {memoryCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => handleMemoryCardClick(card.id)}
                      disabled={flippedCards.includes(card.id) || matchedPairs.includes(card.id)}
                      className={`aspect-square rounded-lg border-2 transition-all duration-300 ${
                        flippedCards.includes(card.id) || matchedPairs.includes(card.id)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted/20 border-border hover:border-primary'
                      }`}
                    >
                      {(flippedCards.includes(card.id) || matchedPairs.includes(card.id)) && (
                        <span className="text-2xl">{card.icon}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedGame?.id === 'pattern-sequence' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Level: {patternLevel} | Speed: {patternSpeed}ms
                  </div>
                  <div className="text-lg font-bold text-primary">{gameScore}</div>
                </div>
                <div className="text-center">
                  {isShowingPattern ? (
                    <p className="text-muted-foreground">Watch the pattern...</p>
                  ) : isUserTurn ? (
                    <p className="text-primary font-medium">Your turn! Repeat the pattern</p>
                  ) : (
                    <p className="text-muted-foreground">Get ready...</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                  {[0, 1, 2, 3].map((index) => (
                    <button
                      key={index}
                      onClick={() => handlePatternClick(index)}
                      disabled={!isUserTurn}
                      className={`aspect-square rounded-lg border-2 transition-all duration-200 ${
                        isUserTurn
                          ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                          : isShowingPattern && activePatternIndex >= 0 && patternSequence[activePatternIndex] === index
                          ? 'bg-primary text-primary-foreground border-primary scale-110'
                          : 'bg-muted/20 border-border'
                      }`}
                    >
                      <span className="text-2xl">
                        {index === 0 ? '🔴' : index === 1 ? '🟢' : index === 2 ? '🟡' : '🔵'}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Progress: {userPattern.length}/{patternSequence.length}
                </div>
              </div>
            )}

            {selectedGame?.id === 'reflex-test' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Round: {reflexRound}/{reflexMaxRounds} | Level: {reflexLevel}
                  </div>
                  <div className="text-lg font-bold text-primary">{gameScore}</div>
                </div>
                <div className="relative h-64 bg-muted/20 rounded-lg border-2 border-dashed border-border">
                  {reflexTarget ? (
                    <button
                      onClick={handleReflexClick}
                      className="absolute w-8 h-8 bg-primary rounded-full hover:bg-primary/90 transition-all duration-200"
                      style={{
                        left: `${reflexTarget.x}px`,
                        top: `${reflexTarget.y}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <Zap className="w-4 h-4 text-primary-foreground" />
                    </button>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">Wait for the target to appear...</p>
                    </div>
                  )}
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  {reflexReactionTimes.length > 0 && (
                    <p>Average: {Math.round(reflexReactionTimes.reduce((a, b) => a + b, 0) / reflexReactionTimes.length)}ms</p>
                  )}
                </div>
              </div>
            )}

            {selectedGame?.id === 'goal-puzzle' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Level: {puzzleLevel} | Type: {puzzleType}
                  </div>
                  <div className="text-lg font-bold text-primary">{gameScore}</div>
                </div>
                <div className="space-y-4">
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-card-foreground mb-2">Puzzle:</h3>
                    <p className="text-muted-foreground">{puzzleData?.question}</p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={puzzleAnswer}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPuzzleAnswer(e.target.value)}
                      placeholder="Enter your answer..."
                      className="flex-1"
                    />
                    <Button onClick={handlePuzzleSubmit} className="bg-primary text-primary-foreground">
                      Submit
                    </Button>
                  </div>
                  {puzzleHints.length > 0 && (
                    <div className="bg-accent/20 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Hint: {puzzleHints[puzzleHints.length - 1]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Simple Click Game (Fallback) */}
            {selectedGame && !['memory-match', 'pattern-sequence', 'reflex-test', 'goal-puzzle'].includes(selectedGame.id) && (
              <div className="py-8 text-center">
                <div className="text-4xl font-bold text-primary mb-4">{gameScore}</div>
                <p className="text-muted-foreground mb-6">Click the button as fast as you can!</p>
                <Button
                  onClick={() => setGameScore((prev) => prev + 10)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-4"
                >
                  <Zap className="w-6 h-6 mr-2" />
                  Click Me!
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => endGame(gameScore)}
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              End Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
