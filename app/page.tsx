"use client"

import { useState } from "react"
import { SimpleLockScreen } from "@/components/simple-lock-screen"
import { SimpleAdmin } from "@/components/simple-admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Settings, Smartphone, BookOpen, Code, Users } from "lucide-react"

export default function StudentSecurityProject() {
  const [currentView, setCurrentView] = useState<"home" | "lock" | "admin">("home")
  const [isUnlocked, setIsUnlocked] = useState(false)

  const handleUnlock = () => {
    setIsUnlocked(true)
    // Auto return to home after 3 seconds
    setTimeout(() => {
      setCurrentView("home")
      setIsUnlocked(false)
    }, 3000)
  }

  const handleLock = () => {
    setIsUnlocked(false)
    setCurrentView("lock")
  }

  // Show lock screen
  if (currentView === "lock") {
    return <SimpleLockScreen onUnlock={handleUnlock} />
  }

  // Show admin panel
  if (currentView === "admin") {
    return <SimpleAdmin onBack={() => setCurrentView("home")} />
  }

  // Show success message
  if (isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Access Granted! 🎉</h2>
            <p className="text-green-600">Device unlocked successfully</p>
            <p className="text-sm text-gray-500 mt-4">Returning to home screen...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main home screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SecureLock Student Project</h1>
                <p className="text-sm text-gray-600">Mobile Security System Demo</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Student Project
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple Security Lock System</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A student-friendly project demonstrating mobile security concepts with dynamic code generation and emergency
            access features.
          </p>
        </div>

        {/* Demo Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button onClick={handleLock} size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg">
            <Smartphone className="w-5 h-5 mr-2" />
            Try Lock Screen
          </Button>
          <Button onClick={() => setCurrentView("admin")} size="lg" variant="outline" className="px-8 py-4 text-lg">
            <Settings className="w-5 h-5 mr-2" />
            Admin Panel
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="w-5 h-5 mr-2 text-blue-600" />
                Dynamic Codes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Math problems & logic puzzles</li>
                <li>• Adjustable difficulty levels</li>
                <li>• New code each attempt</li>
                <li>• Configurable attempt limits</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                Emergency Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• 2-minute demo access</li>
                <li>• One-time use per session</li>
                <li>• Automatic timer countdown</li>
                <li>• Activity logging</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Admin Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Settings configuration</li>
                <li>• Access history tracking</li>
                <li>• Usage statistics</li>
                <li>• Data management</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Educational Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Educational Value
            </CardTitle>
            <CardDescription>What students learn from this project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3 text-blue-700">Frontend Skills</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• React hooks (useState, useEffect)</li>
                  <li>• Component state management</li>
                  <li>• Form handling and validation</li>
                  <li>• Conditional rendering</li>
                  <li>• Timer and countdown logic</li>
                  <li>• LocalStorage for persistence</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-green-700">Security Concepts</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Authentication mechanisms</li>
                  <li>• Access control systems</li>
                  <li>• Emergency access protocols</li>
                  <li>• Activity logging and monitoring</li>
                  <li>• User session management</li>
                  <li>• Security vs. usability balance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle>🛠️ Technical Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Frontend</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Next.js & React</li>
                  <li>• Tailwind CSS</li>
                  <li>• shadcn/ui components</li>
                  <li>• TypeScript</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Data Storage</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Browser LocalStorage</li>
                  <li>• JSON data format</li>
                  <li>• Client-side persistence</li>
                  <li>• Simple data management</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Features</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Code generation algorithms</li>
                  <li>• Timer functionality</li>
                  <li>• Settings management</li>
                  <li>• Activity tracking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm mt-12">
          <p>📚 Student Security Lock Project - Built for Learning</p>
          <p className="mt-1">Perfect for computer science coursework and portfolio projects</p>
        </footer>
      </main>
    </div>
  )
}
