import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    // Check if emergency access is already active
    const lockSession = db.lockSessions.findByUserId(userId)
    if (lockSession?.emergencyAccessActive) {
      return NextResponse.json({ success: false, error: "Emergency access already active" })
    }

    // Get user settings for emergency duration
    const userSettings = db.settings.findByUserId(userId)
    const duration = userSettings?.emergencyDuration || 2

    // Activate emergency access
    db.lockSessions.update(userId, {
      isLocked: false,
      emergencyAccessActive: true,
      emergencyStartTime: new Date(),
      failedAttempts: 0,
    })

    // Log emergency access
    db.accessLogs.create({
      userId,
      timestamp: new Date(),
      success: true,
      attemptType: "emergency",
      emergencyUsed: true,
    })

    return NextResponse.json({ success: true, duration })
  } catch (error) {
    console.error("Error activating emergency access:", error)
    return NextResponse.json({ success: false, error: "Failed to activate emergency access" }, { status: 500 })
  }
}
