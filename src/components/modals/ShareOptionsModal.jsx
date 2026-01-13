import React from 'react';
import { X } from 'lucide-react';
import { PremiumButton } from '../PremiumButton';
import { CopyIcon } from 'lucide-react';
import { WaypointsIcon } from '../icons/WaypointsIcon';

/**
 * 分享选项弹窗组件
 * 提供链接分享和口令分享两种方式
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - 是否打开弹窗
 * @param {Function} props.onClose - 关闭弹窗的回调
 * @param {Function} props.onCopyLink - 复制链接的回调
 * @param {Function} props.onCopyToken - 复制口令的回调
 * @param {boolean} props.isGenerating - 是否正在生成短码
 * @param {boolean} props.isDarkMode - 是否暗色模式
 * @param {string} props.language - 当前语言
 * @param {string} props.shareCode - 分享码
 */
const ShareOptionsModal = ({ isOpen, onClose, onCopyLink, onCopyToken, shareUrl, shareCode, isGenerating, isPrefetching, isDarkMode, language }) => {
  if (!isOpen) return null;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden border animate-scale-up ${isDarkMode ? 'bg-[#242120] border-white/5' : 'bg-white border-gray-100'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 relative">
          <button
            onClick={onClose}
            className={`absolute top-6 right-6 p-2 rounded-full transition-all ${isDarkMode ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            <X size={20} />
          </button>
          <h3 className={`text-xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {language === 'cn' ? '分享模版' : 'Share Template'}
          </h3>
          <p className={`text-xs font-bold mb-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {language === 'cn' ? '选择您喜欢的分享方式' : 'Choose your preferred sharing method'}
          </p>

          {/* 分享码展示区域 */}
          {(shareCode || isPrefetching) && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="relative h-14 w-full flex items-center justify-center overflow-hidden">
                {isPrefetching ? (
                  <div className="flex gap-1.5 items-center">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-500/40 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                ) : (
                  <span className="text-3xl font-black tracking-[0.2em] select-all bg-clip-text text-transparent bg-gradient-to-br from-orange-400 to-orange-600 drop-shadow-sm">
                    {shareCode}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <PremiumButton
              onClick={onCopyLink}
              disabled={isGenerating}
              isDarkMode={isDarkMode}
              className="w-full size-lg"
              icon={CopyIcon}
              justify="start"
            >
              <div className="flex flex-col items-start ml-2 text-left">
                <span className="text-sm font-black">
                  {isGenerating ? (language === 'cn' ? '正在复制...' : 'Copying...') : (language === 'cn' ? '链接分享' : 'Share via Link')}
                </span>
                <span className={`text-[10px] font-bold opacity-50`}>
                  {language === 'cn' ? '复制完整 URL 链接' : 'Copy the full URL link'}
                </span>
              </div>
            </PremiumButton>

            {/* 暂时注释口令分享按钮
            <PremiumButton
              onClick={onCopyToken}
              disabled={isGenerating}
              isDarkMode={isDarkMode}
              className="w-full size-lg"
              icon={WaypointsIcon}
              justify="start"
            >
              <div className="flex flex-col items-start ml-2 text-left">
                <span className="text-sm font-black">
                  {isGenerating ? (language === 'cn' ? '正在生成...' : 'Generating...') : (language === 'cn' ? '口令分享 (推荐)' : 'Share via Token')}
                </span>
                <span className={`text-[10px] font-bold opacity-70`}>
                  {language === 'cn' ? '适合微信分享，不易被拦截' : 'Best for WeChat, anti-blocking'}
                </span>
              </div>
            </PremiumButton>
            */}

            {/* 新增：手动复制区域 */}
            {(shareUrl || isPrefetching) && (
              <div className="mt-8">
                <p className={`text-[10px] font-black mb-3 uppercase tracking-widest ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  {language === 'cn' 
                    ? `无法自动复制？请手动${isMobile ? '长按' : ''}复制链接：` 
                    : `CAN'T AUTO-COPY? PLEASE ${isMobile ? 'LONG-PRESS' : ''} TO COPY:`}
                </p>
                <div className={`premium-search-container group ${isDarkMode ? 'dark' : 'light'} !rounded-2xl`}>
                    <div className={`
                      text-xs font-mono break-all p-4 select-all max-h-[80px] overflow-y-auto scrollbar-hide
                      ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                    `}>
                      {isPrefetching ? (
                        <span className="opacity-40 italic font-bold tracking-tight">
                          {language === 'cn' ? '短链接生成中...' : 'Generating short link...'}
                        </span>
                      ) : (
                        shareUrl
                      )}
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareOptionsModal;
