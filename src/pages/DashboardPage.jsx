import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User as UserIcon, CreditCard, Settings, Clock, Star, Download } from 'lucide-react';
import { articles } from '../data/articles';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "J",
    memberSince: "Jan 12, 2026",
    subscription: {
      status: "Active",
      plan: "Monthly Digital Premium",
      price: "P60.00",
      nextBilling: "May 12, 2026"
    },
    savedArticles: articles.slice(0, 3), // Mock 3 saved articles
    ebooks: [
      { id: 'ep-0422', title: '18 April 2026 Publication', date: 'April 18, 2026' },
      { id: 'ep-0415', title: '11 April 2026 Publication', date: 'April 11, 2026' }
    ]
  };

  return (
    <div className="section" style={{ background: 'var(--color-bg-alt)', minHeight: '80vh' }}>
      <div className="container">
        
        <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: 'var(--space-2xl)', alignItems: 'start' }}>
          
          {/* Sidebar */}
          <aside className="dashboard-sidebar" style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div className="user-profile-summary" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-md)' }}>
                {user.avatar}
              </div>
              <h3 style={{ marginBottom: 'var(--space-xs)' }}>{user.name}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{user.email}</p>
            </div>

            <nav className="dashboard-nav" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <button 
                onClick={() => setActiveTab('overview')}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)', background: activeTab === 'overview' ? 'var(--color-bg-alt)' : 'transparent', border: 'none', borderRadius: 'var(--radius-md)', color: activeTab === 'overview' ? 'var(--color-primary)' : 'inherit', fontWeight: activeTab === 'overview' ? 600 : 400, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                <UserIcon size={18} /> Overview
              </button>
              <button 
                onClick={() => setActiveTab('subscription')}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)', background: activeTab === 'subscription' ? 'var(--color-bg-alt)' : 'transparent', border: 'none', borderRadius: 'var(--radius-md)', color: activeTab === 'subscription' ? 'var(--color-primary)' : 'inherit', fontWeight: activeTab === 'subscription' ? 600 : 400, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                <CreditCard size={18} /> Plan & Billing
              </button>
              <button 
                onClick={() => setActiveTab('library')}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)', background: activeTab === 'library' ? 'var(--color-bg-alt)' : 'transparent', border: 'none', borderRadius: 'var(--radius-md)', color: activeTab === 'library' ? 'var(--color-primary)' : 'inherit', fontWeight: activeTab === 'library' ? 600 : 400, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                <BookOpen size={18} /> My Library
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)', background: activeTab === 'settings' ? 'var(--color-bg-alt)' : 'transparent', border: 'none', borderRadius: 'var(--radius-md)', color: activeTab === 'settings' ? 'var(--color-primary)' : 'inherit', fontWeight: activeTab === 'settings' ? 600 : 400, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                <Settings size={18} /> Account Settings
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            
            {activeTab === 'overview' && (
              <>
                <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-lg)' }}>Welcome back, {user.name.split(' ')[0]}</h1>
                
                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                  <div style={{ background: '#fff', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--color-gold)' }}>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-xs)' }}>Subscription Status</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#2ecc71' }}></span> {user.subscription.status}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>Renews {user.subscription.nextBilling}</div>
                  </div>
                  
                  <div style={{ background: '#fff', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-xs)' }}>Purchased E-Papers</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user.ebooks.length} Issues</div>
                    <Link to="/epaper" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', marginTop: '4px', display: 'inline-block' }}>Browse archive →</Link>
                  </div>
                  
                  <div style={{ background: '#fff', padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-xs)' }}>Saved Articles</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user.savedArticles.length} Articles</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>Read later queue</div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)' }}>
                  <h3 style={{ marginBottom: 'var(--space-lg)' }}>Recent Saved Articles</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    {user.savedArticles.map((article) => (
                      <div key={article.id} style={{ display: 'flex', gap: 'var(--space-md)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid var(--color-border)' }}>
                        <img src={article.image} alt="" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        <div>
                          <Link to={`/article/${article.id}`} style={{ fontWeight: 600, color: 'var(--color-dark)', textDecoration: 'none', display: 'block', marginBottom: '4px' }}>
                            {article.title}
                          </Link>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={12} /> Saved {Math.floor(Math.random() * 5) + 1} days ago
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setActiveTab('library')} className="btn btn-ghost" style={{ marginTop: 'var(--space-md)', width: '100%' }}>View All Saved Content</button>
                </div>
              </>
            )}

            {activeTab === 'subscription' && (
              <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2xl)' }}>
                <h2 style={{ marginBottom: 'var(--space-xl)' }}>Plan & Billing</h2>
                
                <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-xl)', marginBottom: 'var(--space-2xl)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                    <div>
                      <h3 style={{ color: 'var(--color-primary)' }}>{user.subscription.plan}</h3>
                      <p style={{ color: 'var(--color-text-muted)' }}>{user.subscription.price} per month</p>
                    </div>
                    <span className="badge badge-news" style={{ background: '#e8f8f5', color: '#2ecc71' }}>Active</span>
                  </div>
                  <div style={{ background: 'var(--color-bg-alt)', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>
                    Your next charge of <strong>{user.subscription.price}</strong> will be applied to your primary payment method on <strong>{user.subscription.nextBilling}</strong>.
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xl)' }}>
                    <button className="btn btn-primary">Update Payment Method</button>
                    <button className="btn btn-ghost" style={{ color: 'red' }}>Cancel Subscription</button>
                  </div>
                </div>

                <h3 style={{ marginBottom: 'var(--space-md)' }}>Billing History</h3>
                <table style={{ width: '100%', fontSize: 'var(--text-sm)', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                      <th style={{ padding: 'var(--space-sm) 0' }}>Date</th>
                      <th style={{ padding: 'var(--space-sm) 0' }}>Description</th>
                      <th style={{ padding: 'var(--space-sm) 0' }}>Amount</th>
                      <th style={{ padding: 'var(--space-sm) 0' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['April 12, 2026', 'March 12, 2026', 'February 12, 2026'].map((date, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: 'var(--space-md) 0', color: 'var(--color-text-muted)' }}>{date}</td>
                        <td style={{ padding: 'var(--space-md) 0', fontWeight: 500 }}>{user.subscription.plan}</td>
                        <td style={{ padding: 'var(--space-md) 0' }}>{user.subscription.price}</td>
                        <td style={{ padding: 'var(--space-md) 0' }}><span style={{ color: '#2ecc71' }}>Paid</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'library' && (
              <div>
                <h2 style={{ marginBottom: 'var(--space-lg)' }}>My Library</h2>
                
                <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2xl)', marginBottom: 'var(--space-xl)' }}>
                  <h3 style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={20} color="var(--color-primary)" /> E-Papers Collections
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-lg)' }}>
                    {user.ebooks.map((ebook, i) => (
                      <div key={i} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', textAlign: 'center' }}>
                        <div style={{ background: 'var(--color-bg-alt)', height: '140px', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <BookOpen size={40} style={{ opacity: 0.2 }} />
                        </div>
                        <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{ebook.title}</h4>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)' }}>Purchased: {ebook.date}</div>
                        <button className="btn btn-ghost btn-sm btn-block" style={{ border: '1px solid currentColor' }}>
                          <Download size={14} /> Download PDF
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2xl)' }}>
                  <h3 style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Star size={20} color="var(--color-gold)" /> Saved Articles
                  </h3>
                  <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
                    {user.savedArticles.map((article) => (
                      <div key={article.id} style={{ display: 'flex', gap: 'var(--space-md)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid var(--color-border)' }}>
                        <img src={article.image} alt="" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        <div>
                          <Link to={`/category/${article.category}`} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{article.category}</Link>
                          <Link to={`/article/${article.id}`} style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-dark)', textDecoration: 'none', display: 'block', margin: '4px 0' }}>
                            {article.title}
                          </Link>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={12} /> {article.readTime} • Saved recently
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'settings' && (
              <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2xl)' }}>
                <h2 style={{ marginBottom: 'var(--space-xl)' }}>Account Settings</h2>
                
                <form onSubmit={e => e.preventDefault()} style={{ maxWidth: '500px' }}>
                  <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" defaultValue={user.name} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-input" defaultValue={user.email} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-input" placeholder="+267 XXXXXXXX" />
                  </div>

                  <h3 style={{ margin: 'var(--space-xl) 0 var(--space-md)' }}>Change Password</h3>
                  <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                    <label className="form-label">Current Password</label>
                    <input type="password" className="form-input" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-input" />
                  </div>

                  <h3 style={{ margin: 'var(--space-xl) 0 var(--space-md)' }}>Email Preferences</h3>
                  <label className="form-checkbox" style={{ marginBottom: 'var(--space-sm)' }}>
                    <input type="checkbox" defaultChecked />
                    <span>Daily News Briefing</span>
                  </label>
                  <label className="form-checkbox" style={{ marginBottom: 'var(--space-sm)' }}>
                    <input type="checkbox" defaultChecked />
                    <span>Weekly E-Paper Alerts</span>
                  </label>
                  <label className="form-checkbox" style={{ marginBottom: 'var(--space-2xl)' }}>
                    <input type="checkbox" />
                    <span>Partner Offers</span>
                  </label>

                  <button type="submit" className="btn btn-primary btn-lg">Save Settings</button>
                </form>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
