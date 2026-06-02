const fs = require('fs');
const content = fs.readFileSync('src/pages/AdminPage.jsx', 'utf8').replace(/\r\n/g, '\n');

const analyticsStart = content.indexOf('          {activeTab === "analytics" ? (\n');
const usersStart = content.indexOf('          ) : (\n            <motion.div\n              key="users"');
const messagesStart = content.indexOf('          {activeTab === "messages" && (\n');
const cmsStart = content.indexOf('          {activeTab === "cms" && (\n');
const adminsStart = content.indexOf('          {activeTab === "admins" && (\n');
const settingsStart = content.indexOf('          {activeTab === "settings" && (\n');
const receiptsStart = content.indexOf('          {activeTab === "receipts" && (\n');
const logsStart = content.indexOf('          {activeTab === "logs" && (\n');
const endAll = content.indexOf('\n        </AnimatePresence>');

console.log({ analyticsStart, usersStart, messagesStart, cmsStart, adminsStart, settingsStart, receiptsStart, logsStart, endAll });

function cleanJsx(str, startStr) {
  let s = str.replace(startStr, '').trim();
  if (s.endsWith(')}')) {
    s = s.slice(0, -2).trim();
  }
  return s;
}

const analyticsJsx = cleanJsx(content.substring(analyticsStart, usersStart), '          {activeTab === "analytics" ? (\n');
const usersJsx = cleanJsx(content.substring(usersStart, messagesStart), '          ) : (\n');
const messagesJsx = cleanJsx(content.substring(messagesStart, cmsStart), '          {activeTab === "messages" && (\n');
const receiptsJsx = cleanJsx(content.substring(receiptsStart, logsStart), '          {activeTab === "receipts" && (\n');
const logsJsx = cleanJsx(content.substring(logsStart, endAll), '          {activeTab === "logs" && (\n');

const lines = content.split('\n');
const dataLines = lines.slice(37, 56).join('\n');
const analyticsData = lines.slice(270, 340).join('\n');
const feedbackData = lines.slice(341, 348).join('\n');

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

const usersCode = `import { motion } from 'framer-motion';
import { Search, ShieldCheck, Mail, CheckCircle, XCircle, CreditCard, Trash2, Eye } from 'lucide-react';

${dataLines}

export default function AdminUsers({ searchQuery, setSearchQuery, filterStatus, setFilterStatus, filtered, handleRevoke, PLAN_COLORS, adminUser, deleteUser, disconnectUser, showToast }) {
  return (
    ${usersJsx}
  );
}`;
fs.writeFileSync('src/components/admin/AdminUsers.jsx', usersCode);

const messagesCode = `import { motion } from 'framer-motion';
import { Search, CheckCircle, Eye, Mail } from 'lucide-react';

export default function AdminMessages({ contactMessages, setContactMessages, setSelectedMessage, showToast }) {
  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    ${messagesJsx}
  );
}`;
fs.writeFileSync('src/components/admin/AdminMessages.jsx', messagesCode);

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
    ${receiptsJsx}
  );
}`;
fs.writeFileSync('src/components/admin/AdminReceipts.jsx', receiptsCode);

const logsCode = `import { motion } from 'framer-motion';
import { Search, ShieldCheck } from 'lucide-react';

export default function AdminLogs({ adminLogs }) {
  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    ${logsJsx}
  );
}`;
fs.writeFileSync('src/components/admin/AdminLogs.jsx', logsCode);

console.log('Components safely extracted.');

const newImports = `
import AdminAnalytics from "../components/admin/AdminAnalytics";
import AdminUsers from "../components/admin/AdminUsers";
import AdminMessages from "../components/admin/AdminMessages";
import AdminReceipts from "../components/admin/AdminReceipts";
import AdminLogs from "../components/admin/AdminLogs";
`;

const renderBlock = `
        <AnimatePresence mode="wait">
          {activeTab === "analytics" && (
            <AdminAnalytics 
              showToast={showToast} 
              setModalType={setModalType} 
              setModalOpen={setModalOpen} 
              totalSubscribers={totalSubscribers} 
            />
          )}
          {activeTab === "users" && (
            <AdminUsers 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filtered={filtered}
              handleRevoke={handleRevoke}
              PLAN_COLORS={PLAN_COLORS}
              adminUser={adminUser}
              deleteUser={deleteUser}
              disconnectUser={disconnectUser}
              showToast={showToast}
            />
          )}
          {activeTab === "messages" && (
            <AdminMessages 
              contactMessages={contactMessages}
              setContactMessages={setContactMessages}
              setSelectedMessage={setSelectedMessage}
              showToast={showToast}
            />
          )}
          {activeTab === "cms" && (
            <motion.div key="cms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CMSEditor />
            </motion.div>
          )}
          {activeTab === "admins" && (
            <motion.div key="admins" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AdminManagement />
            </motion.div>
          )}
          {activeTab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PlatformSettings />
            </motion.div>
          )}
          {activeTab === "receipts" && (
            <AdminReceipts 
              paymentReceipts={paymentReceipts}
              setPaymentReceipts={setPaymentReceipts}
              receiptFilter={receiptFilter}
              setReceiptFilter={setReceiptFilter}
              previewReceipt={previewReceipt}
              setPreviewReceipt={setPreviewReceipt}
              reviewNote={reviewNote}
              setReviewNote={setReviewNote}
              adminUser={adminUser}
              showToast={showToast}
            />
          )}
          {activeTab === "logs" && (
            <AdminLogs adminLogs={adminLogs} />
          )}
        </AnimatePresence>
`;

const newContent = content.substring(0, content.indexOf('import { Link }') + 33) + newImports + content.substring(content.indexOf('import { Link }') + 33, analyticsStart - 1) + renderBlock + content.substring(endAll + 27);
fs.writeFileSync('src/pages/AdminPage.jsx', newContent);
console.log('AdminPage safely updated.');

