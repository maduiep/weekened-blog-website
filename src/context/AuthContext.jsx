import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext(null);

// ─── Seeded accounts (demo) ──────────────────────────────────────────────────
const SEED_USERS = [];

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
      return JSON.parse(raw);
    }
  } catch (_) {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_USERS));
  return SEED_USERS;
}

function loadAdmins() {
  try {
    const raw = localStorage.getItem('wp_admin_records');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.length > 0) return parsed;
    }
  } catch (_) {}
  const seed = [{
    id: 'admin-001',
    name: 'Super Admin',
    email: 'admin@weekendpost.co.bw',
    role: 'Super Admin',
    status: 'Active',
    history: [{ action: 'Created as Super Admin', date: new Date().toISOString() }]
  }];
  localStorage.setItem('wp_admin_records', JSON.stringify(seed));
  return seed;
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
      let fresh = null;
      if (session.isAdmin) {
        const admins = loadAdmins();
        fresh = admins.find(a => a.id === session.uid);
        if (fresh) fresh = { ...fresh, uid: fresh.id, isAdmin: true };
      } else {
        const users = loadUsers();
        fresh = users.find((u) => u.uid === session.uid);
      }
      const activeSessions = loadActiveSessions();
      const isValidSession =
        fresh &&
        session.activeSessionId &&
        fresh.activeSessionId === session.activeSessionId &&
        activeSessions[session.uid] === session.activeSessionId;
      if (fresh && isValidSession) {
        const { password: _, ...safe } = fresh;
        setUser((current) => {
          if (
            current?.uid === safe.uid &&
            current?.activeSessionId === safe.activeSessionId
          ) {
            return current;
          }
          return safe;
        });
      } else {
        saveSession(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
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

  // Heartbeat to keep server session alive
  useEffect(() => {
    if (!user) return;
    const session = JSON.parse(localStorage.getItem('wp_session') || '{}');
    if (!session.activeSessionId) return;

    const sendHeartbeat = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/sessions/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: session.activeSessionId })
        });
        const data = await res.json();
        if (!data.valid) {
          // Another device logged in — force logout
          logout();
          window.alert('You have been logged out because your account was accessed from another device.');
        }
      } catch (e) {
        // Backend offline, continue with localStorage-only enforcement
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // ── login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const users = loadUsers();
    const idx = users.findIndex(
      (u) =>
        u.email.toLowerCase() === normalizedEmail &&
        u.password === normalizedPassword,
    );
    if (idx === -1) throw new Error("Invalid email or password.");

    const sessionId = acquireSession(users[idx].uid);
    users[idx] = { ...users[idx], activeSessionId: sessionId };
    saveUsers(users);

    // Register session with backend for cross-device enforcement
    try {
      await fetch('http://localhost:3001/api/sessions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: users[idx].uid,
          deviceInfo: navigator.userAgent.substring(0, 100),
          sessionId: sessionId
        })
      });
    } catch (e) {
      console.log('Backend session sync skipped (offline mode)');
    }

    const { password: _, ...safe } = users[idx];
    setUser(safe);
    saveSession(safe);
    return safe;
  }, []);

  // ── admin login ────────────────────────────────────────────────────────────
  const adminLogin = useCallback(async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const admins = loadAdmins();
    const idx = admins.findIndex(
      (a) => a.email.toLowerCase() === normalizedEmail && password === "Admin@1234"
    );
    if (idx === -1) throw new Error("Invalid admin email or password.");
    if (admins[idx].status === 'Deleted') throw new Error("This admin account has been revoked.");

    const sessionId = acquireSession(admins[idx].id);
    admins[idx] = { ...admins[idx], activeSessionId: sessionId };
    localStorage.setItem('wp_admin_records', JSON.stringify(admins));

    const safe = { ...admins[idx], uid: admins[idx].id, isAdmin: true };
    delete safe.password;

    setUser(safe);
    saveSession(safe);
    return safe;
  }, []);

  // ── signup ─────────────────────────────────────────────────────────────────
  const signup = useCallback(async (name, email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const users = loadUsers();
    if (users.find((u) => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error("An account with this email already exists.");
    }
    const uid = `user-${Date.now()}`;
    const newUser = {
      uid,
      name: name.trim(),
      email: normalizedEmail,
      password: normalizedPassword,
      isAdmin: false,
      isSubscribed: false,
      subscriptionPlan: null,
      subscriptionExpiry: null,
      subscriptionTier: null,
      purchasedStories: [],
      activeSessionId: null,
      createdAt: new Date().toISOString(),
      avatar: name.trim().charAt(0).toUpperCase(),
    };
    const updated = [...users, newUser];
    saveUsers(updated);
    const { password: _, ...safe } = newUser;
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

      // Check subscription expiry
      const userData = user;
      if (userData.subscriptionPlan && userData.subscriptionExpiry) {
        const expiry = new Date(userData.subscriptionExpiry);
        if (expiry < new Date()) {
          // Subscription has expired — revoke it
          const users = JSON.parse(localStorage.getItem('wp_users') || '[]');
          const idx = users.findIndex(u => u.uid === userData.uid);
          if (idx !== -1) {
            users[idx].subscriptionPlan = null;
            users[idx].subscriptionExpiry = null;
            localStorage.setItem('wp_users', JSON.stringify(users));
          }
          // Fall through to check purchasedStories
        }
      }

      if (user.isAdmin || user.isSubscribed) return true;
      return (user.purchasedStories || []).includes(Number(articleId));
    },
    [user],
  );

  // ── getAllUsers (admin only) ────────────────────────────────────────────────
  const getAllUsers = useCallback(() => {
    return loadUsers().map(({ password: _, ...safe }) => safe);
  }, []);

  const getAdminLogs = useCallback(() => {
    return JSON.parse(localStorage.getItem('wp_admin_logs') || '[]');
  }, []);

  const logAdminAction = useCallback((action, targetUid, targetName, details) => {
    const logs = JSON.parse(localStorage.getItem('wp_admin_logs') || '[]');
    logs.unshift({
      id: 'LOG-' + Date.now(),
      timestamp: new Date().toISOString(),
      adminUid: user?.uid || 'SYSTEM',
      adminName: user?.name || 'System',
      action,
      targetUid,
      targetName,
      details
    });
    localStorage.setItem('wp_admin_logs', JSON.stringify(logs));
  }, [user]);

  const assignRole = useCallback((uid, role) => {
    const users = loadUsers();
    const idx = users.findIndex((u) => u.uid === uid);
    if (idx === -1) return;
    const targetName = users[idx].name;
    users[idx].isAdmin = role === 'admin';
    saveUsers(users);
    logAdminAction(role === 'admin' ? 'PROMOTED_TO_ADMIN' : 'DEMOTED_TO_USER', uid, targetName, `Role changed to ${role}`);
    if (user?.uid === uid) {
      const { password: _, ...safe } = users[idx];
      setUser(safe);
      saveSession(safe);
    }
  }, [user, logAdminAction]);

  const updateUser = useCallback((uid, updates) => {
    const users = loadUsers();
    const idx = users.findIndex((u) => u.uid === uid);
    if (idx === -1) return;
    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);
    if (user?.uid === uid) {
      const { password: _, ...safe } = users[idx];
      setUser(safe);
      saveSession(safe);
    }
  }, [user]);

  const deleteUser = useCallback((uid) => {
    let users = loadUsers();
    const targetUser = users.find(u => u.uid === uid);
    if (targetUser) {
        logAdminAction('DELETED_USER', uid, targetUser.name, `Account deleted`);
    }
    users = users.filter((u) => u.uid !== uid);
    saveUsers(users);
    if (user?.uid === uid) {
      logout();
    }
  }, [user, logout, logAdminAction]);

  const getTransactionHistory = () => {
    return JSON.parse(localStorage.getItem('wp_transactions') || '[]');
  };

  const recordTransaction = (transaction) => {
    const transactions = JSON.parse(localStorage.getItem('wp_transactions') || '[]');
    transactions.unshift({
      ...transaction,
      id: 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('wp_transactions', JSON.stringify(transactions));
  };

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    isAdmin: !!user?.isAdmin,
    isSubscribed: user?.isAdmin || !!user?.isSubscribed,
    subscriptionTier: user?.subscriptionTier || null,
    purchasedStories: user?.purchasedStories || [],
    login,
    adminLogin,
    signup,
    logout,
    grantSubscription,
    revokeSubscription,
    disconnectUser,
    getAllUsers,
    getAdminLogs,
    assignRole,
    updateUser,
    deleteUser,
    hasArticleAccess,
    getTransactionHistory,
    recordTransaction,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
