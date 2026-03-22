import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from '../api';
import { Search, Globe, User, ChevronDown, Settings, Menu, X } from 'lucide-react';

const Header = ({ onSearch, user, onLoginClick, onLogout, isAdmin, onMenuEditClick }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/menu`);
        setMenuItems(res.data);
      } catch (e) {
        console.error("Error fetching menu items:", e);
      }
    };
    fetchMenu();
  }, []);

  return (
    <header>
      <div className="logo-container" onClick={() => window.location.href = '/'}>
        <img src="/logo.png" alt="Decarva" style={{ height: '40px', width: 'auto' }} />
        <span className="logo-text">DECARVA</span>
      </div>

      <nav className={`top-nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <a href="https://www.co-fleeter.com" target="_blank" rel="noopener noreferrer" className="top-nav-item">Co-Fleeter</a>
        <a href="https://ssrpms.onrender.com" target="_blank" rel="noopener noreferrer" className="top-nav-item">SSRPMS</a>
        <div className="top-nav-item">Services <ChevronDown size={14} /></div>
        <div className="top-nav-item">Resources <ChevronDown size={14} /></div>
        <div className="top-nav-item">About <ChevronDown size={14} /></div>
      </nav>

      <div className={`header-right ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <button className="search-icon-btn"><Search size={22} /></button>
        <button className="global-icon-btn"><Globe size={22} /></button>
        
        <button className="btn-demo">Request Demo</button>
        
        {user && user.user ? (
          <div className="flex items-center gap-4 user-info-container">
             {isAdmin && (
              <button 
                onClick={onMenuEditClick} 
                className="btn-login-outline" 
                style={{ height: '38px', padding: '0 1rem', borderStyle: 'dashed', borderColor: '#cbd5e1' }}
              >
                <Settings size={18} /> Admin
              </button>
            )}
            <div className="flex items-center gap-2 font-bold text-[#0f1e3a]">
              <User size={20} />
              <span>{user.user.email.split('@')[0]}</span>
            </div>
            <button onClick={onLogout} className="btn-login-outline" style={{ height: '38px', padding: '0 1rem' }}>Log Out</button>
          </div>
        ) : (
          <button onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }} className="btn-login-outline">
            <User size={18} /> Log In
          </button>
        )}
      </div>

      <button 
        className="mobile-menu-toggle" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
    </header>
  );
};

export default Header;
