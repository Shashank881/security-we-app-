import { type NextRequest, NextResponse } from "next/server"
import { validateAnswer } from "@/lib/security-codes"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { userId, answer, currentCode } = await request.json()

    const isCorrect = validateAnswer(answer, currentCode)

    // Log the access attempt
    db.accessLogs.create({
      userId,
      timestamp: new Date(),
      success: isCorrect,
      attemptType: "code",
      failedAttempts: isCorrect ? 0 : 1,
    })

    if (isCorrect) {
      // Reset lock session
      db.lockSessions.update(userId, {
        isLocked: false,
        failedAttempts: 0,
        emergencyAccessActive: false,
        lastUnlockTime: new Date(),
      })
    }

    return NextResponse.json({ success: isCorrect })
  } catch (error) {
    console.error("Error verifying code:", error)
    return NextResponse.json({ success: false, error: "Failed to verify code" }, { status: 500 })
  }
}
