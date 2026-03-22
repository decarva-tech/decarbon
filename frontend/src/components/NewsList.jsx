import React from 'react';
import { ChevronRight, Edit, Trash2 } from 'lucide-react';

const NewsList = ({ newsList }) => {
  return (
    <div className="news-list">
      {newsList.map((news) => (
        <a 
          key={news.id} 
          href={news.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="list-item group relative block no-underline"
          style={{ textDecoration: 'none' }}
        >
          <img src={news.image} alt={news.title} className="list-image" />
          <div className="list-content">
            <div className="flex items-center gap-2 mb-1" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="text-[10px] uppercase font-bold text-[#ff8031]">{news.category}</span>
              <span className="text-[10px] text-slate-400">•</span>
              <span className="text-[10px] text-slate-400">{news.source}</span>
            </div>
            <h3 className="text-[#0f1e3a] line-clamp-1">{news.title}</h3>
            <p className="line-clamp-2 text-slate-500 text-sm">{news.summary}</p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <ChevronRight size={20} className="text-slate-300 group-hover:text-[#ff8031] transition-colors" />
          </div>
        </a>
      ))}
    </div>
  );
};

export default NewsList;
