import { UserLoginRecord, UserRoleType } from '../types';

const ADMIN_PASSWORD_KEY = 'hasan_quran_admin_password_v1';
const ADMIN_SESSION_UNLOCKED_KEY = 'hasan_quran_admin_session_unlocked';
const USER_LOGIN_LOGS_KEY = 'hasan_quran_user_login_logs_v1';

// Default Master Password for Super Admin
export const DEFAULT_ADMIN_PASSWORD = 'Admin@HasanQuran786';

// Alternative initial acceptable master keys for authorized admin
const ACCEPTABLE_INITIAL_PASSWORDS = [
  'Admin@HasanQuran786',
  'HasanAdmin@786',
  'Admin@786',
  'admin786'
];

// In-memory fallback for non-browser environments or incognito restrictions
const memoryStorage: Record<string, string> = {};

const safeGetStorage = (storageType: 'local' | 'session', key: string): string | null => {
  try {
    if (typeof window !== 'undefined') {
      const storage = storageType === 'local' ? window.localStorage : window.sessionStorage;
      if (storage) return storage.getItem(key);
    }
  } catch {
    // Ignore storage errors
  }
  return memoryStorage[key] || null;
};

const safeSetStorage = (storageType: 'local' | 'session', key: string, value: string): void => {
  try {
    if (typeof window !== 'undefined') {
      const storage = storageType === 'local' ? window.localStorage : window.sessionStorage;
      if (storage) {
        storage.setItem(key, value);
        return;
      }
    }
  } catch {
    // Fall back to memory
  }
  memoryStorage[key] = value;
};

const safeRemoveStorage = (storageType: 'local' | 'session', key: string): void => {
  try {
    if (typeof window !== 'undefined') {
      const storage = storageType === 'local' ? window.localStorage : window.sessionStorage;
      if (storage) {
        storage.removeItem(key);
        return;
      }
    }
  } catch {
    // Fall back to memory
  }
  delete memoryStorage[key];
};

/**
 * Verify whether provided password matches current admin password
 */
export const verifyAdminPassword = (password: string): boolean => {
  const currentSaved = safeGetStorage('local', ADMIN_PASSWORD_KEY);
  if (currentSaved) {
    return password.trim() === currentSaved.trim();
  }
  return ACCEPTABLE_INITIAL_PASSWORDS.includes(password.trim());
};

/**
 * Update the admin security password
 */
export const updateAdminPassword = (newPassword: string): boolean => {
  if (!newPassword || newPassword.trim().length < 6) {
    return false;
  }
  safeSetStorage('local', ADMIN_PASSWORD_KEY, newPassword.trim());
  return true;
};

/**
 * Check if the admin panel has been unlocked in the current session
 */
export const isAdminSessionUnlocked = (): boolean => {
  return safeGetStorage('session', ADMIN_SESSION_UNLOCKED_KEY) === 'true';
};

/**
 * Mark the admin panel as unlocked for this browser session
 */
export const unlockAdminSession = (): void => {
  safeSetStorage('session', ADMIN_SESSION_UNLOCKED_KEY, 'true');
};

/**
 * Lock the admin panel
 */
export const lockAdminSession = (): void => {
  safeRemoveStorage('session', ADMIN_SESSION_UNLOCKED_KEY);
};

// Initial Seed Records for User Login Audit Log
const INITIAL_USER_LOGS: UserLoginRecord[] = [
  {
    id: 'log-seed-1',
    name: 'Muhammad Tariq',
    email: 'tariq.student@gmail.com',
    role: 'Student',
    purpose: 'Quran Recitation, Tajweed Practice & Hifz Revision',
    loginTimestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    loginDateFormatted: new Date(Date.now() - 3600000 * 2).toLocaleString(),
    authMethod: 'direct'
  },
  {
    id: 'log-seed-2',
    name: 'Qari Abdul Rahman',
    email: 'abdulrahman.qari@islamicseminary.org',
    role: 'Teacher',
    purpose: 'Conducting Online Tajweed Classes & Verifying Student Recitations',
    loginTimestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    loginDateFormatted: new Date(Date.now() - 3600000 * 5).toLocaleString(),
    authMethod: 'google'
  },
  {
    id: 'log-seed-3',
    name: 'Zainab Fatima',
    email: 'zainab.content@gmail.com',
    role: 'Content Creator',
    purpose: 'Publishing Daily Hadith Graphics & Islamic Educational Articles',
    loginTimestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    loginDateFormatted: new Date(Date.now() - 3600000 * 12).toLocaleString(),
    authMethod: 'direct'
  },
  {
    id: 'log-seed-4',
    name: 'Syed Bilal Ahmed',
    email: 'bilal.ahmed@yahoo.com',
    role: 'Other',
    purpose: 'Daily Prayer Timings, Azan Alerts & Qibla Compass Navigation',
    loginTimestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    loginDateFormatted: new Date(Date.now() - 3600000 * 24).toLocaleString(),
    authMethod: 'google'
  }
];

/**
 * Get all stored user login and role records
 */
export const getUserLoginRecords = (): UserLoginRecord[] => {
  try {
    const raw = safeGetStorage('local', USER_LOGIN_LOGS_KEY);
    if (!raw) {
      safeSetStorage('local', USER_LOGIN_LOGS_KEY, JSON.stringify(INITIAL_USER_LOGS));
      return INITIAL_USER_LOGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_USER_LOGS;
  } catch {
    return INITIAL_USER_LOGS;
  }
};

/**
 * Record a new user login with their selected role and purpose
 */
export const recordUserLogin = (
  name: string,
  role: UserRoleType,
  purpose: string,
  email: string = 'user@hasanquran.app',
  authMethod: 'google' | 'direct' = 'direct'
): UserLoginRecord => {
  const currentLogs = getUserLoginRecords();
  const now = new Date();

  const newRecord: UserLoginRecord = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: email.trim(),
    role,
    purpose: purpose.trim() || 'General Quran Recitation and Daily Deen Companion',
    loginTimestamp: now.toISOString(),
    loginDateFormatted: now.toLocaleString(),
    authMethod
  };

  const updated = [newRecord, ...currentLogs].slice(0, 100); // keep up to 100 recent records
  safeSetStorage('local', USER_LOGIN_LOGS_KEY, JSON.stringify(updated));

  // Dispatch custom event so any open Admin Panel updates live in real-time
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('hasan_quran_user_logged_in', { detail: newRecord }));
  }

  return newRecord;
};

/**
 * Clear user login records
 */
export const clearUserLoginRecords = (): void => {
  safeSetStorage('local', USER_LOGIN_LOGS_KEY, JSON.stringify([]));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('hasan_quran_user_logged_in'));
  }
};
