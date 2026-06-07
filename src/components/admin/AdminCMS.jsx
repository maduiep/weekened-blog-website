import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Save, Image as ImageIcon, CheckCircle, FileText, Trash2, Edit, Plus, LayoutTemplate, Video, BarChart } from 'lucide-react';
import { getLiveArticles, defaultArticles } from '../../data/articles';
import AnalyticsDashboard from './AnalyticsDashboard';

export default function AdminCMS({ showToast }) {
  const [activeTab, setActiveTab] = useState('manage-articles'); // 'manage-articles', 'create-article', 'manage-adverts'
  const [localArticles, setLocalArticles] = useState([]);
  const [adverts, setAdverts] = useState([]);

  // Editor State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('news');
  const [status, setStatus] = useState('Published');
  const [publishDate, setPublishDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [content, setContent] = useState('## Start Writing Here...\n\nUse **Markdown** to format your article.');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Ad State
  const [adTitle, setAdTitle] = useState('');
  const [adImage, setAdImage] = useState('');
  const [adLink, setAdLink] = useState('');
  const [adPlacement, setAdPlacement] = useState('banner'); // banner, sidebar, popup, in-article

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const articles = JSON.parse(localStorage.getItem('wp_local_articles') || '[]');
    setLocalArticles(articles);
    const ads = JSON.parse(localStorage.getItem('wp_ad_inventory') || '[]');
    setAdverts(ads);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setVideoUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveArticle = () => {
    setIsSaving(true);
    const newArticle = {
      id: editingId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'art-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36)),
      title,
      slug,
      excerpt: summary,
      category,
      image: imageUrl,
      videoUrl,
      content,
      isPremium: true, // Default to premium for admin CMS
      price: 25,
      author: 'Editorial Team',
      status: status,
      date: publishDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: '3 min read',
    };

    let updated = [...localArticles];
    if (editingId) {
      updated = updated.map(a => a.id === editingId ? newArticle : a);
    } else {
      updated.push(newArticle);
    }

    localStorage.setItem('wp_local_articles', JSON.stringify(updated));
    setLocalArticles(updated);
    
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    resetArticleEditor();
    setActiveTab('manage-articles');
    if (showToast) showToast("Article published successfully!");
  };

  const handleDeleteArticle = (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      const updated = localArticles.filter(a => a.id !== id);
      localStorage.setItem('wp_local_articles', JSON.stringify(updated));
      setLocalArticles(updated);
      if (showToast) showToast("Article deleted.");
    }
  };

  const handleEditArticle = (article) => {
    setEditingId(article.id);
    setTitle(article.title);
    setSlug(article.slug || '');
    setSummary(article.excerpt);
    setCategory(article.category);
    setStatus(article.status || 'Published');
    setPublishDate(article.date || '');
    setImageUrl(article.image);
    setVideoUrl(article.videoUrl || '');
    setContent(article.content);
    setActiveTab('create-article');
  };

  const resetArticleEditor = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setSummary('');
    setStatus('Published');
    setPublishDate('');
    setImageUrl('');
    setVideoUrl('');
    setContent('## Start Writing Here...\n\nUse **Markdown** to format your article.');
  };

  const handleSaveAdvert = (e) => {
    e.preventDefault();
    const newAd = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'ad-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36),
      title: adTitle,
      imageUrl: adImage,
      link: adLink,
      placement: adPlacement,
      status: 'active',
      dateAdded: new Date().toISOString()
    };
    const updatedAds = [newAd, ...adverts];
    localStorage.setItem('wp_ad_inventory', JSON.stringify(updatedAds));
    setAdverts(updatedAds);
    setAdTitle(''); setAdImage(''); setAdLink('');
    if (showToast) showToast("Advert created successfully!");
  };

  const handleDeleteAdvert = (id) => {
    const updated = adverts.filter(a => a.id !== id);
    localStorage.setItem('wp_ad_inventory', JSON.stringify(updated));
    setAdverts(updated);
    if (showToast) showToast("Advert deleted.");
  };

  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      
      {/* CMS Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-alt)' }}>
        <button 
          onClick={() => setActiveTab('analytics')}
          style={{ flex: 1, padding: '16px', background: activeTab === 'analytics' ? 'white' : 'transparent', border: 'none', borderBottom: activeTab === 'analytics' ? '2px solid var(--color-primary)' : '2px solid transparent', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <BarChart size={16}/> Analytics
        </button>
        <button 
          onClick={() => setActiveTab('manage-articles')}
          style={{ flex: 1, padding: '16px', background: activeTab === 'manage-articles' ? 'white' : 'transparent', border: 'none', borderBottom: activeTab === 'manage-articles' ? '2px solid var(--color-primary)' : '2px solid transparent', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <FileText size={16}/> Manage Articles
        </button>
        <button 
          onClick={() => { resetArticleEditor(); setActiveTab('create-article'); }}
          style={{ flex: 1, padding: '16px', background: activeTab === 'create-article' ? 'white' : 'transparent', border: 'none', borderBottom: activeTab === 'create-article' ? '2px solid var(--color-primary)' : '2px solid transparent', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <Plus size={16}/> Create Article
        </button>
        <button 
          onClick={() => setActiveTab('manage-adverts')}
          style={{ flex: 1, padding: '16px', background: activeTab === 'manage-adverts' ? 'white' : 'transparent', border: 'none', borderBottom: activeTab === 'manage-adverts' ? '2px solid var(--color-primary)' : '2px solid transparent', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <LayoutTemplate size={16}/> Manage Adverts
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ padding: 'var(--space-xl)' }}>
        
        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {activeTab === 'manage-articles' && (
          <div>
            <h3 style={{ marginBottom: '16px' }}>Your Published Articles</h3>
            {localArticles.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)' }}>No dynamic articles found. Click "Create Article" to write one.</p>
            ) : (
              <div style={{ overflowX: "auto", width: "100%", maxWidth: "100vw", paddingBottom: "16px" }}>
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px', minWidth: '600px' }}>
                <thead>
                  <tr style={{ background: 'var(--color-bg-alt)', textAlign: 'left' }}>
                    <th style={{ padding: '12px', borderBottom: '1px solid var(--color-border)' }}>Title</th>
                    <th style={{ padding: '12px', borderBottom: '1px solid var(--color-border)' }}>Status</th>
                    <th style={{ padding: '12px', borderBottom: '1px solid var(--color-border)' }}>Category</th>
                    <th style={{ padding: '12px', borderBottom: '1px solid var(--color-border)' }}>Date</th>
                    <th style={{ padding: '12px', borderBottom: '1px solid var(--color-border)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {localArticles.map(article => (
                    <tr key={article.id}>
                      <td style={{ padding: '12px', borderBottom: '1px solid var(--color-border)', fontWeight: 600 }}>{article.title}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid var(--color-border)' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', background: article.status === 'Published' ? 'var(--color-sport-green)' : 'var(--color-gold)', color: article.status === 'Published' ? 'white' : 'black' }}>
                          {article.status || 'Published'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid var(--color-border)', textTransform: 'capitalize' }}>{article.category}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid var(--color-border)' }}>{article.date}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid var(--color-border)' }}>
                        <button onClick={() => handleEditArticle(article)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', marginRight: 12 }}><Edit size={16}/></button>
                        <button onClick={() => handleDeleteArticle(article.id)} style={{ background: 'none', border: 'none', color: 'var(--color-news-red)', cursor: 'pointer' }}><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
            )}
          </div>
        )}

        {activeTab === 'create-article' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="text" placeholder="Article Title" value={title} onChange={e => setTitle(e.target.value)} className="form-input" style={{ fontSize: '20px', fontWeight: 700 }} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <input type="text" placeholder="Slug (e.g. new-article)" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} className="form-input" style={{ flex: '1 1 200px' }} />
                <select value={category} onChange={e => setCategory(e.target.value)} className="form-input" style={{ flex: '1 1 150px' }}>
                  <option value="news">News</option>
                  <option value="business">Business</option>
                  <option value="sport">Sport</option>
                  <option value="opinion">Opinion</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <select value={status} onChange={e => setStatus(e.target.value)} className="form-input" style={{ flex: '1 1 150px' }}>
                  <option value="Draft">Draft</option>
                  <option value="Review">Pending Review</option>
                  <option value="Published">Published</option>
                </select>
                <input type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)} className="form-input" style={{ flex: '1 1 150px' }} />
              </div>

              <input type="text" placeholder="Brief Summary" value={summary} onChange={e => setSummary(e.target.value)} className="form-input" />
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: '1 1 250px', display: 'flex', gap: '8px' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input type="text" placeholder="Cover Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="form-input" style={{ paddingLeft: '36px', width: '100%' }} />
                    <ImageIcon size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--color-text-muted)' }} />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                    Upload
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                <div style={{ flex: '1 1 250px', display: 'flex', gap: '8px' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input type="text" placeholder="Video Embed URL (Optional)" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="form-input" style={{ paddingLeft: '36px', width: '100%' }} />
                    <Video size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--color-text-muted)' }} />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                    Upload
                    <input type="file" accept="video/*" onChange={handleVideoUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              <textarea value={content} onChange={e => setContent(e.target.value)} className="form-input" style={{ minHeight: '300px', fontFamily: 'monospace' }} placeholder="Write your article in Markdown..."></textarea>
              <button onClick={handleSaveArticle} disabled={!title || !content || isSaving} className="btn btn-primary btn-lg">
                {isSaving ? 'Publishing...' : (editingId ? 'Update Article' : 'Publish Article')}
              </button>
            </div>

            <div style={{ background: 'var(--color-bg-alt)', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <h4 style={{ marginBottom: 16 }}>Live Preview</h4>
              <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                {videoUrl ? (
                   <video controls style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: 16 }}>
                     <source src={videoUrl} />
                   </video>
                ) : imageUrl ? (
                  <img src={imageUrl} alt="Cover" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: 16 }} />
                ) : null}
                <h1 style={{ fontSize: '24px', marginBottom: 8 }}>{title || 'Untitled'}</h1>
                {summary && <p style={{ fontSize: '16px', color: 'gray', fontStyle: 'italic', marginBottom: 16 }}>{summary}</p>}
                <div className="markdown-preview"><ReactMarkdown>{content}</ReactMarkdown></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'manage-adverts' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '32px' }}>
            <div style={{ background: 'var(--color-bg-alt)', padding: '24px', borderRadius: '12px' }}>
              <h4 style={{ marginBottom: 16 }}>Create New Advert</h4>
              <form onSubmit={handleSaveAdvert} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="form-label">Advert Title</label>
                  <input type="text" value={adTitle} onChange={e=>setAdTitle(e.target.value)} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Image or Video URL</label>
                  <input type="text" value={adImage} onChange={e=>setAdImage(e.target.value)} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Target Link</label>
                  <input type="url" value={adLink} onChange={e=>setAdLink(e.target.value)} className="form-input" required />
                </div>
                <div>
                  <label className="form-label">Placement Location</label>
                  <select value={adPlacement} onChange={e=>setAdPlacement(e.target.value)} className="form-input">
                    <option value="banner">Hero Banner (Top)</option>
                    <option value="sidebar">Sidebar (Next to articles)</option>
                    <option value="popup">Popup Modal</option>
                    <option value="in-article">In-Article (Mid-content)</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>Deploy Advert</button>
              </form>
            </div>
            
            <div>
              <h4 style={{ marginBottom: 16 }}>Active Advertisements</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 16 }}>
                {adverts.map(ad => (
                  <div key={ad.id} style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: 16 }}>
                    {ad.imageUrl.endsWith('.mp4') ? (
                       <video src={ad.imageUrl} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: 4, marginBottom: 8 }} />
                    ) : (
                       <img src={ad.imageUrl} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: 4, marginBottom: 8 }} />
                    )}
                    <h5 style={{ margin: '0 0 4px' }}>{ad.title}</h5>
                    <p style={{ margin: 0, fontSize: '12px', color: 'gray' }}>Placement: <strong>{ad.placement}</strong></p>
                    <button onClick={() => handleDeleteAdvert(ad.id)} className="btn btn-sm" style={{ background: 'var(--color-news-red)', color: 'white', marginTop: 12, width: '100%' }}>Remove Advert</button>
                  </div>
                ))}
                {adverts.length === 0 && <p style={{ color: 'gray' }}>No active adverts.</p>}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


