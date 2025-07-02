import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const settings = db.settings.findByUserId(userId)
    if (!settings) {
      // Create default settings
      const defaultSettings = {
        userId,
        lockDifficulty: "medium" as const,
        maxFailedAttempts: 3,
        emergencyDuration: 2,
        codeType: "math" as const,
        updatedAt: new Date(),
      }
      const newSettings = db.settings.create(defaultSettings)
      return NextResponse.json(newSettings)
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { userId, ...updates } = data

    const settings = db.settings.findByUserId(userId)
    if (!settings) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 })
    }

    const updatedSettings = db.settings.update(settings.id, {
      ...updates,
      updatedAt: new Date(),
    })

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
