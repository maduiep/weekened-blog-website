require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3001;

// ========================================
// In-Memory Data Stores
// ========================================
const transactions = {};      // transactionId -> { amount, phone, status, method, attempts, createdAt, userId, planId }
const sessions = {};          // sessionId -> { userId, deviceInfo, sessionId, createdAt, lastSeen }
const userSessions = {};      // userId -> sessionId (one active session per user)
const downloadTokens = {};    // token -> { editionId, email, sessionToken, createdAt, used }
const downloadCounts = {};    // `${email}:${editionId}` -> count

// ========================================
// Helpers
// ========================================
const generateId = (prefix = "TXN") =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

const escapePdf = (value) =>
  String(value).replace(/([\\\(\)\n])/g, "\\$1");

const SESSION_TTL_MS = 120 * 1000; // 120 seconds
const DOWNLOAD_TOKEN_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_DOWNLOADS_PER_EDITION = 3;
const MAX_OTP_ATTEMPTS = 3;

// ========================================
// Middleware
// ========================================
app.use(cors());
app.use(bodyParser.json());

// Request logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ========================================
// Health Check
// ========================================
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Weekend Post Backend is running",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    activeSessions: Object.keys(sessions).length,
    pendingTransactions: Object.values(transactions).filter(
      (t) => t.status === "pending"
    ).length,
  });
});

/**
 * Note: Since this React app is a prototype that will eventually
 * be converted to a WordPress website, this backend serves as a
 * functional prototype for payment webhooks and secure e-paper delivery.
 * In production, these would be handled by WordPress (PHP) with
 * real payment gateway SDKs for Botswana providers.
 */

// ========================================
// Orange Money Endpoints
// ========================================

/**
 * Initialize an Orange Money payment via USSD (*145#)
 * Validates phone format (must start with 7 for Botswana Orange numbers)
 */
app.post("/api/payments/orange-money/init", (req, res) => {
  const { amount, phone, userId, planId } = req.body;

  if (!amount || !phone) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields: amount, phone" });
  }

  if (amount <= 0) {
    return res
      .status(400)
      .json({ success: false, error: "Amount must be greater than 0" });
  }

  const cleanPhone = String(phone).replace(/\s+/g, "");
  if (!cleanPhone.startsWith("7") || cleanPhone.length < 8) {
    return res.status(400).json({
      success: false,
      error: "Invalid Orange Money phone number. Must start with 7 (e.g., 7XXXXXXX)",
    });
  }

  const transactionId = generateId("OM");

  transactions[transactionId] = {
    amount,
    phone: cleanPhone,
    status: "pending",
    method: "orange-money",
    attempts: 0,
    createdAt: Date.now(),
    userId: userId || null,
    planId: planId || null,
  };

  console.log(
    `[ORANGE MONEY] Payment initialized: ${transactionId} | P${amount} | Phone: ${cleanPhone}`
  );

  res.json({
    success: true,
    transactionId,
    ussdPrompt: "*145#",
    message: "Please approve payment on your phone via *145#",
    expiresIn: 300,
  });
});

/**
 * Verify Orange Money OTP
 * Limits to 3 attempts per transaction
 */
app.post("/api/payments/orange-money/verify", (req, res) => {
  const { transactionId, otp } = req.body;

  if (!transactionId || !otp) {
    return res
      .status(400)
      .json({ success: false, error: "Missing transactionId or otp" });
  }

  const txn = transactions[transactionId];
  if (!txn) {
    return res
      .status(404)
      .json({ success: false, error: "Transaction not found" });
  }

  if (txn.method !== "orange-money") {
    return res
      .status(400)
      .json({ success: false, error: "Transaction is not an Orange Money payment" });
  }

  if (txn.status === "completed") {
    return res.json({ success: true, message: "Payment already verified" });
  }

  if (txn.attempts >= MAX_OTP_ATTEMPTS) {
    txn.status = "failed";
    return res.status(429).json({
      success: false,
      error: "Maximum OTP attempts exceeded. Transaction cancelled.",
    });
  }

  txn.attempts += 1;

  // Simulate OTP verification — accept any 4-6 digit OTP for prototype
  const isValidOtp = /^\d{4,6}$/.test(otp);

  if (isValidOtp) {
    txn.status = "completed";
    txn.completedAt = Date.now();
    console.log(`[ORANGE MONEY] Payment verified: ${transactionId}`);
    res.json({
      success: true,
      message: "Payment verified successfully",
      transactionId,
      receipt: {
        method: "Orange Money",
        amount: txn.amount,
        phone: txn.phone,
        date: new Date().toISOString(),
        reference: transactionId,
      },
    });
  } else {
    res.status(400).json({
      success: false,
      error: "Invalid OTP format. Please enter 4-6 digits.",
      attemptsRemaining: MAX_OTP_ATTEMPTS - txn.attempts,
    });
  }
});

// ========================================
// DPO Pay (3G Direct Pay) Endpoints
// ========================================

/**
 * Initialize a DPO Pay card payment
 * Returns a redirect URL to DPO's hosted payment page
 */
