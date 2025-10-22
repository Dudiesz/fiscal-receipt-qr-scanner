const SESSION_KEY = "qr_scanner_session_id"

export function getSessionId(): string {
  if (typeof window === "undefined") return ""

  let sessionId = localStorage.getItem(SESSION_KEY)

  if (!sessionId) {
    // Generate a unique session ID
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    localStorage.setItem(SESSION_KEY, sessionId)
  }

  return sessionId
}
