import React, { useState } from 'react';
import { X, User, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await onLogin(email, password);
    if (!success) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0f1e3a]/60 backdrop-blur-sm"
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(15, 30, 58, 0.6)', backdropFilter: 'blur(4px)' }}
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="modal-content"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#0f1e3a] mb-2 font-outfit">관리자 로그인</h2>
              <p className="text-slate-500 text-sm">Decarva 포탈 관리 권한을 사용하세요.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="block text-xs font-bold text-[#0f1e3a] uppercase tracking-wider mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-[#0f1e3a] focus:border-[#ff8031] focus:ring-1 focus:ring-[#ff8031] outline-none transition-all"
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
                    placeholder="decarvaadmin@decarva.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0f1e3a] uppercase tracking-wider mb-2 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-[#0f1e3a] focus:border-[#ff8031] focus:ring-1 focus:ring-[#ff8031] outline-none transition-all"
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', background: '#f8fafc', outline: 'none' }}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-600 text-sm text-center font-medium bg-red-50 py-3 rounded-lg border border-red-100">
                  {error}
                </p>
              )}

              <button 
                type="submit"
                className="w-full bg-[#0f1e3a] text-white py-4 rounded-xl font-bold hover:bg-[#1a2e4d] transition-all shadow-lg shadow-blue-900/10 mt-2"
                style={{ width: '100%', background: '#0f1e3a', color: 'white', padding: '1.25rem', borderRadius: '0.75rem', border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: '1rem', fontSize: '1rem' }}
              >
                로그인하기
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
