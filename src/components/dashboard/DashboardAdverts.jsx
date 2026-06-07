export default function DashboardAdverts({ adForm, setAdForm, adRequests, handleAdSubmit, adSubmitting }) {
  return (
    <>
      <div className="dashboard-card">
                <h2 className="dashboard-card-title">Corporate Adverts Management</h2>
                <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-xl)" }}>
                  As a Corporate or Enterprise subscriber, you can request custom advertisements to be placed on the Weekend Post. Submit your creative below, and our team will review and approve it.
                </p>

                <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)', alignItems: 'start' }}>
                  
                  {/* Submission Form */}
                  <div style={{ background: "var(--color-bg-alt)", padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)" }}>
                    <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-md)" }}>Submit New Advert Request</h3>
                    <form onSubmit={handleAdSubmit} className="dashboard-settings-form">
                      <div className="form-group">
                        <label className="form-label">Advert Campaign Title</label>
                        <input type="text" className="form-input" required value={adForm.title} onChange={e => setAdForm({...adForm, title: e.target.value})} placeholder="e.g., Summer Promotion 2026" />
                      </div>
                      <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                        <div>
                          <label className="form-label">Target Category</label>
                          <select className="form-input" value={adForm.category} onChange={e => setAdForm({...adForm, category: e.target.value})}>
                            <option value="Business">Business & Economy</option>
                            <option value="Politics">Politics & Governance</option>
                            <option value="Sports">Sports</option>
                            <option value="Entertainment">Entertainment & Culture</option>
                            <option value="Global">Global News</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Placement Type</label>
                          <select className="form-input" value={adForm.type} onChange={e => setAdForm({...adForm, type: e.target.value})}>
                            <option value="banner">Top Banner (728x90)</option>
                            <option value="sidebar">Sidebar (300x250)</option>
                            <option value="popup">Popup / Overlay</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Desired Duration</label>
                        <select className="form-input" value={adForm.duration} onChange={e => setAdForm({...adForm, duration: e.target.value})}>
                          <option value="1 week">1 Week</option>
                          <option value="2 weeks">2 Weeks</option>
                          <option value="1 month">1 Month</option>
                          <option value="Ongoing">Ongoing (Enterprise Only)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Ad Image URL</label>
                        <input type="url" className="form-input" required value={adForm.imageUrl} onChange={e => setAdForm({...adForm, imageUrl: e.target.value})} placeholder="https://example.com/banner.png" />
                      </div>
                      <button type="submit" className="btn btn-primary btn-block" disabled={adSubmitting}>
                        {adSubmitting ? 'Submitting Request...' : 'Submit Advert Request'}
                      </button>
                    </form>
                  </div>

                  {/* History & Status */}
                  <div>
                    <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-md)" }}>Your Active & Past Requests</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                      {adRequests.length === 0 ? (
                        <div style={{ padding: "var(--space-xl)", textAlign: "center", border: "1px dashed var(--color-border)", borderRadius: "var(--radius-md)", color: "var(--color-text-muted)" }}>
                          You have no advert requests yet.
                        </div>
                      ) : (
                        adRequests.map((ad, idx) => (
                          <div key={idx} style={{ padding: "var(--space-md)", background: "white", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", display: 'flex', gap: 'var(--space-md)' }}>
                            <img src={ad.imageUrl} alt={ad.title} style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "4px", background: "var(--color-bg-alt)" }} onError={(e) => e.target.src="https://placehold.co/80x60/f8fafc/94a3b8?text=AD"} />
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "4px" }}>
                                <strong style={{ fontSize: "var(--text-sm)" }}>{ad.title}</strong>
                                <span className="badge" style={{ 
                                  background: ad.status === 'Approved' ? '#e8f8f5' : ad.status === 'Rejected' ? '#fee2e2' : 'var(--color-bg-alt)',
                                  color: ad.status === 'Approved' ? '#2ecc71' : ad.status === 'Rejected' ? 'var(--color-news-red)' : 'var(--color-text-muted)'
                                }}>{ad.status}</span>
                              </div>
                              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                                {ad.type.toUpperCase()} • {ad.category} • {ad.duration}
                              </div>
                              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "4px" }}>
                                Submitted: {new Date(ad.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
    </>
  );
}
