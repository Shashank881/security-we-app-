"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Shield, Clock, AlertTriangle, Unlock } from "lucide-react"

interface LockScreenProps {
  userId: string
  onUnlock: () => void
}

export function LockScreen({ userId, onUnlock }: LockScreenProps) {
  const [isLocked, setIsLocked] = useState(true)
  const [currentCode, setCurrentCode] = useState<any>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [emergencyActive, setEmergencyActive] = useState(false)
  const [emergencyTimeLeft, setEmergencyTimeLeft] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [maxAttempts, setMaxAttempts] = useState(3)

  useEffect(() => {
    if (isLocked && !emergencyActive) {
      generateNewCode()
    }
  }, [isLocked, emergencyActive])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (emergencyActive && emergencyTimeLeft > 0) {
      interval = setInterval(() => {
        setEmergencyTimeLeft((prev) => {
          if (prev <= 1) {
            setEmergencyActive(false)
            setIsLocked(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [emergencyActive, emergencyTimeLeft])

  const generateNewCode = async () => {
    try {
      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await response.json()
      setCurrentCode(data.code)
    } catch (error) {
      console.error("Failed to generate code:", error)
    }
  }

  const handleSubmitCode = async () => {
    if (!userAnswer.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          answer: userAnswer,
          currentCode: currentCode?.answer,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsLocked(false)
        setFailedAttempts(0)
        onUnlock()
      } else {
        const newFailedAttempts = failedAttempts + 1
        setFailedAttempts(newFailedAttempts)
        setError(`Incorrect answer. ${maxAttempts - newFailedAttempts} attempts remaining.`)

        if (newFailedAttempts >= maxAttempts) {
          setError("Too many failed attempts. Device locked.")
          // In a real app, this would trigger additional security measures
        } else {
          generateNewCode()
        }
      }
    } catch (error) {
      setError("Failed to verify code. Please try again.")
    } finally {
      setIsLoading(false)
      setUserAnswer("")
    }
  }

  const handleEmergencyAccess = async () => {
    try {
      const response = await fetch("/api/emergency-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (data.success) {
        setEmergencyActive(true)
        setEmergencyTimeLeft(data.duration * 3600) // Convert hours to seconds
        setIsLocked(false)
        setFailedAttempts(0)
        onUnlock()
      }
    } catch (error) {
      setError("Emergency access failed. Please try again.")
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (!isLocked && emergencyActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-orange-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="text-orange-800">Emergency Access Active</CardTitle>
            <CardDescription>Temporary access granted. Time remaining:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-3xl font-mono font-bold text-orange-700 mb-2">{formatTime(emergencyTimeLeft)}</div>
              <Progress value={(emergencyTimeLeft / (2 * 3600)) * 100} className="w-full" />
            </div>
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                Security lock will automatically re-engage when time expires.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isLocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-green-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
              <Unlock className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-800">Device Unlocked</CardTitle>
            <CardDescription>Access granted. Device is now available for use.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-600 bg-slate-800/50 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-white">Security Lock Active</CardTitle>
          <CardDescription className="text-slate-300">Solve the security code to access your device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentCode && (
            <div className="p-4 bg-slate-700 rounded-lg">
              <p className="text-white font-medium mb-2">Security Challenge:</p>
              <p className="text-slate-200 text-lg">{currentCode.question}</p>
              <p className="text-xs text-slate-400 mt-2">Type: {currentCode.type}</p>
            </div>
          )}

          <div className="space-y-2">
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              onKeyDown={(e) => e.key === "Enter" && handleSubmitCode()}
              disabled={isLoading || failedAttempts >= maxAttempts}
            />
            <Button
              onClick={handleSubmitCode}
              disabled={isLoading || !userAnswer.trim() || failedAttempts >= maxAttempts}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Verifying..." : "Unlock Device"}
            </Button>
          </div>

          {error && (
            <Alert className="border-red-500 bg-red-500/10">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {failedAttempts > 0 && failedAttempts < maxAttempts && (
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                Failed attempts: {failedAttempts}/{maxAttempts}
              </p>
              <Progress value={(failedAttempts / maxAttempts) * 100} className="mt-2" />
            </div>
          )}

          <div className="pt-4 border-t border-slate-600">
            <Button
              onClick={handleEmergencyAccess}
              variant="outline"
              className="w-full border-orange-500 text-orange-400 hover:bg-orange-500/10 bg-transparent"
              disabled={emergencyActive || failedAttempts >= maxAttempts}
            >
              <Clock className="w-4 h-4 mr-2" />
              Emergency Access (2 hours)
            </Button>
            <p className="text-xs text-slate-500 text-center mt-2">One-time use per unlock session</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
