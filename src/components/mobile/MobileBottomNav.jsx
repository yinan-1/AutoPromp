import React from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * 移动端底部导航栏组件
 * 包含主页、编辑器、设置三个标签以及主题切换按钮
 *
 * @param {Object} props
 * @param {string} props.mobileTab - 当前激活的标签
 * @param {Function} props.setMobileTab - 设置标签的函数
 * @param {Function} props.setDiscoveryView - 设置发现页视图的函数
 * @param {Function} props.setZoomedImage - 设置预览图片的函数
 * @param {Function} props.setIsTemplatesDrawerOpen - 设置模版抽屉打开状态
 * @param {Function} props.setIsBanksDrawerOpen - 设置词库抽屉打开状态
 * @param {boolean} props.isDarkMode - 是否暗色模式
 * @param {string} props.themeMode - 主题模式 ('light' | 'dark' | 'system')
 * @param {Function} props.setThemeMode - 设置主题模式的函数
 * @param {Array} props.templates - 模版列表
 * @param {string} props.activeTemplateId - 当前激活的模版 ID
 * @param {Function} props.setActiveTemplateId - 设置激活模版的函数
 */
const MobileBottomNav = ({
  mobileTab,
  setMobileTab,
  setDiscoveryView,
  setZoomedImage,
  setIsTemplatesDrawerOpen,
  setIsBanksDrawerOpen,
  isDarkMode,
  themeMode,
  setThemeMode,
  templates,
  activeTemplateId,
  setActiveTemplateId,
}) => {
  // 主页按钮
  const handleHomeClick = () => {
    setMobileTab('home');
    setDiscoveryView(true);
    setZoomedImage(null);
    setIsTemplatesDrawerOpen(false);
    setIsBanksDrawerOpen(false);
  };

  // 编辑器按钮
  const handleEditorClick = () => {
    setDiscoveryView(false);
    setZoomedImage(null);
    setIsTemplatesDrawerOpen(false);
    setIsBanksDrawerOpen(false);
    // 强制确保有模板被选中
    if (templates.length > 0 && !activeTemplateId) {
      const firstId = templates[0].id;
      setActiveTemplateId(firstId);
    }
    setMobileTab('editor');
  };

  // 设置按钮
  const handleSettingsClick = () => {
    setMobileTab('settings');
    setDiscoveryView(false);
    setZoomedImage(null);
    setIsTemplatesDrawerOpen(false);
    setIsBanksDrawerOpen(false);
  };

  // 主题切换按钮 (循环：Light -> Dark -> System)
  const handleThemeToggle = () => {
    if (themeMode === 'light') setThemeMode('dark');
    else if (themeMode === 'dark') setThemeMode('system');
    else setThemeMode('light');
  };

  return (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-2xl border-t flex justify-around items-center z-[250] h-16 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.05)] transition-colors duration-300 ${isDarkMode ? 'bg-[#181716]/25 border-white/5' : 'bg-white/25 border-white/30'}`}>
      {/* 主页 */}
      <button
        onClick={handleHomeClick}
        className="flex flex-col items-center justify-center w-full h-full transition-all active:scale-90 group"
      >
        <div className={`p-2 rounded-xl transition-all ${mobileTab === 'home' ? (isDarkMode ? 'bg-white/5' : 'bg-orange-50/50') : ''}`}>
          <div
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: mobileTab === 'home' ? '#EA580C' : (isDarkMode ? '#8E9196' : '#6B7280'),
              WebkitMaskImage: 'url(/home.svg)',
              maskImage: 'url(/home.svg)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              filter: isDarkMode ? 'none' : 'drop-shadow(1px 1px 0px rgba(255,255,255,0.3))'
            }}
          />
        </div>
      </button>

      {/* 模版详情 (编辑器) */}
      <button
        onClick={handleEditorClick}
        className="flex flex-col items-center justify-center w-full h-full transition-all active:scale-90 group"
      >
        <div className={`p-2 rounded-xl transition-all ${mobileTab === 'editor' ? (isDarkMode ? 'bg-white/5' : 'bg-orange-50/50') : ''}`}>
          <div
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: mobileTab === 'editor' ? '#EA580C' : (isDarkMode ? '#8E9196' : '#6B7280'),
              WebkitMaskImage: 'url(/list.svg)',
              maskImage: 'url(/list.svg)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              filter: isDarkMode ? 'none' : 'drop-shadow(1px 1px 0px rgba(255,255,255,0.3))'
            }}
          />
        </div>
      </button>

      {/* 设置 */}
      <button
        onClick={handleSettingsClick}
        className="flex flex-col items-center justify-center w-full h-full transition-all active:scale-90 group"
      >
        <div className={`p-2 rounded-xl transition-all ${mobileTab === 'settings' ? (isDarkMode ? 'bg-white/5' : 'bg-orange-50/50') : ''}`}>
          <div
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: mobileTab === 'settings' ? '#EA580C' : (isDarkMode ? '#8E9196' : '#6B7280'),
              WebkitMaskImage: 'url(/setting.svg)',
              maskImage: 'url(/setting.svg)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              filter: isDarkMode ? 'none' : 'drop-shadow(1px 1px 0px rgba(255,255,255,0.3))'
            }}
          />
        </div>
      </button>

      {/* 暗色模式切换 (循环：Light -> Dark -> System) */}
      <button
        onClick={handleThemeToggle}
        className="flex flex-col items-center justify-center w-full h-full transition-all active:scale-90 group relative"
        title={themeMode === 'system' ? 'Follow System' : (themeMode === 'dark' ? 'Dark Mode' : 'Light Mode')}
      >
        <div className="p-2 rounded-xl transition-all">
          <div className={`${isDarkMode ? 'text-[#8E9196]' : 'text-[#6B7280]'} transition-colors`}>
            {themeMode === 'system' ? (
              <div className="relative">
                <Sun size={24} className="opacity-50" />
                <Moon size={14} className="absolute -bottom-1 -right-1" />
              </div>
            ) : (themeMode === 'dark' ? <Moon size={24} /> : <Sun size={24} />)}
          </div>
        </div>
        {themeMode === 'system' && (
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
        )}
      </button>
    </div>
  );
};

export default MobileBottomNav;
