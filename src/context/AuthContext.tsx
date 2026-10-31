import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleUserProfile, UserRoleType } from '../types';
import { recordUserLogin } from '../utils/adminSecurity';

interface AuthContextType {
  user: GoogleUserProfile | null;
  isAuthenticated: boolean;
  isConfigured: boolean;
  clientId: string;
  isLoading: boolean;
  authError: string | null;
  setClientId: (id: string) => void;
  setAuthError: (err: string | null) => void;
  loginWithGoogleCredential: (credentialJwt: string, selectedRole?: UserRoleType, purpose?: string) => Promise<boolean>;
  loginWithRole: (name: string, role: UserRoleType, purpose: string, email?: string) => Promise<boolean>;
  logout: () => void;
  loginAsDemoUser: (role: 'admin' | 'member', userRole?: UserRoleType, purpose?: string) => void;
  updateUserPreferences: (prefs: Partial<GoogleUserProfile['preferences']>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ADMIN_EMAILS = [
  'alihusnain03221704751@gmail.com',
  'admin@noorislamic.app'
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GoogleUserProfile | null>(null);
  const [clientId, setClientIdState] = useState<string>(() => {
    return (
      (import.meta as unknown as { env: Record<string, string> }).env?.VITE_GOOGLE_CLIENT_ID ||
      localStorage.getItem('noor_google_client_id') ||
      ''
    );
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Load existing session on boot
  useEffect(() => {
    try {
      const stored = localStorage.getItem('noor_auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email && parsed.id) {
          setUser(parsed);
        }
      }
    } catch {
      localStorage.removeItem('noor_auth_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setClientId = (id: string) => {
    const trimmed = id.trim();
    setClientIdState(trimmed);
    if (trimmed) {
      localStorage.setItem('noor_google_client_id', trimmed);
    } else {
      localStorage.removeItem('noor_google_client_id');
    }
  };

  // Decode standard Google Identity Services JWT payload safely
  const parseGoogleJwt = (token: string): Record<string, unknown> | null => {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error('Failed to parse Google JWT', err);
      return null;
    }
  };

  const defaultPreferences = {
    city: 'Lahore',
    calculationMethod: 'Karachi' as const,
    juristicMethod: 'Hanafi' as const,
    azanSound: 'makkah' as const,
    prayerAlerts: {
      Fajr: true,
      Zuhr: true,
      Asr: true,
      Maghrib: true,
      Isha: true
    },
    arabicFontSize: 28,
    urduFontSize: 19,
    quranReadingTheme: 'light' as const
  };

  const loginWithGoogleCredential = async (
    credentialJwt: string,
    selectedRole: UserRoleType = 'Student',
    purpose: string = 'Quran Recitation & Learning'
  ): Promise<boolean> => {
    try {
      setAuthError(null);
      const payload = parseGoogleJwt(credentialJwt);
      if (!payload || !payload.email || !payload.sub) {
        setAuthError('Invalid Google credential token received.');
        return false;
      }

      const email = String(payload.email);
      const name = String(payload.name || email.split('@')[0]);
      const picture = payload.picture ? String(payload.picture) : undefined;
      const sub = String(payload.sub);
      const emailVerified = Boolean(payload.email_verified);

      const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());

      // Save user login, role, timestamp and purpose to Admin audit log
      recordUserLogin(name, selectedRole, purpose, email, 'google');

      const newUser: GoogleUserProfile = {
        id: sub,
        name,
        email,
        picture,
        role: isAdmin ? 'admin' : 'member',
        userRole: selectedRole,
        loginPurpose: purpose,
        lastLoginAt: new Date().toISOString(),
        emailVerified,
        joinedDate: new Date().toISOString(),
        authProvider: 'google',
        preferences: user?.preferences || defaultPreferences
      };

      setUser(newUser);
      localStorage.setItem('noor_auth_user', JSON.stringify(newUser));
      return true;
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Authentication failed.');
      return false;
    }
  };

  const loginWithRole = async (
    name: string,
    role: UserRoleType,
    purpose: string,
    email?: string
  ): Promise<boolean> => {
    try {
      setAuthError(null);
      const trimmedName = name.trim() || 'Muslim User';
      const cleanEmail = email?.trim() || `${trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user'}@hasanquran.app`;
      const isAdmin = ADMIN_EMAILS.includes(cleanEmail.toLowerCase());

      // Record in Admin audit logs
      recordUserLogin(trimmedName, role, purpose, cleanEmail, 'direct');

      const newUser: GoogleUserProfile = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: trimmedName,
        email: cleanEmail,
        picture: undefined,
        role: isAdmin ? 'admin' : 'member',
        userRole: role,
        loginPurpose: purpose,
        lastLoginAt: new Date().toISOString(),
        emailVerified: true,
        joinedDate: new Date().toISOString(),
        authProvider: 'google',
        preferences: user?.preferences || defaultPreferences
      };

      setUser(newUser);
      localStorage.setItem('noor_auth_user', JSON.stringify(newUser));
      return true;
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Login failed.');
      return false;
    }
  };

  const loginAsDemoUser = (
    role: 'admin' | 'member',
    userRole: UserRoleType = role === 'admin' ? 'Teacher' : 'Student',
    purpose: string = role === 'admin' ? 'Administrative Maintenance & Moderation' : 'Daily Quran Study & Reading'
  ) => {
    const isAdmin = role === 'admin';
    const name = isAdmin ? 'Ali Husnain (Super Admin)' : 'Muhammad Tariq';
    const email = isAdmin ? 'alihusnain03221704751@gmail.com' : 'tariq.student@noorislamic.app';

    // Record login for admin visibility
    recordUserLogin(name, userRole, purpose, email, 'direct');

    const demoUser: GoogleUserProfile = {
      id: isAdmin ? 'owner-ali-husnain' : 'member-talib-ilm',
      name,
      email,
      picture: undefined,
      role: isAdmin ? 'admin' : 'member',
      userRole,
      loginPurpose: purpose,
      lastLoginAt: new Date().toISOString(),
      emailVerified: true,
      joinedDate: new Date().toISOString(),
      authProvider: 'google',
      preferences: user?.preferences || defaultPreferences
    };
    setUser(demoUser);
    localStorage.setItem('noor_auth_user', JSON.stringify(demoUser));
  };

  const logout = () => {
    // If google identity services has revoke
    const googleObj = (window as unknown as { google?: { accounts?: { id?: { disableAutoSelect?: () => void } } } }).google;
    if (googleObj?.accounts?.id?.disableAutoSelect) {
      googleObj.accounts.id.disableAutoSelect();
    }
    setUser(null);
    localStorage.removeItem('noor_auth_user');
  };

  const updateUserPreferences = (prefs: Partial<GoogleUserProfile['preferences']>) => {
    if (!user) return;
    const updated: GoogleUserProfile = {
      ...user,
      preferences: {
        ...user.preferences,
        ...prefs
      }
    };
    setUser(updated);
    localStorage.setItem('noor_auth_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isConfigured: Boolean(clientId),
        clientId,
        isLoading,
        authError,
        setClientId,
        setAuthError,
        loginWithGoogleCredential,
        loginWithRole,
        loginAsDemoUser,
        logout,
        updateUserPreferences
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
