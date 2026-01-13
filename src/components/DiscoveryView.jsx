import React, { useState, useEffect, useRef } from 'react';
import {
  ImageIcon, ArrowUpRight, Search, Plus
} from 'lucide-react';
import { getLocalized } from '../utils/helpers';
import { Sidebar } from './Sidebar';
import { TagSidebar } from './TagSidebar';
import { FireworkEffect } from './FireworkEffect';
import { FEATURE_FLAGS } from '../constants/featureFlags';
import { TAG_LABELS } from '../constants/styles';

/**
 * DiscoveryView 组件 - 瀑布流展示所有模板
 */
export const DiscoveryView = React.memo(({ 
  filteredTemplates,
  setActiveTemplateId,
  setDiscoveryView,
  setZoomedImage,
  posterScrollRef,
  setIsPosterAutoScrollPaused,
  currentMasonryStyle,
  AnimatedSlogan,
  isSloganActive = true,
  t,
  TAG_STYLES,
  displayTag,
  // Tools props
  handleRefreshSystemData,
  language,
  setLanguage,
  setIsSettingsOpen,
  isDarkMode,
  isSortMenuOpen,
  setIsSortMenuOpen,
  sortOrder,
  setSortOrder,
    setRandomSeed,
    searchQuery,
    setSearchQuery,
    globalContainerStyle,
    masonryStyleKey,
    themeMode,
    setThemeMode,
    templates,
    selectedTags,
    setSelectedTags,
    selectedLibrary,
    setSelectedLibrary,
    handleAddTemplate,
    TEMPLATE_TAGS
  }) => {
    const [columnCount, setColumnCount] = useState(1);
    const [columnGap, setColumnGap] = useState(20); // Default to gap-5 (20px)
    const fireworkRef = useRef(null);
  
    useEffect(() => {
      const getColumnInfo = () => {
        const width = window.innerWidth;
        if (masonryStyleKey === 'poster') {
          return { count: width >= 1280 ? 3 : (width >= 640 ? 2 : 1), gap: 12 };
        } else if (masonryStyleKey === 'classic' || masonryStyleKey === 'minimal') {
          const count = width >= 1280 ? 4 : (width >= 1024 ? 3 : (width >= 640 ? 2 : 1));
          return { count, gap: 16 };
        } else if (masonryStyleKey === 'compact') {
          const count = width >= 1280 ? 5 : (width >= 1024 ? 4 : (width >= 640 ? 3 : 2));
          return { count, gap: 8 };
        } else if (masonryStyleKey === 'list') {
          return { count: 1, gap: 12 };
        }
        return { count: 1, gap: 12 };
      };
  
      const handleResize = () => {
        const info = getColumnInfo();
        setColumnCount(info.count);
        setColumnGap(info.gap);
      };
  
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [masonryStyleKey]);
  
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (isMobile) {
    // ... 保持移动端逻辑不变
    return (
      <main
        className={`fixed inset-0 z-10 flex flex-col overflow-y-auto pb-32 md:pb-20 ${isDarkMode ? 'dark-gradient-bg' : 'mesh-gradient-bg'}`}
      >
        <div className="flex flex-col w-full min-h-full px-2 py-8 gap-6 pt-safe">
          {/* 1. 顶部 SVG 标题区域 */}
          <div className="w-full flex flex-col items-center px-4 gap-2">
            <h1 className="sr-only">提示词填空器 (Prompt Fill) - 专业的 AI 提示词管理与优化工具</h1>
            <img 
              src={isDarkMode ? "/Title_Dark.svg" : "/Title.svg"} 
              alt="提示词填空器 (Prompt Fill) - 专业的 AI 提示词管理与优化工具" 
              className="w-full max-w-[220px] h-auto"
            />
            <p className={`text-[10px] opacity-70 text-center px-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              专业的 AI 提示词管理与优化工具，让提示词填充更高效
            </p>
          </div>

          {/* 2. 动态文字区 */}
          <div className="w-full scale-90 origin-center">
            <AnimatedSlogan isActive={isSloganActive} language={language} isDarkMode={isDarkMode} />
          </div>

          {/* 3. 图像展示（两列瀑布流） */}
          <section className="columns-2 gap-1 mt-2">
            {filteredTemplates.map(t_item => (
              <article
                key={t_item.id}
                onClick={() => {
                  if (t_item.imageUrl) {
                    setZoomedImage(t_item.imageUrl);
                  } else {
                    setActiveTemplateId(t_item.id);
                    setDiscoveryView(false);
                  }
                }}
                className={`break-inside-avoid mb-1 w-full rounded-lg overflow-hidden shadow-sm border active:scale-[0.98] transition-all ${isDarkMode ? 'bg-[#2A2726] border-white/5' : 'bg-white border-gray-100'}`}
              >
                <div className="relative w-full bg-gray-50/5">
                  {t_item.imageUrl ? (
                    <img 
                      src={t_item.imageUrl} 
                      alt={getLocalized(t_item.name, language)} 
                      className="w-full h-auto block"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] flex items-center justify-center text-gray-300">
                      <ImageIcon size={48} strokeWidth={1} />
                    </div>
                  )}
                  {/* Title Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 pt-6 rounded-b-lg">
                    <h3 className="text-white font-bold text-[10px] truncate">{getLocalized(t_item.name, language)}</h3>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main
      className="flex-1 flex items-stretch gap-4 overflow-hidden"
    >
      {/* Middle Side: Categories Sidebar (Desktop Only) */}
      <TagSidebar
        TEMPLATE_TAGS={TEMPLATE_TAGS}
        selectedTags={selectedTags}
        selectedLibrary={selectedLibrary}
        setSelectedTags={setSelectedTags}
        setSelectedLibrary={setSelectedLibrary}
        isDarkMode={isDarkMode}
        language={language}
      />

      {/* Poster Content Container */}
      <div 
        style={globalContainerStyle}
        className="flex-1 flex flex-col overflow-hidden relative z-10 p-4 md:p-5 lg:pt-12 lg:pb-7 lg:px-7"
      >
          <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-12 overflow-hidden pb-4 lg:pb-8 pt-0 px-2 lg:px-6">
              {/* Left Side: Logo & Slogan */}
              <header className="flex flex-col justify-center items-center lg:items-start lg:w-[280px] xl:w-[320px] flex-shrink-0 px-4 lg:pl-6 lg:pr-2 gap-6">
                  <div className="w-full max-w-[320px] scale-75 sm:scale-85 lg:scale-90 xl:scale-100 origin-center lg:origin-left flex flex-col gap-3">
                      <h1 className="sr-only">提示词填空器 (Prompt Fill) - 专业的 AI 提示词管理与优化工具</h1>
                      <img 
                          src={isDarkMode ? "/Title_Dark.svg" : "/Title.svg"} 
                          alt="提示词填空器 (Prompt Fill) - 专业的 AI 提示词管理与优化工具" 
                          className="w-full h-auto"
                      />
                      <p className={`text-xs lg:text-sm font-medium leading-relaxed opacity-80 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        提示词填空器 (Prompt Fill) 是一款专业的 AI 提示词管理工具，支持模版化、变量填充及一键优化。
                      </p>
                  </div>
                  <div className="w-full scale-90 lg:scale-95 xl:scale-100 origin-center lg:origin-left">
                    <AnimatedSlogan isActive={isSloganActive} language={language} isDarkMode={isDarkMode} />
                  </div>
              </header>

              {/* Right Side: Waterfall Grid */}
              <section 
                  ref={posterScrollRef}
                  className="flex-1 overflow-y-auto overflow-x-visible pr-2 lg:pr-4 scroll-smooth poster-scrollbar will-change-scroll"
                  onMouseEnter={() => setIsPosterAutoScrollPaused(true)}
                  onMouseLeave={() => setIsPosterAutoScrollPaused(false)}
              >
                  <div className="h-full w-full py-4 lg:py-6 px-2 lg:px-4">
                      <div className={`flex w-full ${masonryStyleKey === 'list' ? 'flex-col' : ''}`} style={{ gap: `${columnGap}px` }}>
                          {Array.from({ length: columnCount }).map((_, colIndex) => (
                              <div key={colIndex} className="flex-1 flex flex-col" style={{ gap: `${columnGap}px` }}>
                                  {filteredTemplates
                                      .filter((_, index) => index % columnCount === colIndex)
                                      .map(t_item => (
                                          <article 
                                              key={t_item.id}
                                              onClick={() => {
                                                  if (t_item.imageUrl) {
                                                      setZoomedImage(t_item.imageUrl);
                                                  } else {
                                                      setActiveTemplateId(t_item.id);
                                                      setDiscoveryView(false);
                                                  }
                                              }}
                                              className={`cursor-pointer group transition-shadow duration-300 relative overflow-hidden rounded-xl isolate border-2 hover:shadow-[0_0_15px_rgba(251,146,60,0.35)] will-change-transform ${isDarkMode ? 'border-white/10' : 'border-white'}`}
                                          >
                                              <div className={`relative w-full overflow-hidden rounded-lg ${isDarkMode ? 'bg-[#2A2726]' : 'bg-gray-100'}`} style={{ transform: 'translateZ(0)' }}>
                                                  {t_item.imageUrl ? (
                                                      <img 
                                                          src={t_item.imageUrl} 
                                                          alt={getLocalized(t_item.name, language)} 
                                                          className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                                                          referrerPolicy="no-referrer"
                                                          loading="lazy"
                                                      />
                                                  ) : (
                                                  <div className="w-full aspect-[3/4] bg-gray-100/5 flex items-center justify-center text-gray-300">
                                                      <ImageIcon size={32} />
                                                  </div>
                                              )}
                                              
                                              {/* Hover Overlay: Bottom Glass Mask */}
                                              <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-[opacity,transform] duration-500 ease-out z-20 rounded-b-xl overflow-hidden">
                                                  <div className={`backdrop-blur-md border-t py-4 px-6 shadow-2xl rounded-b-xl ${isDarkMode ? 'bg-black/60 border-white/10' : 'bg-white/40 border-white/40'}`}>
                                                      <h3 className={`font-bold text-base leading-snug text-center ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                                                          {getLocalized(t_item.name, language)}
                                                      </h3>
                                                  </div>
                                              </div>
                                          </div>
                                      </article>
                                  ))}
                              </div>
                          ))}
                      </div>
                  </div>
              </section>
          </div>

          {/* Bottom Bar: Trigger on Left, Author Info on Right */}
          <footer className="mt-auto flex items-center justify-between px-8 py-6 relative z-20">
              {/* New Year Firework Trigger (Desktop/Mobile unified position) */}
              {FEATURE_FLAGS.ENABLE_NEW_YEAR_FIREWORKS ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fireworkRef.current?.start();
                  }}
                  className="transition-all duration-300 transform hover:scale-110 active:scale-95 outline-none"
                  title="新年烟花秀"
                >
                  <img src="/2026.png" alt="2026 烟花秀" className="h-10 md:h-12 w-auto" />
                </button>
              ) : <div />}

              <div className="flex flex-col items-end gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                  <div className={`flex items-center gap-3 text-[11px] font-medium px-4 py-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                      <p>Made by CornerStudio</p>
                      <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
                      <p>公众号：角落工作室</p>
                      <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
                      <p>Wechat: tanshilongmario</p>
                      <a 
                          href="https://github.com/TanShilongMario/PromptFill/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full text-white transition-all duration-300 hover:scale-110 shadow-lg ${isDarkMode ? 'bg-gray-700 hover:bg-orange-500' : 'bg-gray-800 hover:bg-orange-500'}`}
                      >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                      </a>
                  </div>
              </div>
          </footer>
      </div>
      <FireworkEffect 
        ref={fireworkRef} 
        onStart={() => {
          // 播放烟花时自动切换到暗夜模式
          if (setThemeMode) setThemeMode('dark');
        }}
      />
    </main>
  );
});

DiscoveryView.displayName = 'DiscoveryView';
