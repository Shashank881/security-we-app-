export interface User {
  id: string
  email: string
  passwordHash: string
  createdAt: Date
}

export interface SecuritySettings {
  id: string
  userId: string
  lockDifficulty: "easy" | "medium" | "hard"
  maxFailedAttempts: number
  emergencyDuration: number // in hours
  codeType: "math" | "puzzle" | "logic"
  updatedAt: Date
}

export interface AccessLog {
  id: string
  userId: string
  timestamp: Date
  success: boolean
  attemptType: "code" | "emergency"
  failedAttempts?: number
  emergencyUsed?: boolean
}

export interface LockSession {
  id: string
  userId: string
  isLocked: boolean
  emergencyAccessActive: boolean
  emergencyStartTime?: Date
  failedAttempts: number
  currentCode?: string
  lastUnlockTime: Date
}

// Mock database - in production, use MongoDB or PostgreSQL
const users: User[] = []
const settings: SecuritySettings[] = []
const accessLogs: AccessLog[] = []
const lockSessions: LockSession[] = []

export const db = {
  users: {
    create: (user: Omit<User, "id">) => {
      const newUser = { ...user, id: Math.random().toString(36) }
      users.push(newUser)
      return newUser
    },
    findByEmail: (email: string) => users.find((u) => u.email === email),
    findById: (id: string) => users.find((u) => u.id === id),
  },
  settings: {
    create: (setting: Omit<SecuritySettings, "id">) => {
      const newSetting = { ...setting, id: Math.random().toString(36) }
      settings.push(newSetting)
      return newSetting
    },
    findByUserId: (userId: string) => settings.find((s) => s.userId === userId),
    update: (id: string, updates: Partial<SecuritySettings>) => {
      const index = settings.findIndex((s) => s.id === id)
      if (index !== -1) {
        settings[index] = { ...settings[index], ...updates }
        return settings[index]
      }
      return null
    },
  },
  accessLogs: {
    create: (log: Omit<AccessLog, "id">) => {
      const newLog = { ...log, id: Math.random().toString(36) }
      accessLogs.push(newLog)
      return newLog
    },
    findByUserId: (userId: string) => accessLogs.filter((l) => l.userId === userId),
  },
  lockSessions: {
    create: (session: Omit<LockSession, "id">) => {
      const newSession = { ...session, id: Math.random().toString(36) }
      lockSessions.push(newSession)
      return newSession
    },
    findByUserId: (userId: string) => lockSessions.find((s) => s.userId === userId),
    update: (userId: string, updates: Partial<LockSession>) => {
      const index = lockSessions.findIndex((s) => s.userId === userId)
      if (index !== -1) {
        lockSessions[index] = { ...lockSessions[index], ...updates }
        return lockSessions[index]
      }
      return null
    },
  },
}
