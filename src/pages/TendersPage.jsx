import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';

export default function TendersPage() {
  const tenders = [
    { id: 'TND-2026-01', title: 'Supply of Office Stationery', deadline: 'May 30, 2026', status: 'Open' },
    { id: 'TND-2026-02', title: 'Provision of Cleaning Services', deadline: 'June 15, 2026', status: 'Open' },
    { id: 'TND-2026-03', title: 'IT Infrastructure Upgrade', deadline: 'April 10, 2026', status: 'Closed' }
  ];

  return (
    <div className="tenders-page" style={{ padding: 'var(--space-4xl) 0', minHeight: '70vh', background: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ marginBottom: 'var(--space-4xl)' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 'var(--text-4xl)', color: 'var(--color-dark)', marginBottom: 'var(--space-md)' }}
          >
            Tenders & Procurement
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)' }}
          >
            Access open tender documents and procurement notices for Weekend Post.
          </motion.p>
        </div>

        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-alt)', borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: 'var(--space-lg)', fontSize: "var(--text-xs)", textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Reference</th>
                <th style={{ padding: 'var(--space-lg)', fontSize: "var(--text-xs)", textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Description</th>
                <th style={{ padding: 'var(--space-lg)', fontSize: "var(--text-xs)", textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Deadline</th>
                <th style={{ padding: 'var(--space-lg)', fontSize: "var(--text-xs)", textTransform: 'uppercase', color: 'var(--color-text-muted)', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tenders.map((tender, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: 'var(--space-lg)', fontWeight: 'bold', color: 'var(--color-dark)' }}>{tender.id}</td>
                  <td style={{ padding: 'var(--space-lg)', color: 'var(--color-text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} color="var(--color-primary)" /> {tender.title}
                    </div>
                  </td>
                  <td style={{ padding: 'var(--space-lg)', color: 'var(--color-text-secondary)' }}>
                    {tender.deadline}
                    {tender.status === 'Closed' && <span style={{ marginLeft: '8px', padding: '2px 6px', background: '#ffebee', color: '#c62828', fontSize: "var(--text-xs)", borderRadius: '4px', fontWeight: 'bold' }}>CLOSED</span>}
                  </td>
                  <td style={{ padding: 'var(--space-lg)', textAlign: 'right' }}>
                    <button className="btn btn-sm btn-ghost" disabled={tender.status === 'Closed'} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Download size={14} /> Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tenders.length === 0 && (
            <div style={{ padding: 'var(--space-2xl)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No open tenders at this time.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