app.post("/api/payments/dpo-pay/init", (req, res) => {
  const { amount, email, userId, planId, currency } = req.body;

  if (!amount || !email) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields: amount, email" });
  }

  if (amount <= 0) {
    return res
      .status(400)
      .json({ success: false, error: "Amount must be greater than 0" });
  }

  const transactionId = generateId("DPO");

  transactions[transactionId] = {
    amount,
    email,
    status: "pending",
    method: "dpo-pay",
    attempts: 0,
    createdAt: Date.now(),
    userId: userId || null,
    planId: planId || null,
    currency: currency || "BWP",
  };

  console.log(
    `[DPO PAY] Payment initialized: ${transactionId} | P${amount} | Email: ${email}`
  );

  res.json({
    success: true,
    transactionId,
    paymentUrl: `https://secure.3gdirectpay.com/payv3.php?ID=${transactionId}`,
    message: "Redirect to DPO Pay secure checkout",
  });
});

/**
 * Verify DPO Pay card payment completion
 */
app.post("/api/payments/dpo-pay/verify", (req, res) => {
  const { transactionId } = req.body;

  if (!transactionId) {
    return res
      .status(400)
      .json({ success: false, error: "Missing transactionId" });
  }

  const txn = transactions[transactionId];
  if (!txn) {
    return res
      .status(404)
      .json({ success: false, error: "Transaction not found" });
  }

  if (txn.method !== "dpo-pay") {
    return res
      .status(400)
      .json({ success: false, error: "Transaction is not a DPO Pay payment" });
  }

  if (txn.status === "completed") {
    return res.json({ success: true, message: "Payment already verified" });
  }

  // Simulate successful card payment verification
  txn.status = "completed";
  txn.completedAt = Date.now();

  console.log(`[DPO PAY] Payment verified: ${transactionId}`);

  res.json({
    success: true,
    message: "Card payment verified successfully",
    transactionId,
    receipt: {
      method: "DPO Pay (Card)",
      amount: txn.amount,
      currency: txn.currency,
      email: txn.email,
      date: new Date().toISOString(),
      reference: transactionId,
    },
  });
});

// ========================================
// MyZaka (Mascom) Endpoints
// ========================================

/**
 * Initialize a MyZaka mobile money payment
 * Validates Mascom number format (starts with 7 for Botswana)
 */
app.post("/api/payments/myzaka/init", (req, res) => {
  const { amount, phone, userId, planId } = req.body;

  if (!amount || !phone) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields: amount, phone" });
  }

  if (amount <= 0) {
    return res
      .status(400)
      .json({ success: false, error: "Amount must be greater than 0" });
  }

  const cleanPhone = String(phone).replace(/\s+/g, "");
  if (!cleanPhone.startsWith("7") || cleanPhone.length < 8) {
    return res.status(400).json({
      success: false,
      error: "Invalid Mascom number. Must start with 7 (e.g., 7XXXXXXX)",
    });
  }

  const transactionId = generateId("MZK");

  transactions[transactionId] = {
    amount,
    phone: cleanPhone,
    status: "pending",
    method: "myzaka",
    attempts: 0,
    createdAt: Date.now(),
    userId: userId || null,
    planId: planId || null,
  };

  console.log(
    `[MYZAKA] Payment initialized: ${transactionId} | P${amount} | Phone: ${cleanPhone}`
  );

  res.json({
    success: true,
    transactionId,
    ussdPrompt: "*151#",
    message: "Approve via MyZaka menu",
    expiresIn: 300,
  });
});

/**
 * Verify MyZaka OTP
 */
app.post("/api/payments/myzaka/verify", (req, res) => {
  const { transactionId, otp } = req.body;

  if (!transactionId || !otp) {
    return res
      .status(400)
      .json({ success: false, error: "Missing transactionId or otp" });
  }

  const txn = transactions[transactionId];
  if (!txn) {
    return res
      .status(404)
      .json({ success: false, error: "Transaction not found" });
  }

  if (txn.method !== "myzaka") {
    return res
      .status(400)
      .json({ success: false, error: "Transaction is not a MyZaka payment" });
  }

  if (txn.status === "completed") {
    return res.json({ success: true, message: "Payment already verified" });
  }

  if (txn.attempts >= MAX_OTP_ATTEMPTS) {
    txn.status = "failed";
    return res.status(429).json({
      success: false,
      error: "Maximum OTP attempts exceeded. Transaction cancelled.",
    });
  }

  txn.attempts += 1;

  const isValidOtp = /^\d{4,6}$/.test(otp);

  if (isValidOtp) {
    txn.status = "completed";
    txn.completedAt = Date.now();
    console.log(`[MYZAKA] Payment verified: ${transactionId}`);
    res.json({
      success: true,
      message: "MyZaka payment verified successfully",
      transactionId,
      receipt: {
        method: "MyZaka (Mascom)",
        amount: txn.amount,
        phone: txn.phone,
        date: new Date().toISOString(),
        reference: transactionId,
      },
    });
  } else {
    res.status(400).json({
      success: false,
      error: "Invalid OTP format. Please enter 4-6 digits.",
      attemptsRemaining: MAX_OTP_ATTEMPTS - txn.attempts,
    });
  }
});

// ========================================
// Smega (BTC) Endpoints
// ========================================

/**
 * Initialize a Smega/BTC mobile payment
 */
