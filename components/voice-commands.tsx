"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  Play, 
  Pause,
  Loader2,
  Zap,
  Command,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { toast } from "sonner"

interface VoiceCommandsProps {
  onNavigate: (tab: string) => void
  onAddHabit: (habit: any) => void
  onMarkHabitComplete: (habitId: string) => void
  onAddGoal: (goal: any) => void
  habits: any[]
  goals: any[]
  currentTab: string
}

interface VoiceCommand {
  id: string
  phrase: string
  description: string
  category: "navigation" | "actions" | "queries" | "system"
  action: string
  example: string
}

export function VoiceCommands({ 
  onNavigate, 
  onAddHabit, 
  onMarkHabitComplete, 
  onAddGoal, 
  habits, 
  goals, 
  currentTab 
}: VoiceCommandsProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  
  const recognitionRef = useRef<any>(null)
  const synthesisRef = useRef<SpeechSynthesis | null>(null)

  // Voice commands configuration
  const voiceCommands: VoiceCommand[] = [
    // Navigation commands
    {
      id: "nav-overview",
      phrase: "go to overview",
      description: "Navigate to overview tab",
      category: "navigation",
      action: "navigate:overview",
      example: "Go to overview"
    },
    {
      id: "nav-habits",
      phrase: "go to habits",
      description: "Navigate to habits tab",
      category: "navigation",
      action: "navigate:habits",
      example: "Go to habits"
    },
    {
      id: "nav-goals",
      phrase: "go to goals",
      description: "Navigate to goals tab",
      category: "navigation",
      action: "navigate:goals",
      example: "Go to goals"
    },
    {
      id: "nav-suggestions",
      phrase: "go to suggestions",
      description: "Navigate to suggestions tab",
      category: "navigation",
      action: "navigate:suggestions",
      example: "Go to suggestions"
    },
    {
      id: "nav-gamification",
      phrase: "go to gamification",
      description: "Navigate to gamification tab",
      category: "navigation",
      action: "navigate:gamification",
      example: "Go to gamification"
    },
    {
      id: "nav-insights",
      phrase: "go to ai insights",
      description: "Navigate to AI insights tab",
      category: "navigation",
      action: "navigate:insights",
      example: "Go to AI insights"
    },

    // Action commands
    {
      id: "add-habit",
      phrase: "add new habit",
      description: "Add a new habit",
      category: "actions",
      action: "add_habit",
      example: "Add new habit called 'Morning Exercise'"
    },
    {
      id: "mark-complete",
      phrase: "mark habit complete",
      description: "Mark a habit as complete",
      category: "actions",
      action: "mark_habit_complete",
      example: "Mark 'Morning Exercise' complete"
    },
    {
      id: "add-goal",
      phrase: "add new goal",
      description: "Add a new goal",
      category: "actions",
      action: "add_goal",
      example: "Add new goal called 'Learn Spanish'"
    },

    // Query commands
    {
      id: "progress-query",
      phrase: "what's my progress",
      description: "Get progress overview",
      category: "queries",
      action: "query_progress",
      example: "What's my progress?"
    },
    {
      id: "streak-query",
      phrase: "show my streaks",
      description: "Get streak information",
      category: "queries",
      action: "query_streaks",
      example: "Show my streaks"
    },
    {
      id: "insights-query",
      phrase: "give me insights",
      description: "Get AI insights",
      category: "queries",
      action: "query_insights",
      example: "Give me insights"
    },

    // System commands
    {
      id: "help",
      phrase: "help",
      description: "Show available commands",
      category: "system",
      action: "help",
      example: "Help"
    },
    {
      id: "stop-listening",
      phrase: "stop listening",
      description: "Stop voice recognition",
      category: "system",
      action: "stop_listening",
      example: "Stop listening"
    }
  ]

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onstart = () => {
        setIsListening(true)
        toast.success("Voice recognition started", {
          description: "I'm listening for your commands..."
        })
      }

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i].transcript
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript.toLowerCase())
          processVoiceCommand(finalTranscript.toLowerCase())
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        toast.error("Voice recognition error", {
          description: "Please try again or check your microphone permissions."
        })
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // Initialize speech synthesis
    synthesisRef.current = window.speechSynthesis

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel()
      }
    }
  }, [])

  const processVoiceCommand = async (command: string) => {
    setIsProcessing(true)
    
    try {
      // Find matching command
      const matchedCommand = voiceCommands.find(cmd => 
        command.includes(cmd.phrase.toLowerCase())
      )

      if (matchedCommand) {
        await executeCommand(matchedCommand, command)
      } else {
        // Use AI to understand the command
        await processAICommand(command)
      }
    } catch (error) {
      console.error('Error processing voice command:', error)
      speakResponse("Sorry, I couldn't process that command. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const executeCommand = async (command: VoiceCommand, fullCommand: string) => {
    let response = ""

    switch (command.action) {
      case "navigate:overview":
        onNavigate("overview")
        response = "Navigating to overview"
        break
      case "navigate:habits":
        onNavigate("habits")
        response = "Navigating to habits"
        break
      case "navigate:goals":
        onNavigate("goals")
        response = "Navigating to goals"
        break
      case "navigate:suggestions":
        onNavigate("suggestions")
        response = "Navigating to suggestions"
        break
      case "navigate:gamification":
        onNavigate("gamification")
        response = "Navigating to gamification"
        break
      case "navigate:insights":
        onNavigate("insights")
        response = "Navigating to AI insights"
        break
      case "add_habit":
        response = "I'll help you add a new habit. Please specify the habit name and details."
        break
      case "mark_habit_complete":
        response = "I'll help you mark a habit as complete. Please specify which habit."
        break
      case "add_goal":
        response = "I'll help you add a new goal. Please specify the goal name and details."
        break
      case "query_progress":
        const completedHabits = habits.filter(h => h.completed).length
        const totalHabits = habits.length
        const completedGoals = goals.filter(g => g.completed).length
        const totalGoals = goals.length
        response = `Your progress: ${completedHabits} out of ${totalHabits} habits completed today, and ${completedGoals} out of ${totalGoals} goals completed.`
        break
      case "query_streaks":
        const longestStreak = Math.max(...habits.map(h => h.streak || 0))
        response = `Your longest current streak is ${longestStreak} days. Keep up the great work!`
        break
      case "query_insights":
        response = "I'll analyze your data and provide insights. Let me check your progress patterns."
        break
      case "help":
        response = "Available commands: Go to overview, habits, goals, suggestions, gamification, or AI insights. You can also ask about your progress, streaks, or request insights."
        break
      case "stop_listening":
        stopListening()
        response = "Stopping voice recognition"
        break
      default:
        response = "Command executed successfully"
    }

    speakResponse(response)
  }

  const processAICommand = async (command: string) => {
    try {
      const response = await fetch("/api/ai/voice-command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          command, 
          habits, 
          goals, 
          currentTab 
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to process AI command")
      }

      const data = await response.json()
      setAiResponse(data.response)
      
      // Use Gemini TTS for AI response
      await generateAndPlayAudio(data.response)
    } catch (error) {
      console.error("Error processing AI command:", error)
      speakResponse("Sorry, I couldn't understand that command. Please try again.")
    }
  }

  const generateAndPlayAudio = async (text: string) => {
    try {
      setIsSpeaking(true)
      
      const response = await fetch("/api/ai/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate speech")
      }

      const data = await response.json()
      
      // For now, we'll use browser speech synthesis as the primary method
      // since Gemini TTS might not be available in the current SDK version
      speakResponse(text)
      
    } catch (error) {
      console.error("Error generating audio:", error)
      // Fallback to browser speech synthesis
      speakResponse(text)
    }
  }

  const speakResponse = (text: string) => {
    if (!isVoiceEnabled || !synthesisRef.current) return

    synthesisRef.current.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1.1
    utterance.volume = 0.8
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    
    synthesisRef.current.speak(utterance)
  }

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled)
    if (!isVoiceEnabled) {
      synthesisRef.current?.cancel()
    }
  }

  const stopAudio = () => {
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
    }
    synthesisRef.current?.cancel()
    setIsSpeaking(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Mic className="w-6 h-6 text-primary" />
            Voice Commands
          </h2>
          <p className="text-muted-foreground">
            Control your dashboard with voice commands
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleVoice}
            className="flex items-center gap-2"
          >
            {isVoiceEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            {isVoiceEnabled ? "Voice On" : "Voice Off"}
          </Button>
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className={`flex items-center gap-2 ${
              isListening 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
            {isListening ? "Stop" : "Start"} Listening
          </Button>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex flex-wrap gap-4">
        <Badge 
          variant={isListening ? "default" : "secondary"}
          className="flex items-center gap-2"
        >
          <div className={`w-2 h-2 rounded-full ${isListening ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
          {isListening ? "Listening" : "Not Listening"}
        </Badge>
        
        <Badge 
          variant={isSpeaking ? "default" : "secondary"}
          className="flex items-center gap-2"
        >
          <div className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-blue-500 animate-pulse" : "bg-gray-400"}`} />
          {isSpeaking ? "Speaking" : "Not Speaking"}
        </Badge>

        <Badge 
          variant={isVoiceEnabled ? "default" : "secondary"}
          className="flex items-center gap-2"
        >
          <Volume2 className="w-4 h-4" />
          {isVoiceEnabled ? "Voice Enabled" : "Voice Disabled"}
        </Badge>
      </div>

      {/* Current Transcript */}
      {transcript && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Command className="w-5 h-5" />
              You Said
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{transcript}</p>
          </CardContent>
        </Card>
      )}

      {/* AI Response */}
      {aiResponse && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5" />
              AI Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-foreground">{aiResponse}</p>
              {isSpeaking && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stopAudio}
                  className="ml-4"
                >
                  <Pause className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voice Commands Reference */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Available Voice Commands
          </CardTitle>
          <CardDescription>
            Try saying these commands to control your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {voiceCommands.map((command) => (
              <div
                key={command.id}
                className="p-3 border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant="outline" 
                    className="text-xs capitalize"
                  >
                    {command.category}
                  </Badge>
                </div>
                <h4 className="font-medium text-foreground mb-1">
                  "{command.phrase}"
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {command.description}
                </p>
                <p className="text-xs text-primary">
                  Example: "{command.example}"
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
