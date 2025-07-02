"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Shield, Clock } from "lucide-react"
import { generateCode, checkAnswer, type SecurityCode } from "@/lib/code-generator"
import { SimpleStorage } from "@/lib/storage"

interface SimpleLockScreenProps {
  onUnlock: () => void
}

export function SimpleLockScreen({ onUnlock }: SimpleLockScreenProps) {
  // State management
  const [currentCode, setCurrentCode] = useState<SecurityCode | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [isEmergencyActive, setIsEmergencyActive] = useState(false)
  const [emergencyTimeLeft, setEmergencyTimeLeft] = useState(0)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Load settings and generate first code
  useEffect(() => {
    const settings = SimpleStorage.getSettings()
    const lockState = SimpleStorage.getLockState()
    setFailedAttempts(lockState.failedAttempts)
    generateNewCode()
  }, [])

  // Emergency timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isEmergencyActive && emergencyTimeLeft > 0) {
      timer = setInterval(() => {
        setEmergencyTimeLeft((prev) => {
          if (prev <= 1) {
            setIsEmergencyActive(false)
            setMessage("Emergency access expired. Please solve the security code.")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isEmergencyActive, emergencyTimeLeft])

  // Generate a new security code
  const generateNewCode = () => {
    const settings = SimpleStorage.getSettings()
    const newCode = generateCode(settings.codeType, settings.difficulty)
    setCurrentCode(newCode)
    setUserAnswer("")
    setMessage("")
  }

  // Handle code submission
  const handleSubmit = () => {
    if (!currentCode || !userAnswer.trim()) return

    setIsLoading(true)

    // Simulate processing time (for realism)
    setTimeout(() => {
      const isCorrect = checkAnswer(userAnswer, currentCode.answer)

      if (isCorrect) {
        // Success!
        setMessage("✅ Correct! Access granted.")
        setFailedAttempts(0)

        // Log successful attempt
        SimpleStorage.addAccessAttempt({
          timestamp: new Date().toISOString(),
          success: true,
          isEmergency: false,
        })

        // Save state and unlock
        SimpleStorage.saveLockState({ isLocked: false, failedAttempts: 0 })

        setTimeout(() => {
          onUnlock()
        }, 1500)
      } else {
        // Wrong answer
        const newFailedAttempts = failedAttempts + 1
        setFailedAttempts(newFailedAttempts)

        const settings = SimpleStorage.getSettings()
        const remainingAttempts = settings.maxAttempts - newFailedAttempts

        if (remainingAttempts > 0) {
          setMessage(`❌ Incorrect. ${remainingAttempts} attempts remaining.`)
          generateNewCode() // Generate new code for next attempt
        } else {
          setMessage("🔒 Too many failed attempts! Use emergency access or wait.")
        }

        // Log failed attempt
        SimpleStorage.addAccessAttempt({
          timestamp: new Date().toISOString(),
          success: false,
          isEmergency: false,
        })

        // Save state
        SimpleStorage.saveLockState({ isLocked: true, failedAttempts: newFailedAttempts })
      }

      setIsLoading(false)
    }, 800)
  }

  // Handle emergency access
  const handleEmergencyAccess = () => {
    setIsEmergencyActive(true)
    setEmergencyTimeLeft(120) // 2 minutes for demo (instead of 2 hours)
    setFailedAttempts(0)
    setMessage("🚨 Emergency access activated! You have 2 minutes.")

    // Log emergency access
    SimpleStorage.addAccessAttempt({
      timestamp: new Date().toISOString(),
      success: true,
      isEmergency: true,
    })

    // Unlock temporarily
    setTimeout(() => {
      onUnlock()
    }, 1500)
  }

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Get settings for display
  const settings = SimpleStorage.getSettings()
  const maxAttempts = settings.maxAttempts
  const isLocked = failedAttempts >= maxAttempts

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/90 border-slate-600 text-white">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-500/20 rounded-full w-fit">
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
          <CardTitle className="text-2xl">Security Lock</CardTitle>
          <p className="text-slate-300">Student Project Demo</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Emergency Timer */}
          {isEmergencyActive && (
            <Alert className="border-orange-500 bg-orange-500/10">
              <Clock className="h-4 w-4 text-orange-400" />
              <AlertDescription className="text-orange-200">
                Emergency Access: {formatTime(emergencyTimeLeft)} remaining
              </AlertDescription>
            </Alert>
          )}

          {/* Security Challenge */}
          {currentCode && !isEmergencyActive && (
            <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              <h3 className="font-semibold mb-2 text-blue-300">Security Challenge:</h3>
              <p className="text-lg mb-2">{currentCode.question}</p>
              <p className="text-xs text-slate-400">
                Type: {currentCode.type} | Difficulty: {settings.difficulty}
              </p>
            </div>
          )}

          {/* Answer Input */}
          {!isEmergencyActive && (
            <div className="space-y-3">
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer..."
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                onKeyDown={(e) => e.key === "Enter" && !isLoading && !isLocked && handleSubmit()}
                disabled={isLoading || isLocked}
              />

              <Button
                onClick={handleSubmit}
                disabled={isLoading || !userAnswer.trim() || isLocked}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "Checking..." : "Submit Answer"}
              </Button>
            </div>
          )}

          {/* Progress Bar */}
          {failedAttempts > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Failed Attempts</span>
                <span className="text-slate-300">
                  {failedAttempts}/{maxAttempts}
                </span>
              </div>
              <Progress value={(failedAttempts / maxAttempts) * 100} className="bg-slate-700" />
            </div>
          )}

          {/* Status Message */}
          {message && (
            <Alert
              className={`border-slate-600 ${
                message.includes("✅")
                  ? "bg-green-500/10 text-green-200"
                  : message.includes("❌")
                    ? "bg-red-500/10 text-red-200"
                    : message.includes("🚨")
                      ? "bg-orange-500/10 text-orange-200"
                      : "bg-slate-500/10 text-slate-200"
              }`}
            >
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {/* Emergency Access Button */}
          {!isEmergencyActive && (
            <div className="pt-4 border-t border-slate-600">
              <Button
                onClick={handleEmergencyAccess}
                variant="outline"
                className="w-full border-orange-500 text-orange-400 hover:bg-orange-500/10 bg-transparent"
                disabled={isEmergencyActive}
              >
                <Clock className="w-4 h-4 mr-2" />
                Emergency Access (2 min demo)
              </Button>
              <p className="text-xs text-slate-500 text-center mt-2">For demonstration - normally 2 hours</p>
            </div>
          )}

          {/* Educational Info */}
          <div className="text-xs text-slate-400 text-center space-y-1">
            <p>💡 This is a student project demonstration</p>
            <p>🔧 Check the admin panel to change settings</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
