import { Link } from 'react-router-dom';
import { getCategoryInfo } from '../../data/articles';

export default function ArticleCard({ article, large = false, horizontal = false }) {
  const catInfo = getCategoryInfo(article.category);

  return (
    <div className={`article-card ${large ? 'article-card-large' : ''} ${horizontal ? 'article-card-horizontal' : ''}`}>
      <div className="article-card-image" style={{ background: 'var(--color-bg-alt)' }}>
        <img 
          src={article.image || 'https://images.unsplash.com/photo-1586339949916-3e9ed920624c?w=800&q=80'} 
          alt={article.title} 
          loading="lazy" 
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
        {catInfo && (
          <Link to={`/category/${article.category}`} className={`badge ${catInfo.badge}`}>
            {catInfo.name}
          </Link>
        )}
      </div>
      <div className="article-card-body">
        <h3 className="article-card-title" style={{ fontFamily: 'var(--font-headline)' }}>
          <Link to={`/article/${article.id}`}>{article.title}</Link>
        </h3>
        {article.excerpt && <p className="article-card-excerpt">{article.excerpt}</p>}
        <div className="article-card-meta">
          {article.author && <span className="author">{article.author}</span>}
          {article.author && article.date && <span className="dot" />}
          {article.date && <span>{article.date}</span>}
          {article.date && article.readTime && <span className="dot" />}
          {article.readTime && <span>{article.readTime}</span>}
        </div>
      </div>
    </div>
  );
}