app.post("/api/payments/smega/init", (req, res) => {
  const { amount, phone, userId, planId } = req.body;

  if (!amount || !phone) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields: amount, phone" });
  }

  if (amount <= 0) {
    return res
      .status(400)
      .json({ success: false, error: "Amount must be greater than 0" });
  }

  const cleanPhone = String(phone).replace(/\s+/g, "");

  const transactionId = generateId("SMG");

  transactions[transactionId] = {
    amount,
    phone: cleanPhone,
    status: "pending",
    method: "smega",
    attempts: 0,
    createdAt: Date.now(),
    userId: userId || null,
    planId: planId || null,
  };

  console.log(
    `[SMEGA] Payment initialized: ${transactionId} | P${amount} | Phone: ${cleanPhone}`
  );

  res.json({
    success: true,
    transactionId,
    ussdPrompt: "*173#",
    message: "Dial *173# on your BTC line to approve payment",
    expiresIn: 300,
  });
});

/**
 * Verify Smega OTP
 */
app.post("/api/payments/smega/verify", (req, res) => {
  const { transactionId, otp } = req.body;

  if (!transactionId || !otp) {
    return res
      .status(400)
      .json({ success: false, error: "Missing transactionId or otp" });
  }

  const txn = transactions[transactionId];
  if (!txn) {
    return res
      .status(404)
      .json({ success: false, error: "Transaction not found" });
  }

  if (txn.method !== "smega") {
    return res
      .status(400)
      .json({ success: false, error: "Transaction is not a Smega payment" });
  }

  if (txn.status === "completed") {
    return res.json({ success: true, message: "Payment already verified" });
  }

  if (txn.attempts >= MAX_OTP_ATTEMPTS) {
    txn.status = "failed";
    return res.status(429).json({
      success: false,
      error: "Maximum OTP attempts exceeded. Transaction cancelled.",
    });
  }

  txn.attempts += 1;

  const isValidOtp = /^\d{4,6}$/.test(otp);

  if (isValidOtp) {
    txn.status = "completed";
    txn.completedAt = Date.now();
    console.log(`[SMEGA] Payment verified: ${transactionId}`);
    res.json({
      success: true,
      message: "Smega payment verified successfully",
      transactionId,
      receipt: {
        method: "Smega (BTC)",
        amount: txn.amount,
        phone: txn.phone,
        date: new Date().toISOString(),
        reference: transactionId,
      },
    });
  } else {
    res.status(400).json({
      success: false,
      error: "Invalid OTP format. Please enter 4-6 digits.",
      attemptsRemaining: MAX_OTP_ATTEMPTS - txn.attempts,
    });
  }
});

// ========================================
// Bank Transfer Endpoints
// ========================================

/**
 * Initialize a bank transfer payment
 * Returns bank details and a unique reference number
 */
app.post("/api/payments/bank-transfer/init", (req, res) => {
  const { amount, email, userId, planId } = req.body;

  if (!amount || !email) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields: amount, email" });
  }

  if (amount <= 0) {
    return res
      .status(400)
      .json({ success: false, error: "Amount must be greater than 0" });
  }

  const transactionId = generateId("BNK");
  const referenceNumber = `WP-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .substr(2, 4)
    .toUpperCase()}`;

  transactions[transactionId] = {
    amount,
    email,
    status: "pending",
    method: "bank-transfer",
    attempts: 0,
    createdAt: Date.now(),
    userId: userId || null,
    planId: planId || null,
    referenceNumber,
    proofUploaded: false,
  };

  console.log(
    `[BANK TRANSFER] Initialized: ${transactionId} | P${amount} | Ref: ${referenceNumber}`
  );

  res.json({
    success: true,
    transactionId,
    referenceNumber,
    bankDetails: {
      bankName: "First National Bank Botswana",
      accountName: "Weekend Post (Pty) Ltd",
      accountNumber: "62012345678",
      branchCode: "281067",
      swiftCode: "FIABORON",
      currency: "BWP",
    },
    instructions: [
      `Transfer P${amount} to the account details above`,
      `Use reference number: ${referenceNumber}`,
      "Upload proof of payment after transfer",
      "Processing takes 1-2 business days",
    ],
    message: "Bank details generated. Please complete the transfer and upload proof.",
  });
});

/**
 * Upload proof of payment for bank transfer
 */
app.post("/api/payments/bank-transfer/upload-proof", (req, res) => {
  const { transactionId, proofData, fileName } = req.body;

  if (!transactionId) {
    return res
      .status(400)
      .json({ success: false, error: "Missing transactionId" });
  }

  const txn = transactions[transactionId];
  if (!txn) {
    return res
      .status(404)
      .json({ success: false, error: "Transaction not found" });
  }

  if (txn.method !== "bank-transfer") {
    return res
      .status(400)
      .json({ success: false, error: "Transaction is not a bank transfer" });
  }

  // Simulate receiving the proof of payment
  txn.proofUploaded = true;
  txn.proofFileName = fileName || "proof_of_payment.pdf";
  txn.proofUploadedAt = Date.now();
  txn.status = "pending_verification";

  console.log(
    `[BANK TRANSFER] Proof uploaded for ${transactionId}: ${txn.proofFileName}`
  );

  res.json({
    success: true,
    message:
      "Proof of payment received. Your subscription will be activated within 1-2 business days after verification.",
    transactionId,
    status: txn.status,
  });
});

// ========================================
// Universal Payment Status
// ========================================

/**
 * Check any payment status by transactionId
 */
app.get("/api/payments/status/:transactionId", (req, res) => {
  const { transactionId } = req.params;

  const txn = transactions[transactionId];
  if (!txn) {
    return res
      .status(404)
      .json({ success: false, error: "Transaction not found" });
  }

  // Check if transaction has expired (older than 30 minutes and still pending)
  const ageMs = Date.now() - txn.createdAt;
  if (txn.status === "pending" && ageMs > 30 * 60 * 1000) {
    txn.status = "expired";
  }

  res.json({
    success: true,
    transactionId,
    status: txn.status,
    method: txn.method,
    amount: txn.amount,
    createdAt: new Date(txn.createdAt).toISOString(),
    completedAt: txn.completedAt
      ? new Date(txn.completedAt).toISOString()
      : null,
    age: Math.round(ageMs / 1000),
  });
});

