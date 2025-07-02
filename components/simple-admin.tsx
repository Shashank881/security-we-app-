"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Settings, Activity, BarChart3, RefreshCw } from "lucide-react"
import { SimpleStorage, type SecuritySettings, type AccessAttempt } from "@/lib/storage"

interface SimpleAdminProps {
  onBack: () => void
}

export function SimpleAdmin({ onBack }: SimpleAdminProps) {
  const [settings, setSettings] = useState<SecuritySettings>({
    difficulty: "easy",
    maxAttempts: 3,
    codeType: "math",
  })
  const [accessHistory, setAccessHistory] = useState<AccessAttempt[]>([])
  const [stats, setStats] = useState({
    totalAttempts: 0,
    successfulAttempts: 0,
    failedAttempts: 0,
    emergencyUses: 0,
  })

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    // Load settings
    const currentSettings = SimpleStorage.getSettings()
    setSettings(currentSettings)

    // Load access history
    const history = SimpleStorage.getAccessHistory()
    setAccessHistory(history)

    // Calculate stats
    const totalAttempts = history.length
    const successfulAttempts = history.filter((a) => a.success && !a.isEmergency).length
    const failedAttempts = history.filter((a) => !a.success).length
    const emergencyUses = history.filter((a) => a.isEmergency).length

    setStats({
      totalAttempts,
      successfulAttempts,
      failedAttempts,
      emergencyUses,
    })
  }

  // Save settings
  const handleSaveSettings = () => {
    SimpleStorage.saveSettings(settings)
    alert("Settings saved successfully! 🎉")
  }

  // Clear all data
  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      localStorage.removeItem("access-history")
      localStorage.removeItem("lock-state")
      loadData()
      alert("All data cleared! 🗑️")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600">Student Security Lock Project</p>
          </div>
          <Button onClick={onBack} variant="outline">
            ← Back to Demo
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.totalAttempts}</p>
              <p className="text-sm text-gray-600">Total Attempts</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.successfulAttempts}</p>
              <p className="text-sm text-gray-600">Successful</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-red-600 font-bold">✗</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.failedAttempts}</p>
              <p className="text-sm text-gray-600">Failed</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-orange-600 font-bold">🚨</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.emergencyUses}</p>
              <p className="text-sm text-gray-600">Emergency</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <Select
                  value={settings.difficulty}
                  onValueChange={(value: "easy" | "medium" | "hard") => setSettings({ ...settings, difficulty: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy (Simple math)</SelectItem>
                    <SelectItem value="medium">Medium (Harder problems)</SelectItem>
                    <SelectItem value="hard">Hard (Complex puzzles)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Code Type</Label>
                <Select
                  value={settings.codeType}
                  onValueChange={(value: "math" | "puzzle") => setSettings({ ...settings, codeType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Math Problems</SelectItem>
                    <SelectItem value="puzzle">Logic Puzzles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Max Failed Attempts</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.maxAttempts}
                  onChange={(e) => setSettings({ ...settings, maxAttempts: Number.parseInt(e.target.value) || 3 })}
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSaveSettings} className="flex-1">
                  Save Settings
                </Button>
                <Button onClick={loadData} variant="outline">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Access History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </div>
                <Button onClick={handleClearData} variant="outline" size="sm">
                  Clear Data
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {accessHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No activity yet. Try using the lock screen!</p>
                ) : (
                  accessHistory
                    .slice()
                    .reverse()
                    .slice(0, 10)
                    .map((attempt, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              attempt.isEmergency ? "bg-orange-500" : attempt.success ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          <div>
                            <p className="font-medium text-sm">
                              {attempt.isEmergency
                                ? "Emergency Access"
                                : attempt.success
                                  ? "Successful Unlock"
                                  : "Failed Attempt"}
                            </p>
                            <p className="text-xs text-gray-500">{new Date(attempt.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <Badge variant={attempt.isEmergency ? "default" : attempt.success ? "default" : "destructive"}>
                          {attempt.isEmergency ? "Emergency" : attempt.success ? "Success" : "Failed"}
                        </Badge>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Educational Notes */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📚 Student Project Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">🎯 Learning Objectives</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• React state management</li>
                  <li>• LocalStorage for data persistence</li>
                  <li>• Component communication</li>
                  <li>• Form handling and validation</li>
                  <li>• Timer and countdown functionality</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🔧 Technical Features</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Dynamic code generation</li>
                  <li>• Emergency access system</li>
                  <li>• Settings persistence</li>
                  <li>• Activity logging</li>
                  <li>• Responsive design</li>
                </ul>
              </div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Extension Ideas:</strong> Add biometric simulation, scheduled locks, email notifications, or
                integrate with a real database!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
