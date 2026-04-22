import { Link } from 'react-router-dom';
import { getCategoryInfo } from '../../data/articles';

export default function ArticleCard({ article, large = false, horizontal = false }) {
  const catInfo = getCategoryInfo(article.category);

  return (
    <div className={`article-card ${large ? 'article-card-large' : ''} ${horizontal ? 'article-card-horizontal' : ''}`}>
      <div className="article-card-image">
        <img src={article.image} alt={article.title} loading="lazy" />
        {catInfo && (
          <Link to={`/category/${article.category}`} className={`badge ${catInfo.badge}`}>
            {catInfo.name}
          </Link>
        )}
      </div>
      <div className="article-card-body">
        <h3 className="article-card-title">
          <Link to={`/article/${article.id}`}>{article.title}</Link>
        </h3>
        <p className="article-card-excerpt">{article.excerpt}</p>
        <div className="article-card-meta">
          <span className="author">{article.author}</span>
          <span className="dot" />
          <span>{article.date}</span>
          <span className="dot" />
          <span>{article.readTime}</span>
        </div>
      </div>
    </div>
  );
}