// ========================================
// Payment Webhooks
// ========================================

/**
 * Orange Money webhook — receives payment notifications
 */
app.post("/api/webhooks/orange-money", (req, res) => {
  const { transactionId, status, amount, phone } = req.body;

  console.log(
    `[ORANGE MONEY WEBHOOK] Received: ${transactionId} | Status: ${status}`
  );

  if (transactionId && transactions[transactionId]) {
    const txn = transactions[transactionId];
    if (status === "SUCCESS" || status === "SUCCESSFUL") {
      txn.status = "completed";
      txn.completedAt = Date.now();
      console.log(`[ORANGE MONEY WEBHOOK] Payment confirmed: ${transactionId}`);
    } else if (status === "FAILED" || status === "CANCELLED") {
      txn.status = "failed";
      console.log(`[ORANGE MONEY WEBHOOK] Payment failed: ${transactionId}`);
    }
  }

  res.status(200).json({ received: true, message: "Webhook processed" });
});

/**
 * DPO Pay webhook — receives card payment notifications
 */
app.post("/api/webhooks/dpo-pay", (req, res) => {
  const { TransactionToken, Result, ResultExplanation, TransactionRef } =
    req.body;

  console.log(
    `[DPO PAY WEBHOOK] Received: ${TransactionToken || TransactionRef} | Result: ${Result}`
  );

  // Try to find the transaction by token or ref
  const txnId = TransactionToken || TransactionRef;
  if (txnId && transactions[txnId]) {
    const txn = transactions[txnId];
    if (Result === "000" || Result === "0") {
      txn.status = "completed";
      txn.completedAt = Date.now();
      console.log(`[DPO PAY WEBHOOK] Payment confirmed: ${txnId}`);
    } else {
      txn.status = "failed";
      txn.failureReason = ResultExplanation || "Unknown";
      console.log(
        `[DPO PAY WEBHOOK] Payment failed: ${txnId} — ${ResultExplanation}`
      );
    }
  }

  res.status(200).json({ received: true, message: "DPO webhook processed" });
});

/**
 * MyZaka webhook — receives mobile money notifications
 */
app.post("/api/webhooks/myzaka", (req, res) => {
  const { transactionId, status, amount, msisdn } = req.body;

  console.log(
    `[MYZAKA WEBHOOK] Received: ${transactionId} | Status: ${status}`
  );

  if (transactionId && transactions[transactionId]) {
    const txn = transactions[transactionId];
    if (status === "SUCCESS" || status === "APPROVED") {
      txn.status = "completed";
      txn.completedAt = Date.now();
      console.log(`[MYZAKA WEBHOOK] Payment confirmed: ${transactionId}`);
    } else {
      txn.status = "failed";
      console.log(`[MYZAKA WEBHOOK] Payment failed: ${transactionId}`);
    }
  }

  res.status(200).json({ received: true, message: "MyZaka webhook processed" });
});

/**
 * Smega webhook — receives BTC mobile money notifications
 */
app.post("/api/webhooks/smega", (req, res) => {
  const { transactionId, status, amount } = req.body;

  console.log(
    `[SMEGA WEBHOOK] Received: ${transactionId} | Status: ${status}`
  );

  if (transactionId && transactions[transactionId]) {
    const txn = transactions[transactionId];
    if (status === "SUCCESS" || status === "COMPLETED") {
      txn.status = "completed";
      txn.completedAt = Date.now();
      console.log(`[SMEGA WEBHOOK] Payment confirmed: ${transactionId}`);
    } else {
      txn.status = "failed";
      console.log(`[SMEGA WEBHOOK] Payment failed: ${transactionId}`);
    }
  }

  res.status(200).json({ received: true, message: "Smega webhook processed" });
});

// ========================================
// Session Management (Single-Device Login)
// ========================================

/**
 * Create a new session for a user
 * Invalidates any existing session for this userId (single-device enforcement)
 */
app.post("/api/sessions/create", (req, res) => {
  const { userId, deviceInfo, sessionId } = req.body;

  if (!userId || !sessionId) {
    return res
      .status(400)
      .json({ success: false, error: "Missing userId or sessionId" });
  }

  // Invalidate existing session for this user (single-device enforcement)
  const existingSessionId = userSessions[userId];
  let previousSessionRevoked = false;
  if (existingSessionId && sessions[existingSessionId]) {
    console.log(
      `[SESSION] Revoking existing session ${existingSessionId} for user ${userId}`
    );
    delete sessions[existingSessionId];
    previousSessionRevoked = true;
  }

  // Create the new session
  const now = Date.now();
  sessions[sessionId] = {
    userId,
    deviceInfo: deviceInfo || { userAgent: "unknown" },
    sessionId,
    createdAt: now,
    lastSeen: now,
  };
  userSessions[userId] = sessionId;

  console.log(
    `[SESSION] Created session ${sessionId} for user ${userId}${
      previousSessionRevoked ? " (previous session revoked)" : ""
    }`
  );

  res.json({
    success: true,
    sessionId,
    message: previousSessionRevoked
      ? "Session created. Previous session on another device has been revoked."
      : "Session created successfully.",
    previousSessionRevoked,
  });
});

