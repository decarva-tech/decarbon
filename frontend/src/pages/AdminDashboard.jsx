import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Newspaper, Settings, Plus, Edit3, Trash2, ExternalLink, Shield, Menu, ChevronRight, Tag, X, Check, GripVertical, Lock, Mail, Eye, EyeOff, KeyRound, Link as LinkIcon, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NewsEditModal from '../components/NewsEditModal';
import API_BASE from '../api';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('news');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  // Menu state
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuSaving, setMenuSaving] = useState(false);
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuLink, setNewMenuLink] = useState('');
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [editMenuName, setEditMenuName] = useState('');
  const [editMenuLink, setEditMenuLink] = useState('');
  const [menuMessage, setMenuMessage] = useState({ type: '', text: '' });

  // Category state
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#3b82f6');
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatColor, setEditCatColor] = useState('');

  // Password change state
  const [pwStep, setPwStep] = useState(0); // 0: idle, 1: enter new pw, 2: enter code
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState({ type: '', text: '' });
  const [showNewPw, setShowNewPw] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const navigate = useNavigate();

  const colorPresets = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
    '#ec4899', '#06b6d4', '#64748b', '#f97316', '#14b8a6',
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('decarva_user');
    if (!savedUser) {
      navigate('/admin');
      return;
    }
    const parsed = JSON.parse(savedUser);
    if (!parsed || !parsed.user || parsed.user.role !== 'admin') {
      navigate('/admin');
      return;
    }
    setUser(parsed);
    fetchNews(parsed);
    fetchCategories();
    fetchMenuItems();
  }, [navigate]);

  const fetchNews = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/news`);
      setNews(res.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCatLoading(true);
      const res = await axios.get(`${API_BASE}/api/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setCatLoading(false);
    }
  };

  const saveCategories = async (updated) => {
    try {
      const config = { headers: { Authorization: user.token } };
      await axios.put(`${API_BASE}/api/categories`, updated, config);
      setCategories(updated);
    } catch (error) {
      console.error("Error saving categories:", error);
      alert("카테고리 저장 중 오류가 발생했습니다.");
    }
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const id = newCatName.trim().toLowerCase().replace(/\s+/g, '-');
    if (categories.find(c => c.id === id)) {
      alert("이미 존재하는 카테고리입니다.");
      return;
    }
    const updated = [...categories, { id, name: newCatName.trim(), color: newCatColor }];
    saveCategories(updated);
    setNewCatName('');
    setNewCatColor('#3b82f6');
  };

  const handleDeleteCategory = (id) => {
    if (!window.confirm("정말로 이 카테고리를 삭제하시겠습니까?")) return;
    const updated = categories.filter(c => c.id !== id);
    saveCategories(updated);
  };

  const startEditCategory = (cat) => {
    setEditingCatId(cat.id);
    setEditCatName(cat.name);
    setEditCatColor(cat.color);
  };

  const handleSaveEditCategory = () => {
    if (!editCatName.trim()) return;
    const updated = categories.map(c =>
      c.id === editingCatId ? { ...c, name: editCatName.trim(), color: editCatColor } : c
    );
    saveCategories(updated);
    setEditingCatId(null);
  };

  const handleCancelEditCategory = () => {
    setEditingCatId(null);
  };

  // Menu management functions
  const fetchMenuItems = async () => {
    try {
      setMenuLoading(true);
      const res = await axios.get(`${API_BASE}/api/menu`);
      setMenuItems(res.data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setMenuLoading(false);
    }
  };

  const saveMenuItems = async (updated) => {
    try {
      setMenuSaving(true);
      const config = { headers: { Authorization: user.token } };
      await axios.put(`${API_BASE}/api/menu`, updated, config);
      setMenuItems(updated);
      setMenuMessage({ type: 'success', text: '메뉴가 저장되었습니다.' });
      setTimeout(() => setMenuMessage({ type: '', text: '' }), 2000);
    } catch (error) {
      console.error("Error saving menu:", error);
      setMenuMessage({ type: 'error', text: '메뉴 저장 중 오류가 발생했습니다.' });
    } finally {
      setMenuSaving(false);
    }
  };

  const handleAddMenu = () => {
    if (!newMenuName.trim()) return;
    const id = newMenuName.trim().toLowerCase().replace(/\s+/g, '-');
    if (menuItems.find(m => m.id === id)) {
      setMenuMessage({ type: 'error', text: '이미 존재하는 메뉴입니다.' });
      return;
    }
    const updated = [...menuItems, { id, name: newMenuName.trim(), link: newMenuLink.trim() || '#' }];
    saveMenuItems(updated);
    setNewMenuName('');
    setNewMenuLink('');
  };

  const handleDeleteMenu = (id) => {
    if (!window.confirm('이 메뉴를 삭제하시겠습니까?')) return;
    const updated = menuItems.filter(m => m.id !== id);
    saveMenuItems(updated);
  };

  const startEditMenu = (item) => {
    setEditingMenuId(item.id);
    setEditMenuName(item.name);
    setEditMenuLink(item.link);
  };

  const handleSaveEditMenu = () => {
    if (!editMenuName.trim()) return;
    const updated = menuItems.map(m =>
      m.id === editingMenuId ? { ...m, name: editMenuName.trim(), link: editMenuLink.trim() || '#' } : m
    );
    saveMenuItems(updated);
    setEditingMenuId(null);
  };

  const handleCancelEditMenu = () => {
    setEditingMenuId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('decarva_user');
    navigate('/admin');
  };

  const handleSaveNews = async (formData) => {
    try {
      const config = { headers: { Authorization: user.token } };
      if (editingNews) {
        await axios.put(`${API_BASE}/api/news/${editingNews.id}`, formData, config);
      } else {
        await axios.post(`${API_BASE}/api/news`, formData, config);
      }
      setIsEditModalOpen(false);
      setEditingNews(null);
      fetchNews(user);
    } catch (error) {
      console.error("Error saving news:", error);
      alert("뉴스를 저장하는 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm("정말로 이 뉴스를 삭제하시겠습니까?")) return;
    try {
      const config = { headers: { Authorization: user.token } };
      await axios.delete(`${API_BASE}/api/news/${id}`, config);
      fetchNews(user);
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  const openEditModal = (item = null) => {
    setEditingNews(item);
    setIsEditModalOpen(true);
  };

  if (!user) return null;

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Shield size={24} />
          <span>Decarva Admin</span>
        </div>

        <nav className="admin-sidebar-nav">
          <button
            className={`admin-nav-item ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => setActiveTab('news')}
          >
            <Newspaper size={18} />
            <span>뉴스 관리</span>
            <ChevronRight size={16} className="nav-arrow" />
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <Tag size={18} />
            <span>카테고리 관리</span>
            <ChevronRight size={16} className="nav-arrow" />
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <Menu size={18} />
            <span>메뉴 관리</span>
            <ChevronRight size={16} className="nav-arrow" />
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            <span>설정</span>
            <ChevronRight size={16} className="nav-arrow" />
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {user.user.email.charAt(0).toUpperCase()}
            </div>
            <div className="admin-user-details">
              <span className="admin-user-role">관리자</span>
              <span className="admin-user-email">{user.user.email}</span>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-page-title">
            {activeTab === 'news' && '뉴스 관리'}
            {activeTab === 'categories' && '카테고리 관리'}
            {activeTab === 'menu' && '메뉴 관리'}
            {activeTab === 'settings' && '설정'}
          </h1>
          {activeTab === 'news' && (
            <button className="admin-add-btn" onClick={() => openEditModal()}>
              <Plus size={18} />
              새 뉴스 추가
            </button>
          )}
        </div>

        {/* News Tab */}
        {activeTab === 'news' && (
          <div className="admin-content">
            {loading ? (
              <div className="admin-loading">
                <div className="admin-spinner-lg" />
                <p>데이터를 불러오는 중...</p>
              </div>
            ) : (
              <div className="admin-news-table-wrapper">
                <table className="admin-news-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>#</th>
                      <th>제목</th>
                      <th style={{ width: '120px' }}>카테고리</th>
                      <th style={{ width: '120px' }}>출처</th>
                      <th style={{ width: '110px' }}>날짜</th>
                      <th style={{ width: '130px' }}>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {news.map((item, idx) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                        >
                          <td className="admin-td-num">{idx + 1}</td>
                          <td>
                            <div className="admin-news-title-cell">
                              {item.image && (
                                <img src={item.image} alt="" className="admin-news-thumb" />
                              )}
                              <div>
                                <span className="admin-news-title-text">{item.title}</span>
                                {item.isMain && <span className="admin-badge-main">대표</span>}
                              </div>
                            </div>
                          </td>
                          <td><span className="admin-category-badge">{item.category}</span></td>
                          <td className="admin-td-source">{item.source}</td>
                          <td className="admin-td-date">{item.date}</td>
                          <td>
                            <div className="admin-actions">
                              <a href={item.link} target="_blank" rel="noopener noreferrer" className="admin-action-btn admin-action-link" title="링크 열기">
                                <ExternalLink size={15} />
                              </a>
                              <button onClick={() => openEditModal(item)} className="admin-action-btn admin-action-edit" title="수정">
                                <Edit3 size={15} />
                              </button>
                              <button onClick={() => handleDeleteNews(item.id)} className="admin-action-btn admin-action-delete" title="삭제">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
                {news.length === 0 && (
                  <div className="admin-empty">
                    <Newspaper size={48} />
                    <p>등록된 뉴스가 없습니다.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="admin-content">
            {/* Add New Category */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              border: '1px solid #e5e7eb',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1rem',
                fontWeight: 700,
                color: '#0f1e3a',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <Plus size={18} style={{ color: '#ff8031' }} />
                새 카테고리 추가
              </h3>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#64748b',
                    marginBottom: '0.35rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                  }}>카테고리 이름</label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="예: Environment"
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.875rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.625rem',
                      color: '#0f1e3a',
                      fontSize: '0.875rem',
                      fontFamily: "'Inter', sans-serif",
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#64748b',
                    marginBottom: '0.35rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                  }}>색상</label>
                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                    {colorPresets.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewCatColor(c)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '0.375rem',
                          background: c,
                          border: newCatColor === c ? '2.5px solid #0f1e3a' : '2px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          transform: newCatColor === c ? 'scale(1.1)' : 'scale(1)',
                        }}
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleAddCategory}
                  disabled={!newCatName.trim()}
                  style={{
                    padding: '0.65rem 1.25rem',
                    background: newCatName.trim() ? 'linear-gradient(135deg, #ff8031, #ff5500)' : '#e2e8f0',
                    color: newCatName.trim() ? 'white' : '#94a3b8',
                    border: 'none',
                    borderRadius: '0.625rem',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    fontFamily: "'Inter', sans-serif",
                    cursor: newCatName.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Plus size={16} />
                  추가
                </button>
              </div>
            </div>

            {/* Category List */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #e5e7eb',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>등록된 카테고리 ({categories.length})</span>
              </div>

              {catLoading ? (
                <div className="admin-loading">
                  <div className="admin-spinner-lg" />
                </div>
              ) : categories.length === 0 ? (
                <div style={{
                  padding: '3rem',
                  textAlign: 'center',
                  color: '#94a3b8',
                }}>
                  <Tag size={40} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                  <p>등록된 카테고리가 없습니다.</p>
                </div>
              ) : (
                <div>
                  {categories.map((cat, idx) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.85rem 1.5rem',
                        borderBottom: idx < categories.length - 1 ? '1px solid #f1f5f9' : 'none',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fafbfc'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      {/* Color dot */}
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: cat.color || '#64748b',
                        flexShrink: 0,
                      }} />

                      {/* Content */}
                      {editingCatId === cat.id ? (
                        /* Edit mode */
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <input
                            type="text"
                            value={editCatName}
                            onChange={e => setEditCatName(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleSaveEditCategory(); if (e.key === 'Escape') handleCancelEditCategory(); }}
                            autoFocus
                            style={{
                              flex: 1,
                              padding: '0.45rem 0.75rem',
                              background: '#f8fafc',
                              border: '1px solid #ff8031',
                              borderRadius: '0.5rem',
                              color: '#0f1e3a',
                              fontSize: '0.875rem',
                              fontFamily: "'Inter', sans-serif",
                              outline: 'none',
                              boxShadow: '0 0 0 3px rgba(255,128,49,0.1)',
                            }}
                          />
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            {colorPresets.map(c => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => setEditCatColor(c)}
                                style={{
                                  width: '22px',
                                  height: '22px',
                                  borderRadius: '0.25rem',
                                  background: c,
                                  border: editCatColor === c ? '2px solid #0f1e3a' : '1.5px solid transparent',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s',
                                }}
                              />
                            ))}
                          </div>
                          <button
                            onClick={handleSaveEditCategory}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '0.5rem',
                              background: '#dcfce7',
                              border: 'none',
                              color: '#16a34a',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={handleCancelEditCategory}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '0.5rem',
                              background: '#fee2e2',
                              border: 'none',
                              color: '#dc2626',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        /* Display mode */
                        <>
                          <div style={{ flex: 1 }}>
                            <span style={{
                              fontWeight: 500,
                              color: '#1e293b',
                              fontSize: '0.9rem',
                            }}>{cat.name}</span>
                            <span style={{
                              marginLeft: '0.75rem',
                              fontSize: '0.75rem',
                              color: '#94a3b8',
                              fontFamily: 'monospace',
                            }}>#{cat.id}</span>
                          </div>
                          <div style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: cat.color || '#64748b',
                            background: (cat.color || '#64748b') + '18',
                          }}>
                            {cat.name}
                          </div>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              onClick={() => startEditCategory(cat)}
                              className="admin-action-btn admin-action-edit"
                              title="수정"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="admin-action-btn admin-action-delete"
                              title="삭제"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Menu Management Tab */}
        {activeTab === 'menu' && (
          <div className="admin-content">
            {/* Message */}
            {menuMessage.text && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.625rem',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                fontWeight: 500,
                background: menuMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
                color: menuMessage.type === 'success' ? '#16a34a' : '#dc2626',
                border: `1px solid ${menuMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
              }}>
                {menuMessage.text}
              </div>
            )}

            {/* Description */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              border: '1px solid #e5e7eb',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                상단 메뉴의 각 항목이 클릭되었을 때 이동할 외부 사이트 URL을 관리할 수 있습니다.
                변경 사항은 저장 후 모든 사용자에게 적용됩니다.
              </p>
            </div>

            {/* Add New Menu */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              border: '1px solid #e5e7eb',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1rem',
                fontWeight: 700,
                color: '#0f1e3a',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <Plus size={18} style={{ color: '#ff8031' }} />
                새 메뉴 추가
              </h3>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    메뉴 이름
                  </label>
                  <input
                    type="text"
                    value={newMenuName}
                    onChange={e => setNewMenuName(e.target.value)}
                    placeholder="예: Partners"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.875rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.625rem',
                      color: '#0f1e3a',
                      fontSize: '0.875rem',
                      fontFamily: "'Inter', sans-serif",
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    링크 URL
                  </label>
                  <input
                    type="text"
                    value={newMenuLink}
                    onChange={e => setNewMenuLink(e.target.value)}
                    placeholder="https://example.com"
                    onKeyDown={e => { if (e.key === 'Enter') handleAddMenu(); }}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.875rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.625rem',
                      color: '#0f1e3a',
                      fontSize: '0.875rem',
                      fontFamily: "'Inter', sans-serif",
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <button
                  onClick={handleAddMenu}
                  disabled={!newMenuName.trim()}
                  style={{
                    padding: '0.65rem 1.25rem',
                    background: newMenuName.trim() ? 'linear-gradient(135deg, #ff8031, #ff5500)' : '#e2e8f0',
                    color: newMenuName.trim() ? 'white' : '#94a3b8',
                    border: 'none',
                    borderRadius: '0.625rem',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    fontFamily: "'Inter', sans-serif",
                    cursor: newMenuName.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Plus size={16} />
                  추가
                </button>
              </div>
            </div>

            {/* Menu List */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #e5e7eb',
                background: '#f8fafc',
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  등록된 메뉴 ({menuItems.length})
                </span>
              </div>

              {menuLoading ? (
                <div className="admin-loading">
                  <div className="admin-spinner-lg" />
                </div>
              ) : menuItems.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                  <Menu size={40} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                  <p>등록된 메뉴가 없습니다.</p>
                </div>
              ) : (
                <div>
                  {menuItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      style={{
                        padding: '1rem 1.5rem',
                        borderBottom: idx < menuItems.length - 1 ? '1px solid #f1f5f9' : 'none',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fafbfc'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      {editingMenuId === item.id ? (
                        /* Edit mode */
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={editMenuName}
                            onChange={e => setEditMenuName(e.target.value)}
                            autoFocus
                            style={{
                              flex: 1,
                              padding: '0.5rem 0.75rem',
                              background: '#f8fafc',
                              border: '1px solid #ff8031',
                              borderRadius: '0.5rem',
                              color: '#0f1e3a',
                              fontSize: '0.875rem',
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 600,
                              outline: 'none',
                              boxShadow: '0 0 0 3px rgba(255,128,49,0.1)',
                            }}
                          />
                          <input
                            type="text"
                            value={editMenuLink}
                            onChange={e => setEditMenuLink(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleSaveEditMenu(); if (e.key === 'Escape') handleCancelEditMenu(); }}
                            style={{
                              flex: 2,
                              padding: '0.5rem 0.75rem',
                              background: '#f8fafc',
                              border: '1px solid #ff8031',
                              borderRadius: '0.5rem',
                              color: '#0f1e3a',
                              fontSize: '0.875rem',
                              fontFamily: "'Inter', sans-serif",
                              outline: 'none',
                              boxShadow: '0 0 0 3px rgba(255,128,49,0.1)',
                            }}
                          />
                          <button
                            onClick={handleSaveEditMenu}
                            style={{
                              width: '32px', height: '32px', borderRadius: '0.5rem',
                              background: '#dcfce7', border: 'none', color: '#16a34a',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={handleCancelEditMenu}
                            style={{
                              width: '32px', height: '32px', borderRadius: '0.5rem',
                              background: '#fee2e2', border: 'none', color: '#dc2626',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        /* Display mode */
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '0.5rem',
                            background: 'rgba(255,128,49,0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#ff8031', flexShrink: 0,
                          }}>
                            <LinkIcon size={16} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem', display: 'block' }}>
                              {item.name}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                              {item.link}
                            </span>
                          </div>
                          {item.link !== '#' && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="admin-action-btn admin-action-link"
                              title="링크 열기"
                            >
                              <ExternalLink size={15} />
                            </a>
                          )}
                          <button
                            onClick={() => startEditMenu(item)}
                            className="admin-action-btn admin-action-edit"
                            title="수정"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteMenu(item.id)}
                            className="admin-action-btn admin-action-delete"
                            title="삭제"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="admin-content">
            {/* Account Info */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              border: '1px solid #e5e7eb',
              padding: '1.75rem',
              marginBottom: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              maxWidth: '600px',
            }}>
              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#0f1e3a',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <Shield size={18} style={{ color: '#ff8031' }} />
                계정 정보
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b', fontSize: '0.875rem' }}>이메일</span>
                  <span style={{ color: '#1e293b', fontWeight: 500, fontSize: '0.875rem' }}>{user.user.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0' }}>
                  <span style={{ color: '#64748b', fontSize: '0.875rem' }}>역할</span>
                  <span style={{ color: '#1e293b', fontWeight: 500, fontSize: '0.875rem' }}>관리자 (Admin)</span>
                </div>
              </div>
            </div>

            {/* Password Change */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              border: '1px solid #e5e7eb',
              padding: '1.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              maxWidth: '600px',
            }}>
              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#0f1e3a',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <KeyRound size={18} style={{ color: '#ff8031' }} />
                비밀번호 변경
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                비밀번호를 변경하면 {user.user.email}로 인증 코드가 발송됩니다.
              </p>

              {/* Success/Error Message */}
              {pwMessage.text && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.625rem',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  background: pwMessage.type === 'success' ? '#dcfce7' : pwMessage.type === 'error' ? '#fee2e2' : '#e0f2fe',
                  color: pwMessage.type === 'success' ? '#16a34a' : pwMessage.type === 'error' ? '#dc2626' : '#0284c7',
                  border: `1px solid ${pwMessage.type === 'success' ? '#bbf7d0' : pwMessage.type === 'error' ? '#fecaca' : '#bae6fd'}`,
                }}>
                  {pwMessage.text}
                </div>
              )}

              {pwStep === 0 && (
                <button
                  onClick={() => { setPwStep(1); setPwMessage({ type: '', text: '' }); }}
                  style={{
                    padding: '0.7rem 1.5rem',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.625rem',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.target.style.background = '#e2e8f0'; }}
                  onMouseLeave={e => { e.target.style.background = '#f1f5f9'; }}
                >
                  <Lock size={16} />
                  비밀번호 변경하기
                </button>
              )}

              {/* Step 1: Enter new password */}
              {pwStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      새 비밀번호
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="새 비밀번호 입력"
                        style={{
                          width: '100%',
                          padding: '0.7rem 2.5rem 0.7rem 0.875rem',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.625rem',
                          color: '#0f1e3a',
                          fontSize: '0.875rem',
                          fontFamily: "'Inter', sans-serif",
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        style={{
                          position: 'absolute',
                          right: '0.5rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          display: 'flex',
                        }}
                      >
                        {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      비밀번호 확인
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="비밀번호 다시 입력"
                      style={{
                        width: '100%',
                        padding: '0.7rem 0.875rem',
                        background: '#f8fafc',
                        border: `1px solid ${confirmPassword && confirmPassword !== newPassword ? '#ef4444' : '#e2e8f0'}`,
                        borderRadius: '0.625rem',
                        color: '#0f1e3a',
                        fontSize: '0.875rem',
                        fontFamily: "'Inter', sans-serif",
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    {confirmPassword && confirmPassword !== newPassword && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>비밀번호가 일치하지 않습니다.</p>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                    <button
                      onClick={() => { setPwStep(0); setNewPassword(''); setConfirmPassword(''); setPwMessage({ type: '', text: '' }); }}
                      style={{
                        padding: '0.7rem 1.25rem',
                        background: '#f1f5f9',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.625rem',
                        color: '#64748b',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      취소
                    </button>
                    <button
                      onClick={async () => {
                        if (!newPassword || newPassword.length < 4) {
                          setPwMessage({ type: 'error', text: '비밀번호는 최소 4자 이상이어야 합니다.' });
                          return;
                        }
                        if (newPassword !== confirmPassword) {
                          setPwMessage({ type: 'error', text: '비밀번호가 일치하지 않습니다.' });
                          return;
                        }
                        setPwLoading(true);
                        setPwMessage({ type: '', text: '' });
                        try {
                          const config = { headers: { Authorization: user.token } };
                          const res = await axios.post(`${API_BASE}/api/send-verification-code`, { newPassword }, config);
                          setEmailSent(res.data.emailSent);
                          setPwStep(2);
                          setPwMessage({
                            type: 'info',
                            text: res.data.emailSent
                              ? `인증 코드가 ${user.user.email}로 발송되었습니다. 5분 내에 입력하세요.`
                              : `인증 코드가 생성되었습니다. ${res.data.hint || '서버 콘솔을 확인하세요.'}`
                          });
                        } catch (err) {
                          setPwMessage({ type: 'error', text: err.response?.data?.message || '인증 코드 발송에 실패했습니다.' });
                        } finally {
                          setPwLoading(false);
                        }
                      }}
                      disabled={pwLoading || !newPassword || newPassword !== confirmPassword}
                      style={{
                        padding: '0.7rem 1.5rem',
                        background: (!newPassword || newPassword !== confirmPassword) ? '#e2e8f0' : 'linear-gradient(135deg, #ff8031, #ff5500)',
                        color: (!newPassword || newPassword !== confirmPassword) ? '#94a3b8' : 'white',
                        border: 'none',
                        borderRadius: '0.625rem',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: (!newPassword || newPassword !== confirmPassword) ? 'not-allowed' : 'pointer',
                        fontFamily: "'Inter', sans-serif",
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        boxShadow: (!newPassword || newPassword !== confirmPassword) ? 'none' : '0 4px 14px rgba(255,128,49,0.25)',
                      }}
                    >
                      {pwLoading ? (
                        <span style={{
                          width: '16px', height: '16px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: 'white',
                          borderRadius: '50%',
                          animation: 'spin 0.7s linear infinite',
                          display: 'inline-block',
                        }} />
                      ) : (
                        <>
                          <Mail size={16} />
                          인증 코드 발송
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Enter verification code */}
              {pwStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      인증 코드 (6자리)
                    </label>
                    <input
                      type="text"
                      value={verifyCode}
                      onChange={e => {
                        const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                        setVerifyCode(v);
                      }}
                      placeholder="000000"
                      maxLength={6}
                      autoFocus
                      style={{
                        width: '200px',
                        padding: '0.8rem 1rem',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.625rem',
                        color: '#0f1e3a',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        fontFamily: "'Inter', sans-serif",
                        outline: 'none',
                        letterSpacing: '0.3em',
                        textAlign: 'center',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => {
                        setPwStep(0);
                        setNewPassword('');
                        setConfirmPassword('');
                        setVerifyCode('');
                        setPwMessage({ type: '', text: '' });
                      }}
                      style={{
                        padding: '0.7rem 1.25rem',
                        background: '#f1f5f9',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.625rem',
                        color: '#64748b',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      취소
                    </button>
                    <button
                      onClick={async () => {
                        if (verifyCode.length !== 6) {
                          setPwMessage({ type: 'error', text: '6자리 인증 코드를 입력하세요.' });
                          return;
                        }
                        setPwLoading(true);
                        setPwMessage({ type: '', text: '' });
                        try {
                          const config = { headers: { Authorization: user.token } };
                          await axios.post(`${API_BASE}/api/change-password`, { code: verifyCode }, config);
                          setPwMessage({ type: 'success', text: '비밀번호가 성공적으로 변경되었습니다! 다음 로그인부터 새 비밀번호를 사용하세요.' });
                          setPwStep(0);
                          setNewPassword('');
                          setConfirmPassword('');
                          setVerifyCode('');
                        } catch (err) {
                          setPwMessage({ type: 'error', text: err.response?.data?.message || '비밀번호 변경에 실패했습니다.' });
                        } finally {
                          setPwLoading(false);
                        }
                      }}
                      disabled={pwLoading || verifyCode.length !== 6}
                      style={{
                        padding: '0.7rem 1.5rem',
                        background: verifyCode.length !== 6 ? '#e2e8f0' : 'linear-gradient(135deg, #ff8031, #ff5500)',
                        color: verifyCode.length !== 6 ? '#94a3b8' : 'white',
                        border: 'none',
                        borderRadius: '0.625rem',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: verifyCode.length !== 6 ? 'not-allowed' : 'pointer',
                        fontFamily: "'Inter', sans-serif",
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        boxShadow: verifyCode.length !== 6 ? 'none' : '0 4px 14px rgba(255,128,49,0.25)',
                      }}
                    >
                      {pwLoading ? (
                        <span style={{
                          width: '16px', height: '16px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: 'white',
                          borderRadius: '50%',
                          animation: 'spin 0.7s linear infinite',
                          display: 'inline-block',
                        }} />
                      ) : (
                        <>
                          <Check size={16} />
                          비밀번호 변경 확인
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <NewsEditModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditingNews(null); }}
        onSave={handleSaveNews}
        initialData={editingNews}
        categories={categories}
      />


    </div>
  );
};

export default AdminDashboard;
