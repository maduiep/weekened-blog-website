import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User as UserIcon,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  Globe,
  Smartphone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
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
  // Sign up form
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
  });

  const { login, signup, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate(redirect || "/", { replace: true });
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    setError("");
    setSuccess("");
  }, [tab]);

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
      await login(signInData.email.trim(), signInData.password.trim());
      navigate(redirect || "/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
      const target = `/auth?tab=signin${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ""}`;
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
                      fontSize: "11px",
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
              <motion.form
                key="signin"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSignIn}
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
                  style={{ marginTop: "var(--space-md)" }}
                >
                  {loading ? "Authenticating..." : "Sign In"}
                </button>

              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSignUp}
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
                      fontSize: "10px",
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
                      fontSize: "10px",
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
                style={{ fontSize: "12px" }}
              >
                <AlertCircle size={14} /> {error}
              </div>
            )}
            {success && (
              <div
                className="auth-alert auth-alert-success"
                style={{ fontSize: "12px" }}
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
