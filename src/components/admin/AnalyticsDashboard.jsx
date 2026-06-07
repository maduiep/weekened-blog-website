import React from 'react';
import { BarChart, Users, TrendingUp, DollarSign, Activity, FileText } from 'lucide-react';

export default function AnalyticsDashboard() {
  const metrics = [
    { label: 'Total Traffic', value: '142,304', trend: '+12.5%', icon: <Activity size={20} /> },
    { label: 'Active Subscribers', value: '4,521', trend: '+5.2%', icon: <Users size={20} /> },
    { label: 'Monthly Revenue', value: 'P67,815', trend: '+18.1%', icon: <DollarSign size={20} /> },
    { label: 'Avg Reading Time', value: '4m 12s', trend: '+0.4%', icon: <TrendingUp size={20} /> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--color-text-muted)' }}>
              {m.icon}
              <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: 'var(--color-sport-green)' }}>{m.trend}</span>
            </div>
            <div style={{ fontSize: "var(--text-3xl)", fontWeight: 800, color: 'var(--color-dark)', marginBottom: '4px' }}>{m.value}</div>
            <div style={{ fontSize: "var(--text-sm)", color: 'var(--color-text-secondary)' }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {/* Audience Growth Chart (Mocked UI) */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: "var(--text-base)", marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><BarChart size={18} /> Audience Growth</h3>
          <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
            <div style={{ minWidth: '400px' }}>
              <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '12px', paddingBottom: '24px', borderBottom: '1px solid #eee' }}>
                {/* Simple mock bars */}
                {[40, 65, 45, 80, 55, 90, 75, 100].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--color-primary)', borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: "var(--text-xs)", color: 'var(--color-text-muted)' }}>
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
              </div>
            </div>
          </div>
        </div>

        {/* Most Read Articles */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: "var(--text-base)", marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={18} /> Top Content</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { title: 'Botswana 2024 Election Coverage', views: '45.2k' },
              { title: 'Diamond Market Fluctuations', views: '32.1k' },
              { title: 'New Infrastructure Development', views: '28.5k' },
              { title: 'Sports: Zebra Qualifiers', views: '19.8k' },
              { title: 'Opinion: The Future of Tech in Gaborone', views: '15.4k' }
            ].map((article, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i !== 4 ? '1px solid #eee' : 'none', paddingBottom: i !== 4 ? '12px' : 0 }}>
                <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: 'var(--color-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{article.title}</span>
                <span style={{ fontSize: "var(--text-xs)", color: 'var(--color-primary)', fontWeight: 700 }}>{article.views}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}




