import { type NextRequest, NextResponse } from "next/server"
import { generateSecurityCode } from "@/lib/security-codes"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    // Get user settings
    const userSettings = db.settings.findByUserId(userId)
    const difficulty = userSettings?.lockDifficulty || "medium"
    const codeType = userSettings?.codeType || "math"

    // Generate new security code
    const code = generateSecurityCode(codeType, difficulty)

    // Update lock session with new code
    db.lockSessions.update(userId, {
      currentCode: code.answer,
      lastUnlockTime: new Date(),
    })

    return NextResponse.json({ success: true, code })
  } catch (error) {
    console.error("Error generating code:", error)
    return NextResponse.json({ success: false, error: "Failed to generate code" }, { status: 500 })
  }
}