/**
 * Heartbeat — keep a session alive
 * Must be called within SESSION_TTL_MS to prevent auto-expiry
 */
app.post("/api/sessions/heartbeat", (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res
      .status(400)
      .json({ success: false, error: "Missing sessionId" });
  }

  const session = sessions[sessionId];
  if (!session) {
    return res
      .status(404)
      .json({ success: false, error: "Session not found or expired" });
  }

  // Check if this is still the active session for the user
  if (userSessions[session.userId] !== sessionId) {
    delete sessions[sessionId];
    return res.status(403).json({
      success: false,
      error: "Session has been superseded by a login on another device",
      code: "SESSION_SUPERSEDED",
    });
  }

  session.lastSeen = Date.now();

  res.json({
    success: true,
    message: "Heartbeat received",
    sessionId,
    ttl: SESSION_TTL_MS / 1000,
  });
});

/**
 * Validate a session — check if it's still active
 * Auto-expires sessions that haven't sent a heartbeat within SESSION_TTL_MS
 */
app.get("/api/sessions/validate/:sessionId", (req, res) => {
  const { sessionId } = req.params;

  const session = sessions[sessionId];
  if (!session) {
    return res.json({
      success: true,
      valid: false,
      reason: "Session not found",
    });
  }

  // Check if session has expired due to heartbeat timeout
  const timeSinceLastSeen = Date.now() - session.lastSeen;
  if (timeSinceLastSeen > SESSION_TTL_MS) {
    console.log(
      `[SESSION] Auto-expired session ${sessionId} for user ${session.userId} (${Math.round(
        timeSinceLastSeen / 1000
      )}s since last heartbeat)`
    );
    delete sessions[sessionId];
    if (userSessions[session.userId] === sessionId) {
      delete userSessions[session.userId];
    }
    return res.json({
      success: true,
      valid: false,
      reason: "Session expired due to inactivity",
    });
  }

  // Check if this is still the active session for the user
  if (userSessions[session.userId] !== sessionId) {
    delete sessions[sessionId];
    return res.json({
      success: true,
      valid: false,
      reason: "Session superseded by another device",
    });
  }

  res.json({
    success: true,
    valid: true,
    session: {
      userId: session.userId,
      createdAt: new Date(session.createdAt).toISOString(),
      lastSeen: new Date(session.lastSeen).toISOString(),
      deviceInfo: session.deviceInfo,
    },
  });
});

/**
 * Revoke all sessions for a user (admin force-logout)
 */
app.post("/api/sessions/revoke/:userId", (req, res) => {
  const { userId } = req.params;

  const activeSessionId = userSessions[userId];
  if (!activeSessionId) {
    return res.json({
      success: true,
      message: "No active session found for this user",
    });
  }

  delete sessions[activeSessionId];
  delete userSessions[userId];

  console.log(
    `[SESSION] Admin revoked session ${activeSessionId} for user ${userId}`
  );

  res.json({
    success: true,
    message: `Session revoked for user ${userId}`,
    revokedSessionId: activeSessionId,
  });
});

// ========================================
// E-Paper DRM & Download
// ========================================

/**
 * Request a download token for an e-paper edition
 * Enforces max downloads per user per edition
 */
app.post("/api/epaper/request-download/:editionId", (req, res) => {
  const { editionId } = req.params;
  const { sessionToken, email } = req.body;

  if (!sessionToken || !editionId) {
    return res
      .status(400)
      .json({ success: false, error: "Missing session token or edition ID." });
  }

  if (!email) {
    return res
      .status(400)
      .json({ success: false, error: "Missing email for watermark attribution." });
  }

  // Check download count for this user + edition
  const countKey = `${email}:${editionId}`;
  const currentCount = downloadCounts[countKey] || 0;

  if (currentCount >= MAX_DOWNLOADS_PER_EDITION) {
    return res.status(429).json({
      success: false,
      error: `Download limit reached. Maximum ${MAX_DOWNLOADS_PER_EDITION} downloads per edition.`,
      downloadsUsed: currentCount,
      maxDownloads: MAX_DOWNLOADS_PER_EDITION,
    });
  }

  const downloadToken = generateId("DL");

  downloadTokens[downloadToken] = {
    editionId,
    email,
    sessionToken,
    createdAt: Date.now(),
    used: false,
  };

  console.log(
    `[E-PAPER] Download token generated: ${downloadToken} for ${email} (edition ${editionId}, download ${
      currentCount + 1
    }/${MAX_DOWNLOADS_PER_EDITION})`
  );

  res.json({
    success: true,
    downloadToken,
    expiresIn: DOWNLOAD_TOKEN_TTL_MS / 1000,
    downloadsRemaining: MAX_DOWNLOADS_PER_EDITION - currentCount - 1,
  });
});

/**
 * Download e-paper PDF with full DRM watermarking
 * Generates a multi-page PDF with:
 *   - Full-page watermark: "LICENSED TO [email]"
 *   - Unique document ID
 *   - Footer with redistribution warning
 *   - Token expiry after 5 minutes
 */
