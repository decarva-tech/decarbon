import React from 'react';
import { ExternalLink, Calendar, Briefcase, Edit, Trash2 } from 'lucide-react';

const NewsCard = ({ news }) => {
  return (
    <a 
      href={news.link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="news-card relative group block no-underline"
      style={{ textDecoration: 'none' }}
    >
      <div className="card-image-wrapper">
        <img src={news.image} alt={news.title} className="card-image" />
        <span className="category-tag">{news.category}</span>
      </div>
      <div className="card-content">
        <h3 className="card-title line-clamp-2 text-[#0f1e3a]">{news.title}</h3>
        <p className="card-summary line-clamp-3">{news.summary}</p>
        <div className="card-footer">
          <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={12} />
            <span>{news.source}</span>
          </div>
          <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={12} />
            <span>{news.date}</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default NewsCard;
