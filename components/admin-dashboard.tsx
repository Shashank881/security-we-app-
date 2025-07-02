"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Settings, Activity, Shield, Clock, AlertCircle, CheckCircle } from "lucide-react"

interface AdminDashboardProps {
  userId: string
}

export function AdminDashboard({ userId }: AdminDashboardProps) {
  const [settings, setSettings] = useState<any>(null)
  const [accessLogs, setAccessLogs] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [userId])

  const loadDashboardData = async () => {
    try {
      const [settingsRes, logsRes, statsRes] = await Promise.all([
        fetch(`/api/settings?userId=${userId}`),
        fetch(`/api/access-logs?userId=${userId}`),
        fetch(`/api/stats?userId=${userId}`),
      ])

      const [settingsData, logsData, statsData] = await Promise.all([
        settingsRes.json(),
        logsRes.json(),
        statsRes.json(),
      ])

      setSettings(settingsData)
      setAccessLogs(logsData)
      setStats(statsData)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (newSettings: any) => {
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...newSettings }),
      })

      if (response.ok) {
        setSettings(newSettings)
      }
    } catch (error) {
      console.error("Failed to update settings:", error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Lock Admin Panel</h1>
          <p className="text-gray-600">Manage your mobile security settings and monitor access</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAttempts || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Successful Unlocks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.successfulUnlocks || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="w-8 h-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed Attempts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.failedAttempts || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Emergency Uses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.emergencyUses || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="logs">Access Logs</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Security Configuration
                </CardTitle>
                <CardDescription>Customize your security lock behavior and difficulty</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Lock Difficulty</Label>
                    <Select
                      value={settings?.lockDifficulty || "medium"}
                      onValueChange={(value) => updateSettings({ ...settings, lockDifficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="codeType">Code Type</Label>
                    <Select
                      value={settings?.codeType || "math"}
                      onValueChange={(value) => updateSettings({ ...settings, codeType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select code type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">Math Problems</SelectItem>
                        <SelectItem value="puzzle">Logic Puzzles</SelectItem>
                        <SelectItem value="logic">Logic Questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">Max Failed Attempts</Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      min="1"
                      max="10"
                      value={settings?.maxFailedAttempts || 3}
                      onChange={(e) =>
                        updateSettings({
                          ...settings,
                          maxFailedAttempts: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyDuration">Emergency Access Duration (hours)</Label>
                    <Input
                      id="emergencyDuration"
                      type="number"
                      min="1"
                      max="24"
                      value={settings?.emergencyDuration || 2}
                      onChange={(e) =>
                        updateSettings({
                          ...settings,
                          emergencyDuration: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <Button onClick={() => updateSettings(settings)} className="w-full">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Access Logs
                </CardTitle>
                <CardDescription>Monitor all access attempts and security events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accessLogs.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No access logs found</p>
                  ) : (
                    accessLogs.slice(0, 20).map((log, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          {log.attemptType === "emergency" ? (
                            <Clock className="w-5 h-5 text-orange-500" />
                          ) : log.success ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          )}
                          <div>
                            <p className="font-medium">
                              {log.attemptType === "emergency"
                                ? "Emergency Access"
                                : log.success
                                  ? "Successful Unlock"
                                  : "Failed Attempt"}
                            </p>
                            <p className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              log.attemptType === "emergency" ? "default" : log.success ? "default" : "destructive"
                            }
                          >
                            {log.attemptType === "emergency" ? "Emergency" : log.success ? "Success" : "Failed"}
                          </Badge>
                          {log.failedAttempts && <Badge variant="outline">{log.failedAttempts} attempts</Badge>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Lock Status</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Current Difficulty</span>
                      <Badge variant="outline">{settings?.lockDifficulty || "Medium"}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Code Type</span>
                      <Badge variant="outline">{settings?.codeType || "Math"}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Max Attempts</span>
                      <Badge variant="outline">{settings?.maxFailedAttempts || 3}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {accessLogs.slice(0, 5).map((log, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        {log.success ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{log.success ? "Successful unlock" : "Failed attempt"}</p>
                          <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
