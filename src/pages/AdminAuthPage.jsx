import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  Globe,
  Smartphone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function AdminAuthPage() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const [rememberAdmin, setRememberAdmin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [reqName, setReqName] = useState("");
  const [reqEmail, setReqEmail] = useState("");
  const [reqRole, setReqRole] = useState("Editor");

  const { adminLogin, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) navigate(redirect, { replace: true });
  }, [isAdmin, navigate, redirect]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wp_admin_remember");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.email) {
          setSignInData({
            email: parsed.email,
            password: parsed.password || "",
          });
          setRememberAdmin(true);
        }
      }
    } catch (error) {
      console.warn("Failed to load remembered admin credentials.", error);
    }
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Ensure seed Super Admin always exists before credential check
      let admins = [];
      try {
        const raw = localStorage.getItem("wp_admin_records");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) admins = parsed;
        }
      } catch (_) {}

      const seedAdmin = {
        id: "admin-001",
        name: "Super Admin",
        email: "admin@weekendpost.co.bw",
        role: "Super Admin",
        status: "Active",
        history: [
          { action: "Created as Super Admin", date: new Date().toISOString() },
        ],
      };
      const seedIdx = admins.findIndex((a) => a.id === "admin-001");
      if (seedIdx === -1) {
        admins.unshift(seedAdmin);
        localStorage.setItem("wp_admin_records", JSON.stringify(admins));
      } else if (admins[seedIdx].status !== "Active") {
        admins[seedIdx].status = "Active";
        localStorage.setItem("wp_admin_records", JSON.stringify(admins));
      }

      const normalized = signInData.email.trim().toLowerCase();
      const idx = admins.findIndex(
        (a) =>
          a.email.toLowerCase() === normalized &&
          signInData.password === "Admin@1234",
      );
      if (idx === -1) throw new Error("Invalid admin email or password.");
      if (admins[idx].status !== "Active")
        throw new Error("Admin account is not active.");

      const generated = String(Math.floor(100000 + Math.random() * 900000));
      setGeneratedOtp(generated);
      setOtpSent(true);
      setOtpError("");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const verifyOtpAndAdminLogin = async () => {
    setOtpError("");
    if (!otpInput || otpInput.trim() === "") {
      setOtpError("Enter the OTP shown on screen.");
      return;
    }
    if (otpInput.trim() !== generatedOtp) {
      setOtpError("Invalid OTP.");
      return;
    }
    try {
      await adminLogin(signInData.email.trim(), signInData.password.trim());
      if (rememberAdmin) {
        localStorage.setItem(
          "wp_admin_remember",
          JSON.stringify({
            email: signInData.email.trim(),
            password: signInData.password.trim(),
          }),
        );
      } else {
        localStorage.removeItem("wp_admin_remember");
      }
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setOtpSent(false);
      setGeneratedOtp("");
      setOtpInput("");
    }
  };

  const handleRequestAccess = (e) => {
    e.preventDefault();
    const admins = JSON.parse(localStorage.getItem("wp_admin_records") || "[]");
    const exists = admins.find(
      (a) => a.email.toLowerCase() === reqEmail.trim().toLowerCase(),
    );
    if (exists) {
      setError("An admin request with this email already exists.");
      return;
    }
    const newAdmin = {
      id: `admin-${Date.now()}`,
      name: reqName.trim(),
      email: reqEmail.trim().toLowerCase(),
      role: reqRole,
      status: "Pending",
      history: [
        {
          action: `Requested access as ${reqRole}`,
          date: new Date().toISOString(),
        },
      ],
    };
    admins.push(newAdmin);
    localStorage.setItem("wp_admin_records", JSON.stringify(admins));
    setShowRequestForm(false);
    setReqName("");
    setReqEmail("");
    setReqRole("Editor");
    setSuccess("Access request submitted. Awaiting approval from Super Admin.");
  };

  return (
    <div className="auth-page">
      {/* Visual Side */}
      <div
        className="auth-visual"
        style={{
          background: "var(--color-dark)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0.1,
            background:
              'url("https://www.transparenttextures.com/patterns/cubes.png")',
          }}
        />

        <div
          className="auth-visual-content"
          style={{ position: "relative", zIndex: 2 }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <h2
              style={{
                color: "white",
                fontSize: "var(--text-3xl)",
                fontWeight: 800,
              }}
            >
              Weekend<span style={{ color: "var(--color-gold)" }}>Post</span>
            </h2>
          </Link>
          <p
            style={{
              color: "rgba(255,255,255,0.9)",
              marginBottom: "var(--space-2xl)",
            }}
          >
            Restricted Access. Staff Members and Administrators Only.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-xl)",
              marginTop: "var(--space-2xl)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "var(--space-md)",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4
                  style={{
                    color: "white",
                    fontSize: "var(--text-sm)",
                    marginBottom: 2,
                  }}
                >
                  Admin Portal
                </h4>
                <p
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "var(--text-xs)",
                    lineHeight: 1.4,
                  }}
                >
                  Use your corporate credentials to access the newsroom systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-container">
        <div className="auth-form">
          <div
            className="auth-tabs"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <h3 style={{ margin: 0, padding: "var(--space-md) 0" }}>
              Staff Login
            </h3>
          </div>

          <motion.form
            key="signin"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSignIn}
            autoComplete="off"
          >
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-muted)",
                  }}
                />
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@weekendpost.co.bw"
                  autoComplete="off"
                  style={{ paddingLeft: 40 }}
                  value={signInData.email}
                  onChange={(e) =>
                    setSignInData((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label
                className="form-label"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-muted)",
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  style={{ paddingLeft: 40, paddingRight: 44 }}
                  value={signInData.password}
                  onChange={(e) =>
                    setSignInData((p) => ({
                      ...p,
                      password: e.target.value,
                    }))
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-muted)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
              style={{
                marginTop: "var(--space-md)",
                background: "var(--color-dark)",
              }}
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
            </button>
          </motion.form>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "var(--space-md)",
              fontSize: "var(--text-sm)",
              color: "var(--color-text-muted)",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={rememberAdmin}
              onChange={(e) => setRememberAdmin(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            Remember admin login details for next time
          </label>

          {otpSent ? (
            <div style={{ marginTop: "var(--space-md)" }}>
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "12px",
                  background: "rgba(0,0,0,0.04)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-dark)",
                  fontSize: "var(--text-sm)",
                  textAlign: "center",
                }}
              >
                <div style={{ marginBottom: 8 }}>
                  Demo OTP (for testing): <strong>{generatedOtp}</strong>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "center", gap: 8 }}
                >
                  <input
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="Enter OTP"
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={verifyOtpAndAdminLogin}
                  >
                    Verify OTP
                  </button>
                </div>
                {otpError && (
                  <div style={{ color: "var(--color-news-red)", marginTop: 8 }}>
                    {otpError}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  marginTop: "var(--space-md)",
                  padding: "14px 16px",
                  borderRadius: "16px",
                  background: "rgba(0, 126, 151, 0.08)",
                  border: "1px solid rgba(0, 126, 151, 0.15)",
                  color: "var(--color-dark)",
                  fontSize: "var(--text-sm)",
                  lineHeight: 1.6,
                }}
              >
                <strong>Demo Admin:</strong> admin@weekendpost.co.bw /{" "}
                <strong>Admin@1234</strong>
              </div>

              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <button
                  className="btn"
                  onClick={() => setShowRequestForm((v) => !v)}
                >
                  {showRequestForm ? "Cancel Request" : "Request Admin Access"}
                </button>
              </div>

              {showRequestForm && (
                <div
                  style={{
                    marginTop: 12,
                    padding: 12,
                    borderRadius: 8,
                    background: "var(--color-bg)",
                  }}
                >
                  <form
                    className="admin-request-form"
                    onSubmit={handleRequestAccess}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                      alignItems: "flex-end",
                    }}
                  >
                    <input
                      value={reqName}
                      onChange={(e) => setReqName(e.target.value)}
                      placeholder="Full name"
                      required
                      style={{
                        padding: 8,
                        borderRadius: 8,
                        border: "1px solid var(--color-border)",
                        fontSize: "var(--text-xs)",
                      }}
                    />
                    <input
                      value={reqEmail}
                      onChange={(e) => setReqEmail(e.target.value)}
                      placeholder="Email"
                      type="email"
                      required
                      style={{
                        padding: 8,
                        borderRadius: 8,
                        border: "1px solid var(--color-border)",
                        fontSize: "var(--text-xs)",
                      }}
                    />
                    <select
                      value={reqRole}
                      onChange={(e) => setReqRole(e.target.value)}
                      style={{
                        padding: 8,
                        borderRadius: 8,
                        border: "1px solid var(--color-border)",
                        fontSize: "var(--text-xs)",
                      }}
                    >
                      <option value="Editor">Editor</option>
                      <option value="Writer">Writer</option>
                      <option value="Moderator">Moderator</option>
                    </select>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ padding: "8px 12px", fontSize: "var(--text-xs)" }}
                    >
                      Submit
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Alerts */}
          <div style={{ marginTop: "var(--space-lg)" }}>
            {error && (
              <div
                className="auth-alert auth-alert-error"
                style={{ fontSize: "var(--text-xs)" }}
              >
                <AlertCircle size={14} /> {error}
              </div>
            )}
            {success && (
              <div
                className="auth-alert auth-alert-success"
                style={{ fontSize: "var(--text-xs)" }}
              >
                <CheckCircle size={14} /> {success}
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: "var(--space-2xl)",
              textAlign: "center",
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                marginBottom: "var(--space-md)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <ShieldCheck size={12} /> SSL Secured
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Lock size={12} /> Corporate Network Only
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

