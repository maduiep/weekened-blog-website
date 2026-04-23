import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

// ─── Seeded accounts (demo) ──────────────────────────────────────────────────
const SEED_USERS = [
  {
    uid: 'admin-001',
    name: 'Weekend Post Admin',
    email: 'admin@weekendpost.co.bw',
    password: 'Admin@1234',
    isAdmin: true,
    isSubscribed: true,
    subscriptionPlan: 'annual',
    subscriptionExpiry: '2027-12-31',
    createdAt: '2024-01-01T00:00:00Z',
    avatar: 'A',
  },
];

const STORAGE_KEY = 'wp_users';
const SESSION_KEY = 'wp_session';

function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      // Always ensure seed admin is present (guards against stale localStorage)
      const hasSeedAdmin = stored.some(u => u.uid === 'admin-001');
      if (!hasSeedAdmin) {
        const merged = [SEED_USERS[0], ...stored];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
      return stored;
    }
  } catch (_) {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_USERS));
  return SEED_USERS;
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

function saveSession(user) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = loadSession();
    if (session) {
      // Re-hydrate from users store to get latest subscription status
      const users = loadUsers();
      const fresh = users.find(u => u.uid === session.uid);
      if (fresh) {
        const { password: _, ...safe } = fresh;
        setUser(safe);
      }
    }
    setLoading(false);
  }, []);

  // ── login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const users = loadUsers();
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) throw new Error('Invalid email or password.');
    const { password: _, ...safe } = found;
    setUser(safe);
    saveSession(safe);
    return safe;
  }, []);

  // ── signup ─────────────────────────────────────────────────────────────────
  const signup = useCallback(async (name, email, password) => {
    const users = loadUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      uid: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      isAdmin: false,
      isSubscribed: false,
      subscriptionPlan: null,
      subscriptionExpiry: null,
      createdAt: new Date().toISOString(),
      avatar: name.trim().charAt(0).toUpperCase(),
    };
    const updated = [...users, newUser];
    saveUsers(updated);
    const { password: _, ...safe } = newUser;
    setUser(safe);
    saveSession(safe);
    return safe;
  }, []);

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    saveSession(null);
  }, []);

  // ── grantSubscription ──────────────────────────────────────────────────────
  const grantSubscription = useCallback((planId) => {
    if (!user) return;
    const users = loadUsers();
    const idx = users.findIndex(u => u.uid === user.uid);
    if (idx === -1) return;

    const expiryMap = { weekly: 7, monthly: 30, annual: 365 };
    const days = expiryMap[planId] || 30;
    const expiry = new Date(Date.now() + days * 86400000).toISOString();

    users[idx] = { ...users[idx], isSubscribed: true, subscriptionPlan: planId, subscriptionExpiry: expiry };
    saveUsers(users);

    const { password: _, ...safe } = users[idx];
    setUser(safe);
    saveSession(safe);
  }, [user]);

  // ── revokeSubscription (admin) ─────────────────────────────────────────────
  const revokeSubscription = useCallback((uid) => {
    const users = loadUsers();
    const idx = users.findIndex(u => u.uid === uid);
    if (idx === -1) return;
    users[idx] = { ...users[idx], isSubscribed: false, subscriptionPlan: null, subscriptionExpiry: null };
    saveUsers(users);
    // If admin revokes their own, update session
    if (user?.uid === uid) {
      const { password: _, ...safe } = users[idx];
      setUser(safe);
      saveSession(safe);
    }
  }, [user]);

  // ── getAllUsers (admin only) ────────────────────────────────────────────────
  const getAllUsers = useCallback(() => {
    return loadUsers().map(({ password: _, ...safe }) => safe);
  }, []);

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    isSubscribed: user?.isSubscribed ?? false,
    isAdmin: user?.isAdmin ?? false,
    login,
    signup,
    logout,
    grantSubscription,
    revokeSubscription,
    getAllUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