app.get("/api/epaper/download/:editionId", (req, res) => {
  const { editionId } = req.params;
  const { token, sessionToken } = req.query;

  if (!token || !sessionToken) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized. Valid subscription required." });
  }

  const record = downloadTokens[token];
  if (!record) {
    return res
      .status(403)
      .json({ success: false, error: "Invalid download token." });
  }

  if (record.editionId !== editionId || record.sessionToken !== sessionToken) {
    return res
      .status(403)
      .json({ success: false, error: "Token mismatch. Access denied." });
  }

  // Check token expiry (5 minutes)
  if (Date.now() - record.createdAt > DOWNLOAD_TOKEN_TTL_MS) {
    delete downloadTokens[token];
    return res.status(410).json({
      success: false,
      error: "Download token has expired. Please request a new one.",
    });
  }

  if (record.used) {
    return res
      .status(410)
      .json({ success: false, error: "Download token has already been used." });
  }

  // Mark token as used and increment download count
  record.used = true;
  const countKey = `${record.email}:${editionId}`;
  downloadCounts[countKey] = (downloadCounts[countKey] || 0) + 1;

  // Generate the watermarked multi-page PDF
  const documentId = generateId("DOC");
  const userEmail = record.email;
  const generatedDate = new Date().toISOString();

  // PDF content for multiple pages
  const pageCount = 3;
  const pageWidth = 612;
  const pageHeight = 792;

  // Watermark text lines
  const watermarkLine1 = `LICENSED TO ${userEmail}`;
  const watermarkLine2 = `Document ID: ${documentId}`;
  const redistributionWarning =
    "CONFIDENTIAL - Unauthorized redistribution is strictly prohibited and may result in legal action.";

  // Page content descriptions
  const pageContents = [
    {
      title: `Weekend Post E-Paper - Edition ${editionId}`,
      body: `Digital Edition | Generated: ${generatedDate}`,
      section: "FRONT PAGE",
    },
    {
      title: "Weekend Post - News & Analysis",
      body: "Premium subscriber content. Full articles and market intelligence.",
      section: "NEWS SECTION",
    },
    {
      title: "Weekend Post - Business & Markets",
      body: "BSE market data, commodity prices, and financial analysis for Botswana.",
      section: "BUSINESS SECTION",
    },
  ];

  // Build PDF objects
  // Object numbering: 1=Catalog, 2=Pages, 3=Font
  // Then for each page: PageObj, ContentObj
  // Page objects start at 4, so page i has:
  //   Page object = 4 + i*2
  //   Content object = 5 + i*2
  const totalObjects = 3 + pageCount * 2; // catalog + pages + font + (page + content) per page

  // Build content streams for each page
  const contentStreams = [];
  for (let i = 0; i < pageCount; i++) {
    const pc = pageContents[i];
    const lines = [
      // Diagonal watermark (light gray, rotated)
      "q",
      "0.92 0.92 0.92 rg",
      `1 0 0.4 1 50 200 cm`,
      `BT /F1 36 Tf 0 0 Td (${escapePdf(watermarkLine1)}) Tj ET`,
      "Q",
      // Second diagonal watermark line
      "q",
      "0.92 0.92 0.92 rg",
      `1 0 0.4 1 50 140 cm`,
      `BT /F1 14 Tf 0 0 Td (${escapePdf(watermarkLine2)}) Tj ET`,
      "Q",
      // Section header
      `BT /F1 10 Tf 0.6 0.6 0.6 rg 50 770 Td (${escapePdf(
        pc.section
      )} | Page ${i + 1} of ${pageCount}) Tj ET`,
      // Horizontal rule
      "q 0.8 0.8 0.8 RG 1 w 50 760 m 562 760 l S Q",
      // Title
      `BT /F1 24 Tf 0 0 0 rg 50 720 Td (${escapePdf(pc.title)}) Tj ET`,
      // Body text
      `BT /F1 12 Tf 0.2 0.2 0.2 rg 50 690 Td (${escapePdf(pc.body)}) Tj ET`,
      // Licensed-to line
      `BT /F1 10 Tf 0.5 0.5 0.5 rg 50 650 Td (Licensed to: ${escapePdf(
        userEmail
      )}) Tj ET`,
      // Footer rule
      "q 0.8 0.8 0.8 RG 1 w 50 40 m 562 40 l S Q",
      // Footer warning
      `BT /F1 7 Tf 0.6 0.0 0.0 rg 50 28 Td (${escapePdf(
        redistributionWarning
      )}) Tj ET`,
      // Footer document ID
      `BT /F1 7 Tf 0.5 0.5 0.5 rg 50 18 Td (${escapePdf(documentId)} | ${escapePdf(
        generatedDate
      )}) Tj ET`,
    ];
    contentStreams.push(lines.join("\n"));
  }

  // Build PDF object strings
  const pageObjNumbers = [];
  for (let i = 0; i < pageCount; i++) {
    pageObjNumbers.push(4 + i * 2);
  }

  const pdfObjects = [];

  // 1: Catalog
  pdfObjects.push(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);

  // 2: Pages
  const kidsStr = pageObjNumbers.map((n) => `${n} 0 R`).join(" ");
  pdfObjects.push(
    `2 0 obj\n<< /Type /Pages /Kids [${kidsStr}] /Count ${pageCount} >>\nendobj\n`
  );

  // 3: Font
  pdfObjects.push(
    `3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`
  );

  // Page + Content objects
  for (let i = 0; i < pageCount; i++) {
    const pageObjNum = 4 + i * 2;
    const contentObjNum = 5 + i * 2;
    const streamContent = contentStreams[i];
    const streamLength = Buffer.byteLength(streamContent, "utf8");

    // Page object
    pdfObjects.push(
      `${pageObjNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${contentObjNum} 0 R /Resources << /Font << /F1 3 0 R >> >> >>\nendobj\n`
    );

    // Content stream object
    pdfObjects.push(
      `${contentObjNum} 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`
    );
  }

  // Build the complete PDF
  const header = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  let offset = Buffer.byteLength(header, "utf8");
  const xrefEntries = [
    "xref",
    `0 ${totalObjects + 1}`,
    "0000000000 65535 f ",
  ];

  for (const obj of pdfObjects) {
    xrefEntries.push(`${String(offset).padStart(10, "0")} 00000 n `);
    offset += Buffer.byteLength(obj, "utf8");
  }

  const xrefContent = xrefEntries.join("\n") + "\n";
  const trailerContent = `trailer\n<< /Size ${
    totalObjects + 1
  } /Root 1 0 R >>\nstartxref\n${offset}\n%%EOF`;

  const pdfBuffer = Buffer.concat([
    Buffer.from(header, "utf8"),
    ...pdfObjects.map((o) => Buffer.from(o, "utf8")),
    Buffer.from(xrefContent, "utf8"),
    Buffer.from(trailerContent, "utf8"),
  ]);

  console.log(
    `[E-PAPER] Serving watermarked PDF: edition ${editionId} | ${userEmail} | Doc: ${documentId} | ${pageCount} pages`
  );

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="weekendpost_epaper_${editionId}.pdf"`
  );
  res.setHeader("X-Document-Id", documentId);
  res.setHeader("X-Licensed-To", userEmail);
  res.send(pdfBuffer);
});

// ========================================
// Integration Status
// ========================================

/**
 * Return the status of all available payment and service integrations
 */
app.get("/api/integrations/status", (req, res) => {
  res.json({
    success: true,
    integrations: [
      {
        name: "Orange Money",
        code: "orange-money",
        status: "active",
        type: "mobile_money",
        ussdCode: "*145#",
        description: "Orange Botswana mobile money",
      },
      {
        name: "DPO Pay",
        code: "dpo-pay",
        status: "active",
        type: "card",
        description: "3G Direct Pay — Visa/Mastercard payments",
      },
      {
        name: "MyZaka",
        code: "myzaka",
        status: "active",
        type: "mobile_money",
        ussdCode: "*151#",
        description: "Mascom MyZaka mobile money",
      },
      {
        name: "Smega",
        code: "smega",
        status: "active",
        type: "mobile_money",
        ussdCode: "*173#",
        description: "BTC Smega mobile money",
      },
      {
        name: "Bank Transfer",
        code: "bank-transfer",
        status: "active",
        type: "bank",
        description: "FNB Botswana direct bank transfer",
      },
      {
        name: "Session Management",
        code: "sessions",
        status: "active",
        type: "security",
        description: "Single-device login enforcement with heartbeat",
      },
      {
        name: "E-Paper DRM",
        code: "epaper-drm",
        status: "active",
        type: "content",
        description: "Watermarked PDF delivery with download limits",
      },
    ],
    message: "All integrations operational",
  });
});

// ========================================
// Report Generation
// ========================================

/**
 * Generate a sample market intelligence PDF report
 */
app.post("/api/reports/generate", (req, res) => {
  const { title, type } = req.body;

  const reportId = generateId("RPT");
  const reportTitle = title || "Weekend Post Market Intelligence Report";
  const reportDate = new Date().toISOString();

  // Build a multi-page report PDF
  const pageWidth = 612;
  const pageHeight = 792;

  const reportPages = [
    {
      section: "COVER",
      lines: [
        `BT /F1 28 Tf 0 0 0 rg 50 650 Td (${escapePdf(reportTitle)}) Tj ET`,
        `BT /F1 14 Tf 0.4 0.4 0.4 rg 50 610 Td (Generated: ${escapePdf(
          reportDate
        )}) Tj ET`,
        `BT /F1 14 Tf 0.4 0.4 0.4 rg 50 585 Td (Report ID: ${escapePdf(
          reportId
        )}) Tj ET`,
        `BT /F1 12 Tf 0 0 0 rg 50 540 Td (Weekend Post \\(Pty\\) Ltd) Tj ET`,
        `BT /F1 12 Tf 0.3 0.3 0.3 rg 50 520 Td (Gaborone, Botswana) Tj ET`,
        "q 0.2 0.4 0.7 RG 2 w 50 500 m 562 500 l S Q",
        `BT /F1 10 Tf 0.5 0.5 0.5 rg 50 480 Td (CONFIDENTIAL - For authorized subscribers only) Tj ET`,
      ],
    },
    {
      section: "MARKET OVERVIEW",
      lines: [
        `BT /F1 20 Tf 0 0 0 rg 50 740 Td (Market Overview - Botswana) Tj ET`,
        "q 0.2 0.4 0.7 RG 1 w 50 730 m 562 730 l S Q",
        `BT /F1 12 Tf 0.2 0.2 0.2 rg 50 700 Td (BSE Domestic Company Index: 7,245.32 \\(+1.2%\\)) Tj ET`,
        `BT /F1 12 Tf 0.2 0.2 0.2 rg 50 680 Td (BSE Foreign Company Index: 1,534.18 \\(-0.3%\\)) Tj ET`,
        `BT /F1 12 Tf 0.2 0.2 0.2 rg 50 660 Td (BWP/USD Exchange Rate: 13.52) Tj ET`,
        `BT /F1 12 Tf 0.2 0.2 0.2 rg 50 640 Td (BWP/ZAR Exchange Rate: 1.35) Tj ET`,
        `BT /F1 12 Tf 0.2 0.2 0.2 rg 50 620 Td (Inflation Rate: 3.2% \\(within BoB target range\\)) Tj ET`,
        `BT /F1 12 Tf 0.2 0.2 0.2 rg 50 580 Td (Key Sectors: Mining, Tourism, Financial Services, Agriculture) Tj ET`,
        `BT /F1 10 Tf 0.5 0.5 0.5 rg 50 28 Td (${escapePdf(reportId)} | ${escapePdf(reportDate)}) Tj ET`,
      ],
    },
  ];

  const pageCount = reportPages.length;
  const totalObjects = 3 + pageCount * 2;

  const contentStreams = reportPages.map((page) => page.lines.join("\n"));

  const pdfObjects = [];

  // Catalog
  pdfObjects.push(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);

  // Pages
  const pageObjNums = [];
  for (let i = 0; i < pageCount; i++) {
    pageObjNums.push(4 + i * 2);
  }
  pdfObjects.push(
    `2 0 obj\n<< /Type /Pages /Kids [${pageObjNums
      .map((n) => `${n} 0 R`)
      .join(" ")}] /Count ${pageCount} >>\nendobj\n`
  );

  // Font
  pdfObjects.push(
    `3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`
  );

  // Page + Content per page
  for (let i = 0; i < pageCount; i++) {
    const pageObjNum = 4 + i * 2;
    const contentObjNum = 5 + i * 2;
    const stream = contentStreams[i];
    const streamLen = Buffer.byteLength(stream, "utf8");

    pdfObjects.push(
      `${pageObjNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${contentObjNum} 0 R /Resources << /Font << /F1 3 0 R >> >> >>\nendobj\n`
    );
    pdfObjects.push(
      `${contentObjNum} 0 obj\n<< /Length ${streamLen} >>\nstream\n${stream}\nendstream\nendobj\n`
    );
  }

  // Assemble PDF
  const header = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  let offset = Buffer.byteLength(header, "utf8");
  const xrefEntries = [
    "xref",
    `0 ${totalObjects + 1}`,
    "0000000000 65535 f ",
  ];

  for (const obj of pdfObjects) {
    xrefEntries.push(`${String(offset).padStart(10, "0")} 00000 n `);
    offset += Buffer.byteLength(obj, "utf8");
  }

  const xrefContent = xrefEntries.join("\n") + "\n";
  const trailerContent = `trailer\n<< /Size ${
    totalObjects + 1
  } /Root 1 0 R >>\nstartxref\n${offset}\n%%EOF`;

  const pdfBuffer = Buffer.concat([
    Buffer.from(header, "utf8"),
    ...pdfObjects.map((o) => Buffer.from(o, "utf8")),
    Buffer.from(xrefContent, "utf8"),
    Buffer.from(trailerContent, "utf8"),
  ]);

  console.log(`[REPORT] Generated report ${reportId}: ${reportTitle}`);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="weekendpost_report_${reportId}.pdf"`
  );
  res.setHeader("X-Report-Id", reportId);
  res.send(pdfBuffer);
});

