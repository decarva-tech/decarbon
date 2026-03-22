import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, Link as LinkIcon, Type, FileText, Tag, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultCategories = [
  { id: 'shipping', name: 'Shipping' },
  { id: 'it', name: 'IT' },
  { id: 'shipbuilding', name: 'Shipbuilding' },
  { id: 'market', name: 'Market' },
];

const NewsEditModal = ({ isOpen, onClose, onSave, initialData = null, categories = null }) => {
  const catList = (categories && categories.length > 0) ? categories : defaultCategories;
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    image: '',
    link: '',
    source: '',
    category: 'Shipping'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        summary: '',
        image: '',
        link: '',
        source: '',
        category: 'Shipping'
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 30, 58, 0.7)',
              backdropFilter: 'blur(6px)',
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '640px',
              background: '#ffffff',
              borderRadius: '1.25rem',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0,0,0,0.05)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.75rem 2rem 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#0f1e3a',
                margin: 0,
              }}>
                {initialData ? '뉴스 수정' : '새 뉴스 작성'}
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '0.625rem',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.target.style.background = '#fee2e2'; e.target.style.color = '#dc2626'; }}
                onMouseLeave={e => { e.target.style.background = '#f1f5f9'; e.target.style.color = '#64748b'; }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem 2rem 2rem' }}>
              {/* Title */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>
                  <Type size={14} style={{ color: '#ff8031' }} />
                  제목
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="뉴스 제목을 입력하세요"
                  required
                  onFocus={e => { e.target.style.borderColor = '#ff8031'; e.target.style.boxShadow = '0 0 0 3px rgba(255,128,49,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Summary */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>
                  <FileText size={14} style={{ color: '#ff8031' }} />
                  요약
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                  placeholder="내용 요약을 입력하세요"
                  required
                  onFocus={e => { e.target.style.borderColor = '#ff8031'; e.target.style.boxShadow = '0 0 0 3px rgba(255,128,49,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Two-column row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>
                    <ImageIcon size={14} style={{ color: '#ff8031' }} />
                    이미지 URL
                  </label>
                  <input
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="https://..."
                    onFocus={e => { e.target.style.borderColor = '#ff8031'; e.target.style.boxShadow = '0 0 0 3px rgba(255,128,49,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    <LinkIcon size={14} style={{ color: '#ff8031' }} />
                    외부 링크
                  </label>
                  <input
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="https://..."
                    onFocus={e => { e.target.style.borderColor = '#ff8031'; e.target.style.boxShadow = '0 0 0 3px rgba(255,128,49,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Another two-column row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
                <div>
                  <label style={labelStyle}>
                    <Globe size={14} style={{ color: '#ff8031' }} />
                    출처
                  </label>
                  <input
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="예: Maritime News"
                    onFocus={e => { e.target.style.borderColor = '#ff8031'; e.target.style.boxShadow = '0 0 0 3px rgba(255,128,49,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    <Tag size={14} style={{ color: '#ff8031' }} />
                    카테고리
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={e => { e.target.style.borderColor = '#ff8031'; e.target.style.boxShadow = '0 0 0 3px rgba(255,128,49,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  >
                    {catList.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div style={{
                  marginBottom: '1.5rem',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  height: '160px',
                }}>
                  <img
                    src={formData.image}
                    alt="미리보기"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '0.85rem',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    color: '#64748b',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.target.style.background = '#e2e8f0'; }}
                  onMouseLeave={e => { e.target.style.background = '#f1f5f9'; }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.85rem',
                    background: 'linear-gradient(135deg, #ff8031, #ff5500)',
                    border: 'none',
                    borderRadius: '0.75rem',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 14px rgba(255, 128, 49, 0.3)',
                  }}
                  onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 18px rgba(255, 128, 49, 0.4)'; }}
                  onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 4px 14px rgba(255, 128, 49, 0.3)'; }}
                >
                  <Save size={16} />
                  저장하기
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#475569',
  marginBottom: '0.4rem',
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem 0.875rem',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '0.625rem',
  color: '#0f1e3a',
  fontSize: '0.9rem',
  fontFamily: "'Inter', sans-serif",
  outline: 'none',
  transition: 'all 0.2s',
  boxSizing: 'border-box',
};

export default NewsEditModal;
