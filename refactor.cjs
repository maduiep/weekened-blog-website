const fs = require('fs');
const content = fs.readFileSync('src/pages/AdminPage.jsx', 'utf8');
const lines = content.split('\n');

const dataLines = lines.slice(37, 56).join('\n');
const analyticsData = lines.slice(270, 340).join('\n');
const feedbackData = lines.slice(341, 348).join('\n');

// 1. Analytics
const analyticsJsx = lines.slice(843, 1498).join('\n').replace('          {activeTab === "analytics" ? (', '').trim();
const analyticsCode = `import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Download, DollarSign, Filter, Database, Eye } from 'lucide-react';

${dataLines}

export default function AdminAnalytics({ showToast, setModalType, setModalOpen, totalSubscribers }) {
  const [timeRange, setTimeRange] = useState('monthly');
${analyticsData}
${feedbackData}
  const activeChartData = analyticsData[timeRange];
  const maxValue = Math.max(...activeChartData.map((d) => d.value));

  return (
    ${analyticsJsx}
  );
}`;
fs.writeFileSync('src/components/admin/AdminAnalytics.jsx', analyticsCode);

// 2. Users
const usersJsx = lines.slice(1499, 1765).join('\n').replace('          ) : (', '').trim();
const usersCode = `import { motion } from 'framer-motion';
import { Search, ShieldCheck, Mail, CheckCircle, XCircle } from 'lucide-react';

${dataLines}

export default function AdminUsers({ searchQuery, setSearchQuery, filterStatus, setFilterStatus, filtered, handleRevoke, PLAN_COLORS }) {
  return (
    ${usersJsx}
  );
}`;
fs.writeFileSync('src/components/admin/AdminUsers.jsx', usersCode);

// 3. Messages
const messagesJsx = lines.slice(1766, 1989).join('\n').replace('          {activeTab === "messages" && (', '').trim();
const messagesCode = `import { motion } from 'framer-motion';
import { Search, CheckCircle, Eye } from 'lucide-react';

export default function AdminMessages({ contactMessages, setContactMessages, setSelectedMessage, showToast }) {
  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    ${messagesJsx.slice(0, -1)}
  );
}`;
fs.writeFileSync('src/components/admin/AdminMessages.jsx', messagesCode);

// 4. Receipts
const receiptsJsx = lines.slice(2020, 2691).join('\n').replace('          {activeTab === "receipts" && (', '').trim();
const receiptsCode = `import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Upload, Clock, Image, CheckCircle, XCircle, X, FileText, Download, AlertCircle } from 'lucide-react';

${dataLines}

export default function AdminReceipts({ 
  paymentReceipts, 
  setPaymentReceipts, 
  receiptFilter, 
  setReceiptFilter, 
  previewReceipt, 
  setPreviewReceipt, 
  reviewNote, 
  setReviewNote, 
  adminUser, 
  showToast 
}) {
  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    ${receiptsJsx.slice(0, -1)}
  );
}`;
fs.writeFileSync('src/components/admin/AdminReceipts.jsx', receiptsCode);

// 5. Logs
const logsJsx = lines.slice(2692, 2772).join('\n').replace('          {activeTab === "logs" && (', '').trim();
const logsCode = `import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function AdminLogs({ adminLogs }) {
  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    ${logsJsx.slice(0, -1)}
  );
}`;
fs.writeFileSync('src/components/admin/AdminLogs.jsx', logsCode);

console.log('All components extracted successfully');
