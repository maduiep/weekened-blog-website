import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Shield,
  Lock,
  CheckCircle,
  ArrowRight,
  X,
  Phone,
  Info,
  Upload,
  Landmark,
  AlertCircle,
  Copy,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { getPaymentMethods } from "../../utils/settings";

export default function PaymentModal({ plan, onClose, redirect }) {
  const [paymentMethods, setPaymentMethods] = useState(getPaymentMethods());
  const [tab, setTab] = useState(plan?.defaultMethod || getPaymentMethods()[0]?.id);
  const [step, setStep] = useState("form"); // form | otp | processing | success | upload
  const [demoSms, setDemoSms] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user, grantSubscription, isLoggedIn } = useAuth();

  useEffect(() => {
    if (plan?.defaultMethod) setTab(plan.defaultMethod);
  }, [plan?.defaultMethod]);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");

  const isArticle = redirect && redirect.startsWith("/article/");
  const isStoryPurchase =
    plan?.id === "storypass" || plan?.id?.startsWith("story:");
  const successRedirect = redirect || "/article/1";

  const method = paymentMethods.find(m => m.id === tab) || paymentMethods[0];

  const formatPhone = (v) => {
    const digits = v.replace(/\D/g, "").slice(0, 11);
    if (digits.startsWith("267") && digits.length > 3) {
      return (
        "+267 " +
        digits
          .slice(3)
          .replace(/(\d{2})(\d{3})?(\d{3})?/, (_, a, b, c) =>
            [a, b, c].filter(Boolean).join(" "),
          )
      );
    }
    return v;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (method.type === 'mobile-money') {
      try {
        const response = await fetch(
          "http://localhost:3001/api/payments/mobile-money/init",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: plan.price,
              provider: method.id,
              phone,
            }),
          },
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Initialization failed.");
        }
        setError("");
      } catch (err) {
        setError(err.message);
        return;
      }
      setStep("otp");
      setTimeout(() => setDemoSms(true), 1500);
    } else if (method.type === "redirect") {
      setStep("processing");
      setTimeout(() => {
        // Log transaction
        const transactions = JSON.parse(localStorage.getItem('wp_transactions') || '[]');
        transactions.push({
          id: `TXN-${Date.now().toString().slice(-6)}`,
          date: new Date().toISOString(),
          email: user?.email,
          planId: plan.id,
          planName: isStoryPurchase ? 'One-Story Pass' : plan.name,
          amount: plan.price,
          status: 'Paid',
          method: method.name
        });
        localStorage.setItem('wp_transactions', JSON.stringify(transactions));

        if (isLoggedIn) grantSubscription(plan.id || "monthly");
        setStep("success");
      }, 2000);
    } else if (method.type === "bank-transfer") {
      setStep("upload");
    } else {
      setStep("otp");
      setTimeout(() => setDemoSms(true), 1500);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProofFile(file);
  };

  const handleSubmitProof = () => {
    if (!proofFile) {
      setError("Please upload a proof of payment.");
      return;
    }
    setUploading(true);

    // Convert file to base64 for storage/preview
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = reader.result; // base64 data URL

      // Store receipt in localStorage for admin review
      const receipts = JSON.parse(localStorage.getItem("wp_payment_receipts") || "[]");
      const receiptId = `REC-${Date.now().toString().slice(-8)}`;
      receipts.unshift({
        id: receiptId,
        userId: user?.uid || "unknown",
        userName: user?.name || "Unknown",
        userEmail: user?.email || "Unknown",
        planId: plan.id,
        planName: isStoryPurchase ? "One-Story Pass" : plan.name,
        amount: plan.price,
        currency: plan.currency || "P",
        fileName: proofFile.name,
        fileSize: proofFile.size,
        fileType: proofFile.type,
        fileData: fileData,
        submittedAt: new Date().toISOString(),
        status: "pending", // pending | approved | rejected
        reviewedBy: null,
        reviewedAt: null,
        reviewNote: "",
      });
      localStorage.setItem("wp_payment_receipts", JSON.stringify(receipts));

      // Log transaction as pending
      const transactions = JSON.parse(localStorage.getItem("wp_transactions") || "[]");
      transactions.push({
        id: `TXN-${Date.now().toString().slice(-6)}`,
        receiptId,
        date: new Date().toISOString(),
        email: user?.email,
        planId: plan.id,
        planName: isStoryPurchase ? "One-Story Pass" : plan.name,
        amount: plan.price,
        status: "Pending Verification",
        method: method.name,
      });
      localStorage.setItem("wp_transactions", JSON.stringify(transactions));

      setStep("processing");
      setUploading(false);
      setTimeout(() => {
        if (isLoggedIn) grantSubscription(plan.id || "monthly");
        setStep("success");
      }, 2000);
    };
    reader.readAsDataURL(proofFile);
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.length < 6) {
      setError(`Invalid verification code.`);
      return;
    }
    
    if (method.type === 'mobile-money') {
      try {
        const response = await fetch("http://localhost:3001/api/payments/mobile-money/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider: method.id, phone, otp }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
      } catch (err) {
        setError(err.message);
        return;
      }
    }
    
    setStep("processing");
    setDemoSms(false);
    setTimeout(() => {
      // Log transaction
      const transactions = JSON.parse(localStorage.getItem('wp_transactions') || '[]');
      transactions.push({
        id: `TXN-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        email: user?.email,
        planId: plan.id,
        planName: isStoryPurchase ? 'One-Story Pass' : plan.name,
        amount: plan.price,
        status: 'Paid',
        method: method.name
      });
      localStorage.setItem('wp_transactions', JSON.stringify(transactions));

      if (isLoggedIn) grantSubscription(plan.id || "monthly");
      setStep("success");
    }, 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) =>
          e.target === e.currentTarget && step !== "processing" && onClose()
        }
      >
        {/* Demo SMS Notification */}
        <AnimatePresence>
          {demoSms && (
            <motion.div
              initial={{ y: -100, opacity: 0, x: "-50%" }}
              animate={{ y: 20, opacity: 1, x: "-50%" }}
              exit={{ y: -100, opacity: 0, x: "-50%" }}
              className="demo-sms-notification"
              style={{
                position: "fixed",
                left: "50%",
                zIndex: 2000,
                width: "90%",
                maxWidth: "400px",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                padding: "16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                border: "1px solid var(--color-border)",
                display: "flex",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  background: method.color,
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <Smartphone size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 2,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: "13px" }}>
                    {method.name} Secure
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    Now
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.4,
                  }}
                >
                  WP-Payment: Code{" "}
                  <strong style={{ color: "var(--color-dark)" }}>123456</strong>
                  . Do not share this with anyone.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="modal-content"
          initial={{ scale: 0.92, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 24 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: "480px" }}
        >
          <div className="modal-header">
            <div>
              <h3
                style={{
                  fontSize: "var(--text-lg)",
                  marginBottom: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Secure Checkout{" "}
                <ShieldCheck size={18} color="var(--color-primary)" />
              </h3>
              <p
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                  margin: 0,
                }}
              >
                {isStoryPurchase
                  ? "Single article access"
                  : `${plan.name} — ${plan.currency}${plan.price}.00${plan.period || ""}`}
              </p>
            </div>
            {step !== "processing" && (
              <button
                className="modal-close"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="modal-body">
            <AnimatePresence mode="wait">
              {step === "success" && (
                <motion.div
                  key="success"
                  className="payment-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="payment-success-icon">
                    <CheckCircle size={48} />
                  </div>
                  <h3
                    style={{
                      marginBottom: "var(--space-sm)",
                      color: "var(--color-dark)",
                      fontSize: "var(--text-2xl)",
                    }}
                  >
                    Transaction Confirmed
                  </h3>
                  <div
                    style={{
                      background: "var(--color-sport-green)",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "var(--text-xs)",
                      fontWeight: 700,
                      display: "inline-block",
                      marginBottom: "var(--space-lg)",
                      textTransform: "uppercase",
                    }}
                  >
                    {method.type === "bank-transfer"
                      ? "Verification Pending"
                      : "Subscription Active"}
                  </div>

                  <div
                    className="payment-receipt"
                    style={{
                      background: "var(--color-bg-alt)",
                      borderRadius: "12px",
                      padding: "var(--space-lg)",
                      textAlign: "left",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <div
                      className="order-summary-row"
                      style={{ fontSize: "var(--text-sm)", marginBottom: 8 }}
                    >
                      <span>Transaction ID</span>
                      <span style={{ fontWeight: 600 }}>
                        #TXN-{Date.now().toString().slice(-6)}
                      </span>
                    </div>
                    <div
                      className="order-summary-row"
                      style={{ fontSize: "var(--text-sm)", marginBottom: 8 }}
                    >
                      <span>Payment Provider</span>
                      <span style={{ fontWeight: 600 }}>{method.name}</span>
                    </div>
                    <div
                      className="order-summary-row"
                      style={{ fontSize: "var(--text-sm)" }}
                    >
                      <span>Secure Ref</span>
                      <span style={{ fontWeight: 600 }}>
                        {method.bankDetails?.reference || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div
                    className="payment-success-actions"
                    style={{ marginTop: "var(--space-xl)" }}
                  >
                    <button
                      className="btn btn-primary btn-lg btn-block"
                      onClick={() => {
                        onClose();
                        navigate(successRedirect);
                      }}
                    >
                      {isArticle ? "Return to Article" : "Enter Portal"}{" "}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === "processing" && (
                <motion.div
                  key="processing"
                  className="payment-success"
                  style={{ padding: "var(--space-3xl) var(--space-xl)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div
                    className="loading-spinner"
                    style={{
                      width: 64,
                      height: 64,
                      border: "5px solid var(--color-border)",
                      borderTopColor: method.color,
                      borderRadius: "50%",
                      animation: "spin 0.9s linear infinite",
                      margin: "0 auto var(--space-xl)",
                    }}
                  />
                  <h3>Encrypting Connection...</h3>
                  <p
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    Securing your transaction with {method.name}.
                  </p>
                </motion.div>
              )}

              {(step === "form" || step === "otp" || step === "upload") && (
                <motion.div
                  key="main-flow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {step === "form" && (
                    <div
                      className="payment-tabs"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                        marginBottom: "var(--space-xl)",
                      }}
                    >
                      {paymentMethods.map((m) => (
                        <button
                          key={m.id}
                          className={`payment-tab ${tab === m.id ? "active" : ""}`}
                          style={{
                            border: "1px solid var(--color-border)",
                            borderRadius: "12px",
                            padding: "12px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "8px",
                            background:
                              tab === m.id ? "var(--color-bg-alt)" : "white",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onClick={() => {
                            setTab(m.id);
                            setStep("form");
                            setError("");
                          }}
                        >
                          <span style={{ opacity: tab === m.id ? 1 : 0.6, fontSize: '24px' }}>
                            {m.icon}
                          </span>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 700,
                              color:
                                tab === m.id
                                  ? "var(--color-dark)"
                                  : "var(--color-text-muted)",
                            }}
                          >
                            {m.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div
                    style={{
                      background: `${method.color}11`,
                      borderRadius: "12px",
                      padding: "16px",
                      marginBottom: "var(--space-lg)",
                      border: "1px solid " + method.color + "22",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "11px",
                        color: method.color,
                        fontWeight: 700,
                        marginBottom: 4,
                        textTransform: "uppercase",
                      }}
                    >
                      Selected Method
                    </p>
                    <p
                      style={{
                        fontSize: "13px",
                        margin: 0,
                        color: "var(--color-dark)",
                      }}
                    >
                      {method.description}
                    </p>
                  </div>

                  {error && (
                    <div
                      className="payment-error"
                      style={{
                        marginBottom: "16px",
                        padding: "12px",
                        background: "rgba(239,68,68,0.1)",
                        color: "var(--color-news-red)",
                        borderRadius: "8px",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <AlertCircle size={14} /> {error}
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {step === "form" && (
                      <motion.form key="form" onSubmit={handleSendOtp}>
                        {method.type === "redirect" ? (
                          <div style={{ textAlign: "center", padding: "20px" }}>
                            <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
                              {method.instructions}
                            </p>
                          </div>
                        ) : method.type !== "bank-transfer" ? (
                          <div className="form-group">
                            <label className="form-label">
                              {method.type === 'card' ? 'Card Number' : 'Phone Number'}
                            </label>
                            <input
                              type="tel"
                              className="form-input"
                              placeholder={method.type === 'card' ? 'XXXX XXXX XXXX XXXX' : 'Enter mobile number'}
                              value={phone}
                              onChange={(e) =>
                                setPhone(method.type === 'card' ? e.target.value : formatPhone(e.target.value))
                              }
                              required
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              background: "white",
                              border: "1px solid var(--color-border)",
                              borderRadius: "12px",
                              padding: "16px",
                              marginBottom: "16px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 8,
                                fontSize: "12px",
                              }}
                            >
                              <span>Bank:</span>{" "}
                              <strong>{method.bankDetails.bankName}</strong>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 8,
                                fontSize: "12px",
                              }}
                            >
                              <span>Account Name:</span>{" "}
                              <strong>{method.bankDetails.accountName}</strong>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 8,
                                fontSize: "12px",
                              }}
                            >
                              <span>Account:</span>{" "}
                              <strong>{method.bankDetails.accountNumber}</strong>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "10px",
                                background: "var(--color-bg-alt)",
                                borderRadius: "6px",
                                fontSize: "12px",
                              }}
                            >
                              <span>Reference:</span>
                              <span
                                style={{
                                  fontWeight: 800,
                                  color: "var(--color-primary)",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                {method.bankDetails.reference}{" "}
                                <Copy
                                  size={12}
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    copyToClipboard(method.bankDetails.reference)
                                  }
                                />
                              </span>
                            </div>
                          </div>
                        )}
                        <div
                          style={{
                            background: "rgba(245,166,35,0.1)",
                            padding: "12px",
                            borderRadius: "8px",
                            marginBottom: "16px",
                            fontSize: "12px",
                            color: "var(--color-dark)",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "8px",
                          }}
                        >
                          <Info size={16} style={{ color: "#F5A623", flexShrink: 0, marginTop: "2px" }} />
                          <span>
                            <strong>Note:</strong> All downloaded E-Papers and PDF articles are strictly watermarked to your account. Sharing or redistributing them is prohibited.
                          </span>
                        </div>
                        <label
                          className="form-checkbox"
                          style={{ marginBottom: "20px" }}
                        >
                          <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                          />
                          <span style={{ fontSize: "12px" }}>
                            I agree to the{" "}
                            <a
                              href="#"
                              style={{ color: "var(--color-primary)" }}
                            >
                              Secure Payment Terms
                            </a>
                          </span>
                        </label>
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg btn-block"
                          style={{
                            background: method.color,
                            borderColor: method.color,
                          }}
                        >
                          {method.type === "redirect"
                            ? `Proceed to ${method.name}`
                            : method.type === "bank-transfer"
                            ? "I Have Paid"
                            : isStoryPurchase
                              ? "Buy Story"
                              : "Pay Now"}{" "}
                          <ArrowRight size={16} />
                        </button>
                      </motion.form>
                    )}

                    {step === "otp" && (
                      <motion.form key="otp" onSubmit={handleConfirmPayment}>
                        <div
                          style={{
                            textAlign: "center",
                            padding: "20px",
                            background: "var(--color-bg-alt)",
                            borderRadius: "12px",
                            marginBottom: "20px",
                          }}
                        >
                          <Lock
                            size={32}
                            color={method.color}
                            style={{ marginBottom: 12 }}
                          />
                          <p style={{ fontWeight: 700, margin: "0 0 4px" }}>
                            Verification Required
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            {method.instructions || "Enter the 6-digit code sent to your device."}
                          </p>
                        </div>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="● ● ● ● ● ●"
                          value={otp}
                          onChange={(e) =>
                            setOtp(
                              e.target.value.replace(/\D/g, "").slice(0, 6),
                            )
                          }
                          style={{
                            textAlign: "center",
                            fontSize: "24px",
                            letterSpacing: "8px",
                            marginBottom: "20px",
                          }}
                          required
                        />
                        <button
                          type="submit"
                          className="btn btn-lg btn-block"
                          style={{
                            background: method.color,
                            color: "white",
                            border: "none",
                          }}
                        >
                          Authorize Transaction
                        </button>
                      </motion.form>
                    )}

                    {step === "upload" && (
                      <motion.div key="upload" style={{ textAlign: "center" }}>
                        <div
                          style={{
                            padding: "30px",
                            border: "2px dashed var(--color-border)",
                            borderRadius: "12px",
                            background: "var(--color-bg-alt)",
                            cursor: "pointer",
                            marginBottom: "20px",
                          }}
                          onClick={() => fileInputRef.current.click()}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            style={{ display: "none" }}
                            accept="image/*,.pdf"
                          />
                          {proofFile ? (
                            <div>
                              <FileText
                                size={40}
                                color={method.color}
                                style={{ marginBottom: 12 }}
                              />
                              <p
                                style={{
                                  fontSize: "13px",
                                  fontWeight: 700,
                                  margin: 0,
                                }}
                              >
                                {proofFile.name}
                              </p>
                            </div>
                          ) : (
                            <div>
                              <Upload
                                size={40}
                                color="var(--color-text-muted)"
                                style={{ marginBottom: 12 }}
                              />
                              <p
                                style={{
                                  fontSize: "13px",
                                  fontWeight: 700,
                                  margin: 0,
                                }}
                              >
                                Upload Proof of Payment
                              </p>
                            </div>
                          )}
                        </div>
                        <button
                          className="btn btn-primary btn-lg btn-block"
                          disabled={!proofFile || uploading}
                          onClick={handleSubmitProof}
                          style={{
                            background: method.color,
                            borderColor: method.color,
                          }}
                        >
                          {uploading
                            ? "Securing Upload..."
                            : "Submit Verification"}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "20px",
                      marginTop: "24px",
                      opacity: 0.6,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: "10px",
                      }}
                    >
                      <Shield size={12} /> SSL Encrypted
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: "10px",
                      }}
                    >
                      <Lock size={12} /> PCI Compliant
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: "10px",
                      }}
                    >
                      <CheckCircle size={12} /> Secure
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AnimatePresence>
  );
}
