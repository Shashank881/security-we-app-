import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const logs = db.accessLogs.findByUserId(userId)

    const stats = {
      totalAttempts: logs.length,
      successfulUnlocks: logs.filter((log) => log.success && log.attemptType === "code").length,
      failedAttempts: logs.filter((log) => !log.success).length,
      emergencyUses: logs.filter((log) => log.attemptType === "emergency").length,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