// ========================================
// Catch-all for undefined routes
// ========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    availableEndpoints: {
      health: "GET /api/health",
      payments: {
        orangeMoney: {
          init: "POST /api/payments/orange-money/init",
          verify: "POST /api/payments/orange-money/verify",
        },
        dpoPay: {
          init: "POST /api/payments/dpo-pay/init",
          verify: "POST /api/payments/dpo-pay/verify",
        },
        myzaka: {
          init: "POST /api/payments/myzaka/init",
          verify: "POST /api/payments/myzaka/verify",
        },
        smega: {
          init: "POST /api/payments/smega/init",
          verify: "POST /api/payments/smega/verify",
        },
        bankTransfer: {
          init: "POST /api/payments/bank-transfer/init",
          uploadProof: "POST /api/payments/bank-transfer/upload-proof",
        },
        status: "GET /api/payments/status/:transactionId",
      },
      webhooks: {
        orangeMoney: "POST /api/webhooks/orange-money",
        dpoPay: "POST /api/webhooks/dpo-pay",
        myzaka: "POST /api/webhooks/myzaka",
        smega: "POST /api/webhooks/smega",
      },
      sessions: {
        create: "POST /api/sessions/create",
        heartbeat: "POST /api/sessions/heartbeat",
        validate: "GET /api/sessions/validate/:sessionId",
        revoke: "POST /api/sessions/revoke/:userId",
      },
      epaper: {
        requestDownload: "POST /api/epaper/request-download/:editionId",
        download: "GET /api/epaper/download/:editionId",
      },
      integrations: "GET /api/integrations/status",
      reports: "POST /api/reports/generate",
    },
  });
});

// ========================================
// Start Server
// ========================================
app.listen(PORT, () => {
  console.log(
    `Weekend Post Backend running on http://localhost:${PORT}`
  );
  console.log(
    `Note: This is a Node.js prototype intended to demonstrate logic before WordPress conversion.`
  );
  console.log(`Available payment gateways: Orange Money, DPO Pay, MyZaka, Smega, Bank Transfer`);
  console.log(`Session TTL: ${SESSION_TTL_MS / 1000}s | Max downloads per edition: ${MAX_DOWNLOADS_PER_EDITION}`);
});
