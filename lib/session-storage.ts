// Session-based storage for tracking scans in the current session only
// This resets when the user closes the browser or starts a new session

const SESSION_KEY = "fiscalflow_session_scans"

export interface SessionScan {
  accessKey: string
  timestamp: string
}

// Get all scans from the current session
export function getSessionScans(): SessionScan[] {
  if (typeof window === "undefined") return []

  const data = sessionStorage.getItem(SESSION_KEY)
  if (!data) return []

  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

// Add a scan to the current session
export function addSessionScan(accessKey: string): void {
  if (typeof window === "undefined") return

  const scans = getSessionScans()

  // Check if already exists in session
  if (scans.some((scan) => scan.accessKey === accessKey)) {
    return
  }

  scans.push({
    accessKey,
    timestamp: new Date().toISOString(),
  })

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(scans))
}

// Get count of scans in current session
export function getSessionScanCount(): number {
  return getSessionScans().length
}

// Clear session scans (optional, happens automatically on new session)
export function clearSessionScans(): void {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(SESSION_KEY)
}
