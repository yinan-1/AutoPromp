import React from 'react';
import { TAG_LABELS } from '../constants/styles';

/**
 * TagSidebar 组件 - 侧边 Tag 栏
 * 包含库源筛选和分类筛选功能
 */
export const TagSidebar = ({
  // 数据和状态
  TEMPLATE_TAGS = [],
  selectedTags = '',
  selectedLibrary = 'all',

  // 回调函数
  setSelectedTags,
  setSelectedLibrary,

  // 样式和主题
  isDarkMode = false,
  language = 'cn'
}) => {
  // 如果是移动设备，不渲染此组件
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  if (isMobile) {
    return null;
  }

  return (
    <div
      style={{
        width: '140px',
        height: '100%',
        borderRadius: '24px',
        border: '1px solid transparent',
        backgroundImage: isDarkMode
          ? 'linear-gradient(180deg, #3B3B3B 0%, #242120 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)'
          : 'linear-gradient(180deg, #FAF5F1 0%, #F6EBE6 100%), linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
      className="hidden lg:flex flex-col flex-shrink-0 pt-12 pb-8 px-3 gap-8 overflow-y-auto custom-scrollbar"
    >
      {/* 库源筛选 */}
      <div className="flex flex-col gap-3">
        <h3 className={`text-xs font-bold uppercase px-4 opacity-50 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {language === 'cn' ? '库源' : 'Library'}
        </h3>
        <div className="flex flex-col gap-1">
          {[
            { id: 'all', cn: '全部', en: 'All' },
            { id: 'official', cn: '官方库', en: 'Official' },
            { id: 'personal', cn: '个人库', en: 'Personal' }
          ].map(lib => (
            <button
              key={lib.id}
              onClick={() => setSelectedLibrary(lib.id)}
              className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 group ${
                selectedLibrary === lib.id
                  ? (isDarkMode ? 'bg-[#F48B42]/10 text-[#FB923C]' : 'bg-[#F9BC8F]/20 text-[#EA580C]')
                  : (isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50/50')
              }`}
            >
              <span className={`text-sm font-bold ${selectedLibrary === lib.id ? 'translate-x-1' : 'group-hover:translate-x-1'} transition-transform inline-block`}>
                {language === 'cn' ? lib.cn : lib.en}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-col gap-3">
        <h3 className={`text-xs font-bold uppercase px-4 opacity-50 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {language === 'cn' ? '分类' : 'Categories'}
        </h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setSelectedTags('')}
            className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 group ${
              selectedTags === ''
                ? (isDarkMode ? 'bg-[#F48B42]/10 text-[#FB923C]' : 'bg-[#F9BC8F]/20 text-[#EA580C]')
                : (isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50/50')
            }`}
          >
            <span className={`text-sm font-bold ${selectedTags === '' ? 'translate-x-1' : 'group-hover:translate-x-1'} transition-transform inline-block`}>
              {language === 'cn' ? '全部' : 'All'}
            </span>
          </button>

          {TEMPLATE_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTags(tag)}
              className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 group ${
                selectedTags === tag
                  ? (isDarkMode ? 'bg-[#F48B42]/10 text-[#FB923C]' : 'bg-[#F9BC8F]/20 text-[#EA580C]')
                  : (isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50/50')
              }`}
            >
              <span className={`text-sm font-bold ${selectedTags === tag ? 'translate-x-1' : 'group-hover:translate-x-1'} transition-transform inline-block`}>
                {language === 'cn' ? (TAG_LABELS.cn[tag] || tag) : (TAG_LABELS.en[tag] || tag)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
