import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Save, Image as ImageIcon, CheckCircle, FileText } from 'lucide-react';
import { supabase, withSupabaseFallback } from '../../lib/supabase';

export default function CMSEditor() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('news');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('## Start Writing Here...\n\nUse **Markdown** to format your article.');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Create article object
    const newArticle = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'art-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36),
      title,
      slug,
      excerpt: summary,
      category,
      image: imageUrl,
      content,
      isPremium: false,
      author: 'Admin',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: '3 min read',
    };

    // Try to save to Supabase with fallback to local storage
    const supabaseAction = supabase ? supabase.from('articles').insert([newArticle]) : Promise.reject('No Supabase client');
    
    await withSupabaseFallback(supabaseAction, () => {
      // Local Fallback: Update localStorage
      const localArticles = JSON.parse(localStorage.getItem('wp_local_articles') || '[]');
      localArticles.push(newArticle);
      localStorage.setItem('wp_local_articles', JSON.stringify(localArticles));
    });

    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // Reset form
      setTitle('');
      setSlug('');
      setSummary('');
      setImageUrl('');
      setContent('## Start Writing Here...\n\nUse **Markdown** to format your article.');
    }, 3000);
  };

  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      <div style={{ padding: 'var(--space-xl)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: 'var(--text-lg)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={20} /> Content Management System</h3>
          <p style={{ fontSize: "var(--text-xs)", color: 'var(--color-text-muted)', marginTop: '4px' }}>Write and publish articles using Markdown.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={!title || !content || isSaving}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {isSaving ? 'Publishing...' : showSuccess ? <><CheckCircle size={16} /> Published!</> : <><Save size={16} /> Publish Article</>}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '2px', background: 'var(--color-border)', minHeight: '600px' }}>
        {/* Editor Side */}
        <div style={{ background: 'white', padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <input 
            type="text" 
            placeholder="Article Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '12px', fontSize: "var(--text-xl)", fontWeight: 700, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
          />
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
             <input 
              type="text" 
              placeholder="Slug (e.g. new-article)" 
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              style={{ flex: 1, padding: '10px', fontSize: "var(--text-sm)", border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
            />
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ 
                padding: '10px 36px 10px 12px', 
                fontSize: "var(--text-sm)", 
                border: '1px solid var(--color-border)', 
                borderRadius: 'var(--radius-md)',
                appearance: 'none',
                WebkitAppearance: 'none',
                backgroundColor: 'white',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
                backgroundSize: '16px',
                cursor: 'pointer'
              }}
            >
              <option value="news">News</option>
              <option value="business">Business</option>
              <option value="sport">Sport</option>
              <option value="opinion">Opinion</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
          </div>
          <input 
            type="text" 
            placeholder="Brief Summary" 
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: "var(--text-sm)", border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
          />
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <div style={{ position: 'relative', flex: 1 }}>
               <input 
                type="text" 
                placeholder="Cover Image URL (Optional)" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={{ width: '100%', padding: '10px 10px 10px 36px', fontSize: "var(--text-sm)", border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
              />
              <ImageIcon size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0 16px', cursor: 'pointer', fontSize: "var(--text-sm)", fontWeight: 600 }}>
              Upload Image
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ flex: 1, width: '100%', padding: 'var(--space-md)', fontSize: "var(--text-sm)", fontFamily: 'var(--font-mono)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', resize: 'none', lineHeight: 1.6 }}
            placeholder="Write your article in Markdown here..."
          />
        </div>

        {/* Preview Side */}
        <div style={{ background: 'var(--color-bg)', padding: 'var(--space-xl)', overflowY: 'auto' }}>
           <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: 'var(--space-2xl)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              {imageUrl && <img src={imageUrl} alt="Cover" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-xl)' }} />}
              <h1 style={{ fontSize: "var(--text-4xl)", marginBottom: 'var(--space-sm)' }}>{title || 'Untitled Article'}</h1>
              {summary && <p style={{ fontSize: "var(--text-lg)", color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)', fontStyle: 'italic' }}>{summary}</p>}
              <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 'var(--space-xl) 0' }} />
              <div className="article-content markdown-preview" style={{ fontSize: "var(--text-base)", lineHeight: 1.8 }}>
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}




