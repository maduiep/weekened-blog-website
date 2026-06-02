const fs = require('fs');
const content = fs.readFileSync('src/pages/AdminPage.jsx', 'utf8');
const lines = content.split('\n');

const newImports = `
import AdminAnalytics from "../components/admin/AdminAnalytics";
import AdminUsers from "../components/admin/AdminUsers";
import AdminMessages from "../components/admin/AdminMessages";
import AdminReceipts from "../components/admin/AdminReceipts";
import AdminLogs from "../components/admin/AdminLogs";
`;

let modifiedLines = [...lines.slice(0, 37), newImports.trim(), ...lines.slice(37, 841)];

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

modifiedLines.push(renderBlock);
modifiedLines.push(...lines.slice(3221));

fs.writeFileSync('src/pages/AdminPage.jsx', modifiedLines.join('\n'));
console.log('AdminPage.jsx updated');
