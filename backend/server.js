require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3001;

const downloadTokenStore = {};

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Basic health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Weekend Post Backend is running" });
});

/**
 * Note: Since this React app is a prototype that will eventually
 * be converted to a WordPress website, this backend serves as a
 * functional prototype for payment webhooks and secure e-book delivery.
 * In production, these would be handled by WordPress (PHP).
 */

// ========================================
// Payment Webhooks & Endpoints
// ========================================

/**
 * Mock endpoint to initiate a Stripe PaymentIntent
 */
app.post("/api/payments/stripe/init", (req, res) => {
  const { amount, currency, plan, email } = req.body;

  if (!amount || !currency) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // In a real scenario, this would call the Stripe API to create a PaymentIntent
  // For the prototype, we return a mock client secret
  const clientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`;

  res.json({
    success: true,
    clientSecret,
    publishableKey: "pk_test_mock_key",
  });
});

/**
 * Mock endpoint to simulate Stripe webhooks
 * Stripe sends back the payment event to this endpoint
 */
app.post("/api/webhooks/stripe", (req, res) => {
  // Extract event details from Stripe
  const { id, type, data } = req.body;

  console.log(`[STRIPE WEBHOOK] Received event: ${type}, ID: ${id}`);

  if (type === "payment_intent.succeeded") {
    // 1. Verify event with Stripe
    // 2. Update user subscription status in DB
    // 3. Grant access or trigger e-book download email
    console.log("[STRIPE WEBHOOK] Payment successful!");
  } else {
    console.log("[STRIPE WEBHOOK] Payment event handled: " + type);
  }

  res.status(200).json({ received: true });
});

/**
 * Mock endpoint to initiate an Orange Money payment
 */
app.post("/api/payments/orange/init", (req, res) => {
  const { amount, phone } = req.body;

  if (!amount || !phone) {
    return res.status(400).json({ error: "Missing amount or phone number" });
  }

  // In a real scenario, this would call Orange Money API to trigger USSD/OTP push to user
  const orderId = `OM_ORDER_${Date.now()}`;

  res.json({
    success: true,
    orderId,
    message: "OTP request initiated. Please check your phone.",
  });
});

/**
 * Mock endpoint where Orange Money sends completed transaction notifications
 */
app.post("/api/webhooks/orange", (req, res) => {
  const { orderId, status, txnid } = req.body;

  console.log(
    `[ORANGE WEBHOOK] Received for order: ${orderId}, Status: ${status}`,
  );

  if (status === "SUCCESS") {
    // Handle successful mobile payment
    // Update DB, grant access, etc.
    console.log("[ORANGE WEBHOOK] Payment successful!");
  } else {
    console.log("[ORANGE WEBHOOK] Payment failed/cancelled.");
  }

  // Orange Money typically requires a specific response format
  res.status(200).json({ message: "Notification received successfully" });
});

/**
 * Mock endpoint to initiate a Betway payment flow
 */
app.post("/api/payments/betway/init", (req, res) => {
  const { amount, reference, phone } = req.body;

  if (!amount || !reference || !phone) {
    return res
      .status(400)
      .json({ error: "Missing amount, reference, or phone number" });
  }

  const paymentSession = `BETWAY_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  res.json({
    success: true,
    paymentSession,
    message:
      "Betway payment initialized. Please confirm via your Betway account.",
  });
});

/**
 * Mock endpoint where Betway sends transaction notifications
 */
app.post("/api/webhooks/betway", (req, res) => {
  const { transactionId, status, reference } = req.body;
  console.log(
    `[BETWAY WEBHOOK] Received reference: ${reference}, status: ${status}`,
  );
  if (status === "SUCCESS") {
    console.log("[BETWAY WEBHOOK] Payment successful!");
  }
  res.status(200).json({ message: "Betway webhook received" });
});

// ========================================
// E-Book Delivery
// ========================================

/**
 * Secure E-book download endpoint
 * In production, you'd check authentication and payment status here
 * before serving the PDF file.
 */
app.get("/api/ebooks/download/:editionId", (req, res) => {
  const { editionId } = req.params;
  const { token } = req.query; // e.g., a short-lived download token from payment

  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized. Valid subscription required." });
  }

  const isValidSubscription = true;
  if (isValidSubscription) {
    console.log(`[E-BOOK] Serving edition ${editionId} to subscriber.`);
    res.json({ success: true, message: "Mock download started" });
  } else {
    return res.status(403).json({ error: "Subscription expired or invalid." });
  }
});

app.post("/api/epaper/request-download/:editionId", (req, res) => {
  const { editionId } = req.params;
  const { sessionToken, email } = req.body;

  if (!sessionToken || !editionId) {
    return res
      .status(400)
      .json({ error: "Missing session token or edition ID." });
  }

  const downloadToken = `DOWNLOAD_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 10)}`;

  downloadTokenStore[downloadToken] = {
    editionId,
    sessionToken,
    email: email || "Premium Subscriber",
    createdAt: Date.now(),
  };

  res.json({ success: true, downloadToken });
});

app.get("/api/epaper/download/:editionId", (req, res) => {
  const { editionId } = req.params;
  const { token, sessionToken } = req.query;

  if (!token || !sessionToken) {
    return res
      .status(401)
      .json({ error: "Unauthorized. Valid subscription required." });
  }

  const record = downloadTokenStore[token];
  if (
    !record ||
    record.editionId !== editionId ||
    record.sessionToken !== sessionToken
  ) {
    return res.status(403).json({ error: "Token mismatch or expired." });
  }

  const watermarkText = `Licensed to: ${record.email} | Edition ${editionId} | DO NOT REDISTRIBUTE`;
  const escapePdf = (value) => String(value).replace(/([\\()\\n])/g, "\\$1");
  const content = `BT /F1 12 Tf 50 780 Td (${escapePdf(watermarkText)}) Tj ET`;
  const contentLength = Buffer.byteLength(content, "utf8");

  const objects = [
    `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`,
    `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`,
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n`,
    `4 0 obj\n<< /Length ${contentLength} >>\nstream\n${content}\nendstream\nendobj\n`,
    `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`,
  ];

  const header = "%PDF-1.4\n%âãÏÓ\n";
  let offset = Buffer.byteLength(header, "utf8");
  const xrefLines = ["xref", `0 ${objects.length + 1}`, "0000000000 65535 f "];

  for (const object of objects) {
    xrefLines.push(`${String(offset).padStart(10, "0")} 00000 n `);
    offset += Buffer.byteLength(object, "utf8");
  }

  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${offset}\n%%EOF`;
  const pdfBuffer = Buffer.concat([
    Buffer.from(header, "utf8"),
    ...objects.map((o) => Buffer.from(o, "utf8")),
    Buffer.from(xrefLines.join("\n") + "\n", "utf8"),
    Buffer.from(trailer, "utf8"),
  ]);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="weekendpost_epaper_${editionId}.pdf"`,
  );
  res.send(pdfBuffer);
});

app.get("/api/integrations/status", (req, res) => {
  res.json({
    success: true,
    availableIntegrations: [
      "Stripe",
      "Betway",
      "Orange Money",
      "Enterprise SSO",
      "Analytics API",
    ],
    message: "Integration readiness status available.",
  });
});

app.listen(PORT, () => {
  console.log(
    `Weekend Post Backend protoype running on http://localhost:${PORT}`,
  );
  console.log(
    `Note: This is a Node.js prototype intended to demonstrate logic before WordPress conversion.`,
  );
});
