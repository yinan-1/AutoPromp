import React, { useState, useEffect } from 'react';
import { 
  ImageIcon, ArrowUpRight, LayoutGrid, RotateCcw, 
  Globe, Settings, ArrowUpDown 
} from 'lucide-react';
import { getLocalized } from '../utils/helpers';

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
  isSortMenuOpen,
  setIsSortMenuOpen,
  sortOrder,
  setSortOrder,
  setRandomSeed
}) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (isMobile) {
    return (
      <div 
        className="fixed inset-0 z-10 flex flex-col overflow-y-auto pb-32 md:pb-20 mesh-gradient-bg"
      >
        <div className="flex flex-col w-full min-h-full px-5 py-8 gap-6">
          {/* 1. 顶部 SVG 标题区域 */}
          <div className="w-full flex justify-center px-4">
            <img 
              src="/Title.svg" 
              alt="Prompt Fill Logo" 
              className="w-full max-w-[280px] h-auto"
            />
          </div>

          {/* 2. 动态文字区 */}
          <div className="w-full">
            <AnimatedSlogan isActive={isSloganActive} language={language} />
          </div>

          {/* 3. 功能按钮区域 */}
          <div className="flex items-center justify-center gap-4 py-2">
            <button 
              onClick={() => setIsSortMenuOpen(!isSortMenuOpen)} 
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:bg-orange-50 transition-all">
                <ArrowUpDown size={20} className="text-gray-600 group-hover:text-orange-600" />
              </div>
              <span className="text-[10px] font-bold text-gray-500">{t('sort')}</span>
              
              {isSortMenuOpen && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 py-2 min-w-[140px] z-[110] animate-in slide-in-from-top-2 duration-200">
                  {[
                    { value: 'newest', label: t('sort_newest') },
                    { value: 'oldest', label: t('sort_oldest') },
                    { value: 'a-z', label: t('sort_az') },
                    { value: 'z-a', label: t('sort_za') },
                    { value: 'random', label: t('sort_random') }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSortOrder(option.value);
                        if (option.value === 'random') setRandomSeed(Date.now());
                        setIsSortMenuOpen(false);
                      }}
                      className={`w-full text-center px-4 py-2.5 text-xs hover:bg-orange-50 transition-colors ${sortOrder === option.value ? 'text-orange-600 font-bold' : 'text-gray-700'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </button>

            <button 
              onClick={() => setLanguage(language === 'cn' ? 'en' : 'cn')}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:bg-orange-50 transition-all">
                <Globe size={20} className="text-gray-600 group-hover:text-orange-600" />
              </div>
              <span className="text-[10px] font-bold text-gray-500">{t('language_name')}</span>
            </button>

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:bg-orange-50 transition-all">
                <Settings size={20} className="text-gray-600 group-hover:text-orange-600" />
              </div>
              <span className="text-[10px] font-bold text-gray-500">{t('settings')}</span>
            </button>

            <button 
              onClick={handleRefreshSystemData}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:bg-orange-50 transition-all">
                <RotateCcw size={20} className="text-gray-600 group-hover:text-orange-600" />
              </div>
              <span className="text-[10px] font-bold text-gray-500">{t('sync')}</span>
            </button>
          </div>

          {/* 4. 图像展示（单列） */}
          <div className="flex flex-col gap-6 mt-2">
            {filteredTemplates.map(t_item => (
              <div 
                key={t_item.id}
                onClick={() => {
                  setZoomedImage(t_item.imageUrl);
                }}
                className="w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 active:scale-[0.98] transition-all"
              >
                <div className="relative w-full bg-gray-50">
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
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 pt-10">
                    <h3 className="text-white font-bold text-lg">{getLocalized(t_item.name, language)}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden mesh-gradient-bg"
    >
      {/* Poster Content Container */}
      <div 
        className="flex flex-col w-full h-full bg-white/20 border-2 border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden relative z-10 p-4 md:p-6 lg:p-9 rounded-[2rem]"
      >
          <div className="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-20 overflow-hidden py-6 lg:py-10 px-4 lg:px-8">
              {/* Left Side: Logo & Slogan */}
              <div className="flex flex-col justify-center items-center lg:items-start lg:w-[380px] xl:w-[460px] flex-shrink-0 px-4 lg:pl-8 lg:pr-6 gap-8">
                  <div className="w-full max-w-[400px] scale-75 sm:scale-90 lg:scale-100 origin-center lg:origin-left">
                      <img 
                          src="/Title.svg" 
                          alt="Prompt Fill Logo" 
                          className="w-full h-auto"
                      />
                  </div>
                  <AnimatedSlogan isActive={isSloganActive} language={language} />
              </div>

              {/* Right Side: Waterfall Grid */}
              <div 
                  ref={posterScrollRef}
                  className="flex-1 overflow-y-auto overflow-x-visible pr-4 lg:pr-8 scroll-smooth poster-scrollbar will-change-scroll"
                  onMouseEnter={() => setIsPosterAutoScrollPaused(true)}
                  onMouseLeave={() => setIsPosterAutoScrollPaused(false)}
              >
                  <div className="h-full w-full py-8 lg:py-12 px-6 lg:px-12">
                      <div className={currentMasonryStyle.container}>
                          {filteredTemplates.map(t_item => (
                                  <div 
                                      key={t_item.id}
                                      onClick={() => {
                                          setZoomedImage(t_item.imageUrl);
                                      }}
                                      className="break-inside-avoid cursor-pointer group mb-5 transition-shadow duration-300 relative overflow-hidden rounded-2xl isolate border-2 border-white hover:shadow-[0_0_25px_rgba(251,146,60,0.6)] will-change-transform"
                                  >
                                      <div className="relative w-full overflow-hidden rounded-xl bg-gray-100">
                                          {t_item.imageUrl ? (
                                              <img 
                                                  src={t_item.imageUrl} 
                                                  alt={getLocalized(t_item.name, language)} 
                                                  className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                                                  referrerPolicy="no-referrer"
                                                  loading="lazy"
                                              />
                                          ) : (
                                          <div className="w-full aspect-[3/4] bg-gray-100 flex items-center justify-center text-gray-300">
                                              <ImageIcon size={32} />
                                          </div>
                                      )}
                                      
                                      {/* Hover Overlay: Bottom Glass Mask */}
                                      <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-[opacity,transform] duration-500 ease-out z-20">
                                          <div className="backdrop-blur-md bg-white/40 border-t border-white/40 py-4 px-6 shadow-2xl">
                                              <p className="font-bold text-base leading-snug text-center text-gray-800">
                                                  {getLocalized(t_item.name, language)}
                                              </p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>

          {/* Bottom Bar: Tools & Author Info */}
          <div className="mt-auto flex items-center justify-between px-8 py-6 relative z-20">
              {/* Left: Tools */}
              <div className="flex items-center gap-3 p-2">
                  {/* Discovery View Toggle (Back to Editor) */}
                  <button 
                      onClick={() => setDiscoveryView(false)} 
                      className="p-2.5 rounded-xl transition-all text-gray-500 hover:text-orange-600 hover:bg-white/50 shadow-sm" 
                      title="返回编辑器"
                  >
                      <LayoutGrid size={20} />
                  </button>

                  <div className="w-px h-6 bg-white/30" />

                  {/* Sort Menu Button */}
                  <div className="relative">
                      <button 
                          onClick={() => setIsSortMenuOpen(!isSortMenuOpen)} 
                          className="p-2.5 rounded-xl transition-all text-gray-500 hover:text-orange-600 hover:bg-white/50 shadow-sm" 
                          title={t('sort')}
                      >
                          <ArrowUpDown size={20} />
                      </button>
                      {isSortMenuOpen && (
                          <div className="absolute bottom-full mb-3 left-0 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 py-2 min-w-[160px] z-[100] animate-in slide-in-from-bottom-2 duration-200">
                              {[
                                  { value: 'newest', label: t('sort_newest') },
                                  { value: 'oldest', label: t('sort_oldest') },
                                  { value: 'a-z', label: t('sort_az') },
                                  { value: 'z-a', label: t('sort_za') },
                                  { value: 'random', label: t('sort_random') }
                              ].map(option => (
                                  <button
                                      key={option.value}
                                      onClick={() => {
                                          setSortOrder(option.value);
                                          if (option.value === 'random') setRandomSeed(Date.now());
                                          setIsSortMenuOpen(false);
                                      }}
                                      className={`w-full text-left px-5 py-2.5 text-sm hover:bg-orange-50 transition-colors ${sortOrder === option.value ? 'text-orange-600 font-semibold' : 'text-gray-700'}`}
                                  >
                                      {option.label}
                                  </button>
                              ))}
                          </div>
                      )}
                  </div>

                  <button 
                      onClick={() => setLanguage(language === 'cn' ? 'en' : 'cn')} 
                      className="p-2.5 rounded-xl transition-all text-gray-500 hover:text-orange-600 hover:bg-white/50 shadow-sm flex items-center gap-1.5"
                      title={t('language')}
                  >
                      <Globe size={20} />
                      <span className="text-xs font-bold">{t('language_name')}</span>
                  </button>

                  <button 
                      onClick={() => setIsSettingsOpen(true)} 
                      className="p-2.5 rounded-xl transition-all text-gray-500 hover:text-orange-600 hover:bg-white/50 shadow-sm" 
                      title={t('settings')}
                  >
                      <Settings size={20} />
                  </button>

                  <button 
                      onClick={handleRefreshSystemData} 
                      className="p-2.5 rounded-xl transition-all text-gray-500 hover:text-orange-600 hover:bg-white/50 shadow-sm" 
                      title={t('refresh_desc')}
                  >
                      <RotateCcw size={20} />
                  </button>
              </div>

              {/* Right: Author Info */}
              <div className="flex flex-col items-end gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-3 text-[11px] font-medium text-gray-700 px-4 py-2">
                      <p>Made by CornerStudio</p>
                      <div className="w-1 h-1 rounded-full bg-gray-400" />
                      <p>Tangm Data</p>
                      <div className="w-1 h-1 rounded-full bg-gray-400" />
                      <p>Wechat: DecoryDu</p>
                      <a 
                          href="https://github.com/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-white hover:bg-orange-500 transition-all duration-300 hover:scale-110 shadow-lg"
                      >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                      </a>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
});

DiscoveryView.displayName = 'DiscoveryView';
