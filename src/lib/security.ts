// In-memory store for Brute Force Protection on Login
// Note: This relies on the Node.js server memory.
// Restarting the server clears the memory, which is acceptable for most single-instance setups.

interface LoginAttemptRecord {
  attempts: number;
  lockUntil: number | null;
}

const loginAttempts = new Map<string, LoginAttemptRecord>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Checks if a user is currently locked out.
 * @param identifier The username or IP address
 * @returns { isLocked: boolean, remainingMs: number }
 */
export function checkLockout(identifier: string): { isLocked: boolean; remainingMs: number } {
  const record = loginAttempts.get(identifier);
  if (!record) return { isLocked: false, remainingMs: 0 };

  if (record.lockUntil && record.lockUntil > Date.now()) {
    return { isLocked: true, remainingMs: record.lockUntil - Date.now() };
  }

  // If lock time expired, we can reset it (handled in recordFailedLogin if they fail again, or reset on success)
  return { isLocked: false, remainingMs: 0 };
}

/**
 * Records a failed login attempt.
 * @param identifier The username or IP address
 * @returns The updated record
 */
export function recordFailedLogin(identifier: string): LoginAttemptRecord {
  const now = Date.now();
  let record = loginAttempts.get(identifier);

  if (!record) {
    record = { attempts: 1, lockUntil: null };
    loginAttempts.set(identifier, record);
    return record;
  }

  // If they were previously locked out but the time expired, reset attempts
  if (record.lockUntil && record.lockUntil <= now) {
    record.attempts = 1;
    record.lockUntil = null;
    return record;
  }

  // Increment attempts
  record.attempts += 1;

  // Check if they should be locked out
  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    record.lockUntil = now + LOCKOUT_DURATION_MS;
  }

  return record;
}

/**
 * Resets the login attempts for a given identifier on successful login.
 * @param identifier The username or IP address
 */
export function resetLoginAttempts(identifier: string): void {
  loginAttempts.delete(identifier);
}

// Cleanup function to prevent memory leaks over months of uptime
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of loginAttempts.entries()) {
    // If locked out time has passed by a lot, or they haven't reached max attempts and some time has passed
    if ((record.lockUntil && record.lockUntil < now) || (!record.lockUntil && record.attempts > 0)) {
       loginAttempts.delete(key);
    }
  }
}, 60 * 60 * 1000); // Run every hour
