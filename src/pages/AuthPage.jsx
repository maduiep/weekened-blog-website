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
  User as UserIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [tab, setTab] = useState(
    searchParams.get("tab") === "signup" ? "signup" : "signin",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Sign in form
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");
  // Sign up form
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
  });

  const { login, signup, isLoggedIn, adminLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate(redirect || "/", { replace: true });
  }, [isLoggedIn, navigate]);

  // reset errors when tab changes\n  useEffect(() => {\n    let isMounted = true;\n    if(isMounted) { setError(""); setSuccess(""); }\n    return () => { isMounted = false; }\n  }, [tab]);

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length > 6) score++;
    if (pass.length > 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    setPasswordStrength(score);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // User-only login: do not allow admin login from this page.
      const usersRaw = localStorage.getItem("wp_users");
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const normalized = signInData.email.trim().toLowerCase();
      const idx = users.findIndex(
        (u) =>
          u.email.toLowerCase() === normalized &&
          u.password === signInData.password,
      );
      if (idx === -1) throw new Error("Invalid email or password.");

      // Generate demo OTP and require confirmation (demo: show OTP on screen)
      const generated = String(Math.floor(100000 + Math.random() * 900000));
      setGeneratedOtp(generated);
      setOtpSent(true);
      setOtpError("");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const verifyOtpAndLogin = async () => {
    setOtpError("");
    if (!otpInput || otpInput.trim() === "") {
      setOtpError("Enter the OTP shown on screen.");
      return;
    }
    if (otpInput.trim() !== generatedOtp) {
      setOtpError("Invalid OTP.");
      return;
    }
    // OTP valid — perform actual login
    try {
      await login(signInData.email.trim(), signInData.password.trim());
      navigate(redirect || "/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setOtpSent(false);
      setGeneratedOtp("");
      setOtpInput("");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (signUpData.password.trim() !== signUpData.confirm.trim()) {
      setError("Passwords do not match.");
      return;
    }
    if (signUpData.password.trim().length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await signup(signUpData.name, signUpData.email, signUpData.password);
      setSuccess("Account created! Redirecting to login…");
      setSignUpData({
        name: "",
        email: "",
        password: "",
        confirm: "",
        agree: false,
      });
      const target = `/user-auth?tab=signin${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ""}`;
      setTimeout(() => {
        setTab("signin");
        navigate(target, { replace: true });
      }, 1250);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Visual Side */}
      <div
        className="auth-visual"
        style={{
          background: "var(--color-primary)",
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
            Join Botswana's premium digital news platform. Secure, seamless, and
            insightful.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-xl)",
              marginTop: "var(--space-2xl)",
            }}
          >
            {[
              {
                icon: <ShieldCheck size={20} />,
                title: "Bank-Grade Security",
                desc: "Your data and transactions are protected by industry-leading encryption.",
              },
              {
                icon: <Smartphone size={20} />,
                title: "Device-Agnostic Access",
                desc: "Read seamlessly across your phone, tablet, and desktop.",
              },
              {
                icon: <Globe size={20} />,
                title: "Botswana's Voice",
                desc: "Support independent journalism and stay connected to local stories.",
              },
            ].map((item, i) => (
              <div
                key={i}
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
                  {item.icon}
                </div>
                <div>
                  <h4
                    style={{
                      color: "white",
                      fontSize: "var(--text-sm)",
                      marginBottom: 2,
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "var(--text-xs)",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-container">
        <div className="auth-form">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === "signin" ? "active" : ""}`}
              onClick={() => setTab("signin")}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${tab === "signup" ? "active" : ""}`}
              onClick={() => setTab("signup")}
            >
              Create Account
            </button>
          </div>

          <AnimatePresence mode="wait">
            {tab === "signin" ? (
              <>
                <motion.form
                  key="signin"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSignIn}
                  autoComplete="off"
                >
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
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
                        placeholder="you@example.com"
                        autoComplete="off"
                        style={{ paddingLeft: 40 }}
                        value={signInData.email}
                        onChange={(e) =>
                          setSignInData((p) => ({
                            ...p,
                            email: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label
                      className="form-label"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      Password
                      <a
                        href="#"
                        style={{ fontSize: "var(--text-xs)", fontWeight: 400 }}
                      >
                        Forgot password?
                      </a>
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
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg btn-block"
                    disabled={loading}
                    style={{ marginTop: "var(--space-md)" }}
                  >
                    {loading ? "Authenticating..." : "Sign In"}
                  </button>
                </motion.form>

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
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 8,
                        }}
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
                          onClick={verifyOtpAndLogin}
                        >
                          Verify OTP
                        </button>
                      </div>
                      {otpError && (
                        <div
                          style={{
                            color: "var(--color-news-red)",
                            marginTop: 8,
                          }}
                        >
                          {otpError}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        marginTop: 10,
                        textAlign: "center",
                        fontSize: "var(--text-xs)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      If you expected an email OTP, check the demo OTP shown
                      above for testing.
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: "var(--space-md)",
                      padding: "14px 16px",
                      borderRadius: "16px",
                      background: "rgba(0, 126, 151, 0.04)",
                      border: "1px solid rgba(0, 126, 151, 0.08)",
                      color: "var(--color-dark)",
                      fontSize: "var(--text-sm)",
                      lineHeight: 1.6,
                      textAlign: "center",
                    }}
                  >
                    Admins must sign in via the admin portal.
                    <br />
                    <a
                      href="/admin-auth"
                      style={{ color: "var(--color-primary)", fontWeight: 700 }}
                    >
                      Go to Admin Login
                    </a>
                  </div>
                )}
              </>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSignUp}
                autoComplete="off"
              >
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div style={{ position: "relative" }}>
                    <UserIcon
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
                      type="text"
                      className="form-input"
                      placeholder="Your full name"
                      autoComplete="off"
                      style={{ paddingLeft: 40 }}
                      value={signUpData.name}
                      onChange={(e) =>
                        setSignUpData((p) => ({ ...p, name: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
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
                      placeholder="you@example.com"
                      autoComplete="off"
                      style={{ paddingLeft: 40 }}
                      value={signUpData.email}
                      onChange={(e) =>
                        setSignUpData((p) => ({ ...p, email: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-muted)",
                      marginTop: 4,
                    }}
                  >
                    Unique user validation will check for duplicate accounts.
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Create Password</label>
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
                      placeholder="min 6 characters"
                      autoComplete="new-password"
                      style={{ paddingLeft: 40, paddingRight: 44 }}
                      value={signUpData.password}
                      onChange={(e) => {
                        setSignUpData((p) => ({
                          ...p,
                          password: e.target.value,
                        }));
                        calculateStrength(e.target.value);
                      }}
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
                  {/* Password Strength Indicator */}
                  <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        style={{
                          flex: 1,
                          height: 4,
                          borderRadius: 2,
                          background:
                            lvl <= passwordStrength
                              ? passwordStrength < 3
                                ? "var(--color-news-red)"
                                : passwordStrength < 5
                                  ? "var(--color-gold)"
                                  : "var(--color-sport-green)"
                              : "var(--color-border)",
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-muted)",
                      marginTop: 4,
                    }}
                  >
                    {passwordStrength < 3
                      ? "Weak"
                      : passwordStrength < 5
                        ? "Good"
                        : "Strong"}{" "}
                    Security
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
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
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      style={{ paddingLeft: 40, paddingRight: 44 }}
                      value={signUpData.confirm}
                      onChange={(e) =>
                        setSignUpData((p) => ({
                          ...p,
                          confirm: e.target.value,
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
                  style={{ marginTop: "var(--space-md)" }}
                >
                  {loading ? "Creating Secure Account..." : "Create Account"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

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
                <Lock size={12} /> AES-256
              </span>
            </div>
            By continuing, you agree to our{" "}
            <a href="#" style={{ color: "var(--color-primary)" }}>
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" style={{ color: "var(--color-primary)" }}>
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}

