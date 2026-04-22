require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Weekend Post Backend is running' });
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
app.post('/api/payments/stripe/init', (req, res) => {
  const { amount, currency, plan, email } = req.body;
  
  if (!amount || !currency) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // In a real scenario, this would call the Stripe API to create a PaymentIntent
  // For the prototype, we return a mock client secret
  const clientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`;
  
  res.json({
    success: true,
    clientSecret,
    publishableKey: 'pk_test_mock_key'
  });
});

/**
 * Mock endpoint to simulate Stripe webhooks
 * Stripe sends back the payment event to this endpoint
 */
app.post('/api/webhooks/stripe', (req, res) => {
  // Extract event details from Stripe
  const { id, type, data } = req.body;

  console.log(`[STRIPE WEBHOOK] Received event: ${type}, ID: ${id}`);

  if (type === 'payment_intent.succeeded') {
    // 1. Verify event with Stripe
    // 2. Update user subscription status in DB
    // 3. Grant access or trigger e-book download email
    console.log('[STRIPE WEBHOOK] Payment successful!');
  } else {
    console.log('[STRIPE WEBHOOK] Payment event handled: ' + type);
  }

  res.status(200).json({ received: true });
});

/**
 * Mock endpoint to initiate an Orange Money payment
 */
app.post('/api/payments/orange/init', (req, res) => {
  const { amount, phone } = req.body;

  if (!amount || !phone) {
    return res.status(400).json({ error: 'Missing amount or phone number' });
  }

  // In a real scenario, this would call Orange Money API to trigger USSD/OTP push to user
  const orderId = `OM_ORDER_${Date.now()}`;

  res.json({
    success: true,
    orderId,
    message: 'OTP request initiated. Please check your phone.'
  });
});

/**
 * Mock endpoint where Orange Money sends completed transaction notifications
 */
app.post('/api/webhooks/orange', (req, res) => {
  const { orderId, status, txnid } = req.body;

  console.log(`[ORANGE WEBHOOK] Received for order: ${orderId}, Status: ${status}`);

  if (status === 'SUCCESS') {
    // Handle successful mobile payment
    // Update DB, grant access, etc.
    console.log('[ORANGE WEBHOOK] Payment successful!');
  } else {
    console.log('[ORANGE WEBHOOK] Payment failed/cancelled.');
  }

  // Orange Money typically requires a specific response format
  res.status(200).json({ message: 'Notification received successfully' });
});

// ========================================
// E-Book Delivery
// ========================================

/**
 * Secure E-book download endpoint
 * In production, you'd check authentication and payment status here
 * before serving the PDF file.
 */
app.get('/api/ebooks/download/:editionId', (req, res) => {
  const { editionId } = req.params;
  const { token } = req.query; // e.g., a short-lived download token from payment

  // Basic validation
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Valid subscription required.' });
  }

  // Mock checking DB for valid token/subscription
  const isValidSubscription = true; 

  if (isValidSubscription) {
    console.log(`[E-BOOK] Serving edition ${editionId} to subscriber.`);
    // res.download('/path/to/secure/files/pdf_name.pdf');
    res.json({ success: true, message: 'Mock download started' }); // Mock response for testing
  } else {
    return res.status(403).json({ error: 'Subscription expired or invalid.' });
  }
});

app.listen(PORT, () => {
  console.log(`Weekend Post Backend protoype running on http://localhost:${PORT}`);
  console.log(`Note: This is a Node.js prototype intended to demonstrate logic before WordPress conversion.`);
});
