// Simple localStorage-based data management for student project
export interface SecuritySettings {
  difficulty: "easy" | "medium" | "hard"
  maxAttempts: number
  codeType: "math" | "puzzle"
}

export interface AccessAttempt {
  timestamp: string
  success: boolean
  isEmergency: boolean
}

// Default settings
const DEFAULT_SETTINGS: SecuritySettings = {
  difficulty: "easy",
  maxAttempts: 3,
  codeType: "math",
}

export class SimpleStorage {
  // Get security settings
  static getSettings(): SecuritySettings {
    if (typeof window === "undefined") return DEFAULT_SETTINGS

    const stored = localStorage.getItem("security-settings")
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS
  }

  // Save security settings
  static saveSettings(settings: SecuritySettings) {
    if (typeof window === "undefined") return
    localStorage.setItem("security-settings", JSON.stringify(settings))
  }

  // Get access history
  static getAccessHistory(): AccessAttempt[] {
    if (typeof window === "undefined") return []

    const stored = localStorage.getItem("access-history")
    return stored ? JSON.parse(stored) : []
  }

  // Add new access attempt
  static addAccessAttempt(attempt: AccessAttempt) {
    if (typeof window === "undefined") return

    const history = this.getAccessHistory()
    history.push(attempt)

    // Keep only last 50 attempts
    if (history.length > 50) {
      history.splice(0, history.length - 50)
    }

    localStorage.setItem("access-history", JSON.stringify(history))
  }

  // Get current lock state
  static getLockState() {
    if (typeof window === "undefined") return { isLocked: true, failedAttempts: 0 }

    const stored = localStorage.getItem("lock-state")
    return stored ? JSON.parse(stored) : { isLocked: true, failedAttempts: 0 }
  }

  // Save lock state
  static saveLockState(state: { isLocked: boolean; failedAttempts: number }) {
    if (typeof window === "undefined") return
    localStorage.setItem("lock-state", JSON.stringify(state))
  }
}
