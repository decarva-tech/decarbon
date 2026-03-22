import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, Link as LinkIcon, Type, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NewsEditModal = ({ isOpen, onClose, onSave, initialData = null }) => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl glass p-8 rounded-2xl border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">
              {initialData ? '뉴스 수정' : '새 뉴스 작성'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">제목</label>
                  <div className="relative">
                    <Type className="absolute left-3 top-3 text-slate-500" size={18} />
                    <input 
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-[#0f1e3a] focus:border-[#ff8031] outline-none"
                      placeholder="뉴스 제목을 입력하세요"
                      required
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">요약</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-slate-500" size={18} />
                    <textarea 
                      name="summary"
                      value={formData.summary}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-[#0f1e3a] focus:border-[#ff8031] outline-none min-h-[100px]"
                      placeholder="내용 요약을 입력하세요"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">이미지 URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-3 text-slate-500" size={18} />
                    <input 
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-[#0f1e3a] focus:border-[#ff8031] outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">외부 링크</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 text-slate-500" size={18} />
                    <input 
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-[#0f1e3a] focus:border-[#ff8031] outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">출처</label>
                  <input 
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-4 text-[#0f1e3a] focus:border-[#ff8031] outline-none"
                    placeholder="예: Maritime News"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">카테고리</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 px-4 text-white focus:border-blue-500 outline-none"
                  >
                    <option value="Shipping">Shipping</option>
                    <option value="IT">IT</option>
                    <option value="Shipbuilding">Shipbuilding</option>
                    <option value="Market">Market</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-all"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} />
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

export default NewsEditModal;
