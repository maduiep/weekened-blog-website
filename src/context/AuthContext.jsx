import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext(null);

// ─── Seeded accounts (demo) ──────────────────────────────────────────────────
const SEED_USERS = [
  {
    uid: "admin-001",
    name: "Weekend Post Admin",
    email: "admin@weekendpost.co.bw",
    password: "Admin@1234",
    isAdmin: true,
    isSubscribed: true,
    subscriptionPlan: "annual",
    subscriptionExpiry: "2027-12-31",
    createdAt: "2024-01-01T00:00:00Z",
    avatar: "A",
  },
];

const STORAGE_KEY = "wp_users";
const SESSION_KEY = "wp_session";
const ACTIVE_SESSIONS_KEY = "wp_active_sessions";

function loadActiveSessions() {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
}

function saveActiveSessions(sessions) {
  localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(sessions));
}

function acquireSession(uid) {
  const sessions = loadActiveSessions();
  const sessionId = `${uid}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  sessions[uid] = sessionId;
  saveActiveSessions(sessions);
  return sessionId;
}

function clearActiveSession(uid, sessionId) {
  const sessions = loadActiveSessions();
  if (sessions[uid] === sessionId) {
    delete sessions[uid];
    saveActiveSessions(sessions);
  }
}

function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      // Always ensure seed admin is present (guards against stale localStorage)
      const hasSeedAdmin = stored.some((u) => u.uid === "admin-001");
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
      const users = loadUsers();
      const fresh = users.find((u) => u.uid === session.uid);
      const activeSessions = loadActiveSessions();
      const isValidSession =
        fresh &&
        session.activeSessionId &&
        fresh.activeSessionId === session.activeSessionId &&
        activeSessions[session.uid] === session.activeSessionId;
      if (fresh && isValidSession) {
        const { password: _, ...safe } = fresh;
        setUser(safe);
      } else {
        saveSession(null);
      }
    }
    setLoading(false);

    const handleStorage = (e) => {
      if (e.key !== ACTIVE_SESSIONS_KEY) return;
      const activeSessions = loadActiveSessions();
      if (!user) return;
      if (activeSessions[user.uid] !== user.activeSessionId) {
        setUser(null);
        saveSession(null);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [user]);

  // ── login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const users = loadUsers();
    const idx = users.findIndex(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );
    if (idx === -1) throw new Error("Invalid email or password.");

    const sessionId = acquireSession(users[idx].uid);
    users[idx] = { ...users[idx], activeSessionId: sessionId };
    saveUsers(users);

    const { password: _, ...safe } = users[idx];
    setUser(safe);
    saveSession(safe);
    return safe;
  }, []);

  // ── signup ─────────────────────────────────────────────────────────────────
  const signup = useCallback(async (name, email, password) => {
    const users = loadUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with this email already exists.");
    }
    const uid = `user-${Date.now()}`;
    const sessionId = acquireSession(uid);
    const newUser = {
      uid,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      isAdmin: false,
      isSubscribed: false,
      subscriptionPlan: null,
      subscriptionExpiry: null,
      subscriptionTier: null,
      purchasedStories: [],
      activeSessionId: sessionId,
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
    if (user?.uid && user?.activeSessionId) {
      clearActiveSession(user.uid, user.activeSessionId);
    }
    setUser(null);
    saveSession(null);
  }, [user]);

  // ── grantSubscription ──────────────────────────────────────────────────────
  const grantSubscription = useCallback(
    (planId) => {
      if (!user) return;
      const users = loadUsers();
      const idx = users.findIndex((u) => u.uid === user.uid);
      if (idx === -1) return;

      const updated = {
        ...users[idx],
        purchasedStories: users[idx].purchasedStories || [],
        subscriptionTier: users[idx].subscriptionTier || null,
      };
      const isStoryPurchase = planId.startsWith("story:");

      if (isStoryPurchase) {
        const articleId = Number(planId.split(":")[1]);
        if (!updated.purchasedStories.includes(articleId)) {
          updated.purchasedStories = [...updated.purchasedStories, articleId];
        }
        updated.subscriptionPlan = "storypass";
        updated.isSubscribed = updated.isSubscribed || false;
      } else {
        const expiryMap = {
          weekly: 7,
          monthly: 30,
          annual: 365,
          corporate: 365,
          enterprise: 730,
          storypass: 0,
        };
        const days = expiryMap[planId] || 30;
        const expiry =
          planId === "storypass"
            ? null
            : new Date(Date.now() + days * 86400000).toISOString();

        updated.isSubscribed = planId !== "storypass";
        updated.subscriptionPlan = planId;
        updated.subscriptionExpiry = expiry;
        if (planId === "corporate") updated.subscriptionTier = "Corporate";
        if (planId === "enterprise") updated.subscriptionTier = "Enterprise";
      }

      users[idx] = updated;
      saveUsers(users);

      if (user.uid === updated.uid) {
        const { password: _, ...safe } = updated;
        setUser(safe);
        saveSession(safe);
      }
    },
    [user],
  );

  // ── revokeSubscription (admin) ─────────────────────────────────────────────
  const revokeSubscription = useCallback(
    (uid) => {
      const users = loadUsers();
      const idx = users.findIndex((u) => u.uid === uid);
      if (idx === -1) return;
      users[idx] = {
        ...users[idx],
        isSubscribed: false,
        subscriptionPlan: null,
        subscriptionExpiry: null,
        subscriptionTier: null,
        purchasedStories: users[idx].purchasedStories || [],
      };
      saveUsers(users);
      // If admin revokes their own, update session
      if (user?.uid === uid) {
        const { password: _, ...safe } = users[idx];
        setUser(safe);
        saveSession(safe);
      }
    },
    [user],
  );

  const disconnectUser = useCallback(
    (uid) => {
      const users = loadUsers();
      const idx = users.findIndex((u) => u.uid === uid);
      if (idx === -1) return;
      users[idx] = { ...users[idx], activeSessionId: null };
      saveUsers(users);
      if (user?.uid === uid) {
        setUser(null);
        saveSession(null);
      }
    },
    [user],
  );

  const hasArticleAccess = useCallback(
    (articleId) => {
      if (!user) return false;
      if (user.isAdmin || user.isSubscribed) return true;
      return (user.purchasedStories || []).includes(Number(articleId));
    },
    [user],
  );

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
    disconnectUser,
    getAllUsers,
    hasArticleAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
