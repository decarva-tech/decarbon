import React, { useState, useEffect } from 'react';
import { X, Save, Link as LinkIcon, Ship, ShoppingCart, Anchor, Laptop, Hammer } from 'lucide-react';
import axios from 'axios';

const MenuManagementModal = ({ isOpen, onClose, user, onSaveSuccess }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const iconMap = {
    'co-fleeter': Ship,
    'marine-market': ShoppingCart,
    'shipping': Anchor,
    'it': Laptop,
    'shipbuilding': Hammer
  };

  useEffect(() => {
    if (isOpen) {
      fetchMenu();
    }
  }, [isOpen]);

  const fetchMenu = async () => {
    try {
      const res = await axios.get('http://localhost:8800/api/menu');
      setMenuItems(res.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const handleChange = (id, newLink) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, link: newLink } : item
    ));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: user.token }
      };
      await axios.put('http://localhost:8800/api/menu', menuItems, config);
      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving menu items:", error);
      alert("메뉴 수정을 저장하는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-[#0f1e3a] font-outfit">
            <LinkIcon size={24} className="text-[#ff8031]" />
            메뉴 링크 관리
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="modal-body py-4">
          <p className="text-sm text-slate-500 mb-6">
            상단 메뉴의 각 항목이 클릭되었을 때 이동할 외부 사이트 URL을 관리할 수 있습니다. 
            변경 사항은 저장 후 모든 사용자에게 적용됩니다.
          </p>
          
          <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {menuItems.map((item) => {
              const Icon = iconMap[item.id] || Anchor;
              return (
                <div key={item.id} className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#ff8031]/10 flex items-center justify-center text-[#ff8031]">
                      <Icon size={20} />
                    </div>
                    <span className="font-bold text-[#0f1e3a]">{item.name}</span>
                  </div>
                  <div className="relative" style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={item.link}
                      onChange={(e) => handleChange(item.id, e.target.value)}
                      placeholder="https://example.com"
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-[#0f1e3a] focus:border-[#ff8031] transition-colors pl-10 outline-none"
                      style={{ width: '100%', paddingLeft: '2.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: 'white' }}
                    />
                    <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer flex gap-3 justify-end mt-8" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.75rem 1.5rem', borderRadius: '0.75rem' }}
          >
            취소
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="btn-demo"
            style={{ padding: '0.75rem 2rem' }}
          >
            {loading ? "저장 중..." : "변경 사항 저장"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuManagementModal;
