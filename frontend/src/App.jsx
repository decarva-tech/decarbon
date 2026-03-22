import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import NewsList from './components/NewsList';
import LoginModal from './components/LoginModal';
import NewsEditModal from './components/NewsEditModal';
import MenuManagementModal from './components/MenuManagementModal';
import { Newspaper, TrendingUp, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE from './api';

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Auth State
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // News Tool State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  // Menu Management State
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [sidebarKey, setSidebarKey] = useState(0); // To force re-render/re-fetch of Sidebar

  useEffect(() => {
    const savedUser = localStorage.getItem('decarva_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchNews();
  }, []);

  const fetchNews = async () => {
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

  const handleSearch = async (term) => {
    setSearchTerm(term);
    try {
      const url = term 
        ? `${API_BASE}/api/news/search?q=${term}` 
        : `${API_BASE}/api/news`;
      const res = await axios.get(url);
      setNews(res.data);
    } catch (error) {
      console.error("Error searching news:", error);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE}/api/login`, { email, password });
      const userData = res.data;
      setUser(userData);
      localStorage.setItem('decarva_user', JSON.stringify(userData));
      setIsLoginModalOpen(false);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('decarva_user');
  };

  const handleSaveNews = async (formData) => {
    try {
      const config = {
        headers: { Authorization: user.token }
      };
      
      if (editingNews) {
        await axios.put(`${API_BASE}/api/news/${editingNews.id}`, formData, config);
      } else {
        await axios.post(`${API_BASE}/api/news`, formData, config);
      }
      
      setIsEditModalOpen(false);
      setEditingNews(null);
      fetchNews();
    } catch (error) {
      console.error("Error saving news:", error);
      alert("뉴스를 저장하는 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm("정말로 이 뉴스를 삭제하시겠습니까?")) return;
    
    try {
      const config = {
        headers: { Authorization: user.token }
      };
      await axios.delete(`${API_BASE}/api/news/${id}`, config);
      fetchNews();
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  const openEditModal = (item = null) => {
    setEditingNews(item);
    setIsEditModalOpen(true);
  };

  const topNews = news.filter(n => n.isMain);
  const remainingNews = news.filter(n => !n.isMain);
  const isAdmin = user && user.user && user.user.role === 'admin';

  return (
    <div className="container">
      <Header 
        onSearch={handleSearch} 
        user={user}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        onMenuEditClick={() => setIsMenuModalOpen(true)}
      />
      
      <main>
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-8">
              {searchTerm ? (
                <h2 className="text-xl font-medium text-slate-500">
                  "{searchTerm}" 검색 결과 <span className="text-blue-600 font-bold">{news.length}</span>건
                </h2>
              ) : (
                <div />
              )}
              
              <div />
            </div>

            {!searchTerm && (
              <section className="mb-12">
                <h2 className="section-title">
                  <TrendingUp size={24} color="#ff8031" />
                  대표 뉴스
                </h2>
                <div className="top-news-grid">
                  {topNews.map((n, idx) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <NewsCard 
                        news={n} 
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="section-title">
                <Newspaper size={24} color="#ff8031" />
                {searchTerm ? '뉴스 검색 결과' : '최근 뉴스'}
              </h2>
              <AnimatePresence mode="wait">
                <motion.div
                  key={news.length}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                   <NewsList 
                    newsList={searchTerm ? news : remainingNews} 
                  />
                </motion.div>
              </AnimatePresence>
              
              {news.length === 0 && (
                <div className="text-center py-20 opacity-50">
                  <p>검색 결과가 없습니다.</p>
                </div>
              )}
            </section>
          </motion.div>
        )}
      </main>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <NewsEditModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingNews(null);
        }}
        onSave={handleSaveNews}
        initialData={editingNews}
      />

      <MenuManagementModal 
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        user={user}
        onSaveSuccess={() => setSidebarKey(prev => prev + 1)}
      />
    </div>
  );
}

export default App;
