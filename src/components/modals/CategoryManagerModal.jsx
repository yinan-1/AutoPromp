import React, { useState, useRef, useEffect } from 'react';
import { List, Plus, X, Trash2, Pencil } from 'lucide-react';
import { CATEGORY_STYLES, PREMIUM_STYLES } from '../../constants/styles';
import { getLocalized } from '../../utils/helpers';
import { PremiumButton } from '../PremiumButton';

/**
 * 词库分类管理弹窗组件
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - 是否打开弹窗
 * @param {Function} props.onClose - 关闭弹窗回调
 * @param {Object} props.categories - 分类对象
 * @param {Function} props.setCategories - 设置分类的函数
 * @param {Object} props.banks - 词库对象
 * @param {Function} props.setBanks - 设置词库的函数
 * @param {Function} props.t - 翻译函数
 * @param {string} props.language - 当前语言
 * @param {boolean} props.isDarkMode - 是否暗色模式
 */
export const CategoryManagerModal = ({
  isOpen,
  onClose,
  categories,
  setCategories,
  banks,
  setBanks,
  t,
  language,
  isDarkMode
}) => {
  const [newCatName, setNewCatName] = useState("");
  const [newCatColor, setNewCatColor] = useState("slate");
  const [editingCatId, setEditingCatId] = useState(null);
  const [tempCatName, setTempCatName] = useState("");
  
  // 用于控制颜色面板打开状态
  const [openPickerId, setOpenPickerId] = useState(null); // 'new' or catId

  const availableColors = Object.keys(CATEGORY_STYLES);

  // 点击外部关闭色盘
  useEffect(() => {
    const handleClickOutside = () => setOpenPickerId(null);
    if (openPickerId) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [openPickerId]);

  if (!isOpen) return null;

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const newId = `cat_${Date.now()}`;

    setCategories(prev => ({
      ...prev,
      [newId]: { id: newId, label: newCatName, color: newCatColor }
    }));
    setNewCatName("");
    setNewCatColor("slate");
  };

  const handleDeleteCategory = (catId) => {
    if (catId === 'other') return; // Cannot delete default

    const catName = getLocalized(categories[catId].label, language);
    if (window.confirm(t('delete_category_confirm', { name: catName }))) {
       // 1. Update banks to use 'other'
       const updatedBanks = { ...banks };
       Object.keys(updatedBanks).forEach(key => {
           if (updatedBanks[key].category === catId) {
               updatedBanks[key].category = 'other';
           }
       });
       setBanks(updatedBanks);

       // 2. Remove category
       const updatedCats = { ...categories };
       delete updatedCats[catId];
       setCategories(updatedCats);
    }
  };

  const startEditing = (cat) => {
    setEditingCatId(cat.id);
    setTempCatName(getLocalized(cat.label, language));
  };

  const saveEditing = () => {
    if (!tempCatName.trim()) return;
    setCategories(prev => {
      const cat = prev[editingCatId];
      const newLabel = typeof cat.label === 'object' ? { ...cat.label, [language]: tempCatName } : tempCatName;
      return {
        ...prev,
        [editingCatId]: { ...cat, label: newLabel }
      };
    });
    setEditingCatId(null);
  };

  const changeColor = (catId, color) => {
    setCategories(prev => ({
      ...prev,
      [catId]: { ...prev[catId], color }
    }));
    setOpenPickerId(null);
  };

  /**
   * 渲染颜色选择控件
   * @param {string} direction - 'up' 或 'down'，控制弹出方向
   */
  const renderColorPicker = (id, currentColor, onColorSelect, direction = 'up') => {
    const isPickerOpen = openPickerId === id;
    const colorStyle = PREMIUM_STYLES[currentColor];

    return (
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setOpenPickerId(isPickerOpen ? null : id)}
          className={`w-7 h-7 rounded-lg transition-all duration-200 shadow-sm flex items-center justify-center border-2 ${
            isDarkMode 
              ? 'bg-white/5 border-white/10 hover:bg-white/10' 
              : 'bg-white/40 border-gray-200 hover:bg-white hover:border-gray-300'
          }`}
          style={{ backgroundColor: colorStyle?.from || '#64748B' }}
          title={language === 'cn' ? '选择颜色' : (t('select_color') || 'Select Color')}
        >
        </button>

        {isPickerOpen && (
          <div 
            className={`
              absolute right-0 grid grid-cols-4 gap-2 p-3 border shadow-2xl rounded-2xl z-[100] w-40 animate-in fade-in zoom-in-95 duration-200
              ${direction === 'up' ? 'bottom-full mb-3' : 'top-full mt-3'}
              ${isDarkMode ? 'bg-[#2A2726] border-white/10 shadow-black/60' : 'bg-white border-gray-200 shadow-gray-200/50'}
            `}
          >
            {availableColors.map(c => {
              const optionStyle = PREMIUM_STYLES[c];
              return (
                <div
                  key={c}
                  onClick={() => onColorSelect(c)}
                  className={`w-7 h-7 rounded-lg cursor-pointer hover:scale-110 transition-transform border-2 ${
                    currentColor === c ? 'border-orange-500 scale-110' : (isDarkMode ? 'border-white/5' : 'border-gray-100')
                  }`}
                  style={{ backgroundColor: optionStyle?.from }}
                  title={c}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border animate-in slide-in-from-bottom-4 duration-300 ${isDarkMode ? 'bg-[#1C1917] border-white/5' : 'bg-white border-gray-100'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 flex justify-between items-center ${isDarkMode ? 'bg-white/[0.02]' : 'bg-gray-50/50'}`}>
          <h3 className={`font-black text-lg tracking-tight ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {language === 'cn' ? '词库分类管理' : (t('manage_categories') || 'Manage Categories')}
          </h3>
          <button
            onClick={onClose}
            className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/10 text-gray-500 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - 开启色盘时通过动态类名允许溢出，彻底防止裁切 */}
        <div className={`p-8 py-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar relative ${openPickerId ? 'overflow-y-visible' : ''}`}>
          {/* Add New Category */}
          <section className={`relative ${openPickerId === 'new' ? 'z-[50]' : 'z-[10]'}`}>
            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              {language === 'cn' ? '增加新词库分类' : (t('add_new_category') || 'Add New Category')}
            </label>
            <div className="flex gap-3 items-center">
              <input
                autoFocus
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder={language === 'cn' ? '输入分类名称...' : (t('category_name_placeholder') || 'Enter category name...')}
                className={`flex-1 text-sm font-bold rounded-xl px-5 py-3 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all ${isDarkMode ? 'bg-white/5 border border-white/10 text-gray-200 placeholder:text-gray-700' : 'border border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400'}`}
              />
              
              {/* 新增区域向下弹出 */}
              {renderColorPicker('new', newCatColor, (c) => setNewCatColor(c), 'down')}

              <PremiumButton
                onClick={handleAddCategory}
                disabled={!newCatName.trim()}
                active={true}
                isDarkMode={isDarkMode}
                className="!h-10 !rounded-xl"
              >
                <span className="text-sm font-black tracking-widest px-6">{language === 'cn' ? '添加' : (t('add') || 'Add')}</span>
              </PremiumButton>
            </div>
          </section>

          {/* Category List */}
          <section className="relative z-[10]">
            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              {language === 'cn' ? '词库列表' : (t('category_list') || 'Category List')}
            </label>
            <div className="grid gap-4">
              {Object.values(categories).map(cat => {
                const colorKey = cat.color || 'slate';
                const premium = PREMIUM_STYLES[colorKey] || PREMIUM_STYLES.slate;
                const isCurrentPickerOpen = openPickerId === cat.id;
                
                return (
                  <div
                    key={cat.id}
                    // 核心修复：开启色盘时动态提升整行的 z-index，确保其处于所有词条行的最上方
                    className={`relative group/card cursor-default transition-all duration-300 hover:translate-y-[-1px] ml-1.5 ${isCurrentPickerOpen ? 'z-[50]' : 'z-10'}`}
                  >
                    {/* Tag */}
                    <div 
                      className="absolute top-[16px] w-[6px] -left-[6px] transition-all duration-300 rounded-l-[4px] z-10 group-hover/card:w-[12px] group-hover/card:-left-[12px]"
                      style={{ 
                        backgroundColor: premium.from,
                        height: '16px'
                      }}
                    />

                    {/* Card Body */}
                    <div 
                      className="rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-3 flex items-center justify-between gap-4 relative z-20"
                      style={{
                        background: isDarkMode 
                          ? 'linear-gradient(180deg, #393939 9%, #242220 99%) padding-box, linear-gradient(0deg, #1A1A1A 0%, #494949 96%) border-box'
                          : 'linear-gradient(180deg, #F0EAE5 9%, #DEDCDC 96%) padding-box, linear-gradient(0deg, #BFBFBF 0%, #FFFFFF 100%) border-box',
                        border: '2px solid transparent',
                        boxSizing: 'border-box',
                      }}
                    >
                      {/* Category Name Area */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        {editingCatId === cat.id ? (
                          <input
                            autoFocus
                            type="text"
                            value={tempCatName}
                            onChange={(e) => setTempCatName(e.target.value)}
                            onBlur={saveEditing}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEditing();
                              else if (e.key === 'Escape') setEditingCatId(null);
                            }}
                            className={`w-full text-sm font-bold rounded-lg px-2 py-1 outline-none transition-all ${isDarkMode ? 'bg-black/40 border-2 border-orange-500 text-white' : 'bg-white border-2 border-orange-400 text-gray-900'}`}
                          />
                        ) : (
                          <span className={`text-[14px] font-bold truncate tracking-tight transition-colors ${isDarkMode ? 'text-gray-300 group-hover/card:text-white' : 'text-gray-800 group-hover/card:text-gray-900'}`}>
                            {getLocalized(cat.label, language)}
                          </span>
                        )}
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] opacity-40 mt-0.5" style={{ color: premium.to }}>
                          {cat.id}
                        </span>
                      </div>

                      {/* Actions Area */}
                      <div className="flex items-center gap-1.5">
                        {/* 列表项向上弹出 */}
                        {renderColorPicker(cat.id, cat.color, (c) => changeColor(cat.id, c), 'up')}

                        <button
                          onClick={() => startEditing(cat)}
                          className={`p-2 rounded-xl transition-all duration-200 ${isDarkMode ? 'text-gray-500 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-white/40'}`}
                          title={t('edit') || '编辑'}
                        >
                          <Pencil size={14} />
                        </button>

                        {cat.id !== 'other' ? (
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className={`p-2 rounded-xl transition-all duration-200 ${isDarkMode ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-500 hover:text-red-600 hover:bg-red-50/50'}`}
                            title={t('delete') || '删除'}
                          >
                            <Trash2 size={14} />
                          </button>
                        ) : (
                          <div className="w-[30px]" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

CategoryManagerModal.displayName = 'CategoryManagerModal';

export default CategoryManagerModal;
