import { motion } from 'framer-motion';
import { Briefcase, ArrowRight } from 'lucide-react';

export default function CareersPage() {
  const jobs = [
    { title: 'Senior Investigative Journalist', type: 'Full-time', location: 'Gaborone', dept: 'Editorial' },
    { title: 'Digital Marketing Executive', type: 'Full-time', location: 'Gaborone', dept: 'Marketing' },
    { title: 'Freelance Photographers', type: 'Contract', location: 'Nationwide', dept: 'Media' }
  ];

  return (
    <div className="careers-page" style={{ padding: 'var(--space-4xl) 0', minHeight: '70vh', background: 'var(--color-bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-4xl)' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 'var(--text-4xl)', color: 'var(--color-dark)', marginBottom: 'var(--space-md)' }}
          >
            Join the Weekend Post Team
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: 'var(--text-xl)', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}
          >
            Help us shape the future of independent journalism in Botswana. We are always looking for passionate talent.
          </motion.p>
        </div>

        <div className="grid-3" style={{ gap: 'var(--space-2xl)' }}>
          {jobs.map((job, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              style={{ background: 'white', padding: 'var(--space-2xl)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', marginBottom: '12px' }}>
                <Briefcase size={16} /> <span style={{ fontSize: "var(--text-xs)", fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{job.dept}</span>
              </div>
              <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: '12px', color: 'var(--color-dark)' }}>{job.title}</h3>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', fontSize: "var(--text-sm)", color: 'var(--color-text-muted)' }}>
                <span>{job.type}</span> &bull; <span>{job.location}</span>
              </div>
              <button className="btn btn-ghost" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                View Details <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: 'var(--space-4xl)', padding: 'var(--space-2xl)', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--color-border)' }}>
          <h3 style={{ marginBottom: 'var(--space-md)' }}>Don't see a fit?</h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }}>Send your CV and a brief cover letter to our HR department and we'll keep you on file for future openings.</p>
          <a href="mailto:hr@weekendpost.co.bw" className="btn btn-primary">Email Your CV</a>
        </div>
      </div>
    </div>
  );
}

