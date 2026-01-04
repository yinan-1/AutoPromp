import React from 'react';
import { X } from 'lucide-react';
import { PremiumButton } from '../PremiumButton';
import { CopyIcon, Share2 } from 'lucide-react';

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
 */
const ShareOptionsModal = ({ isOpen, onClose, onCopyLink, onCopyToken, isGenerating, isDarkMode, language }) => {
  if (!isOpen) return null;

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
          <p className={`text-xs font-bold mb-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {language === 'cn' ? '选择您喜欢的分享方式' : 'Choose your preferred sharing method'}
          </p>

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
                  {isGenerating ? (language === 'cn' ? '正在生成...' : 'Generating...') : (language === 'cn' ? '链接分享' : 'Share via Link')}
                </span>
                <span className={`text-[10px] font-bold opacity-50`}>
                  {language === 'cn' ? '复制完整 URL 链接' : 'Copy the full URL link'}
                </span>
              </div>
            </PremiumButton>

            <PremiumButton
              onClick={onCopyToken}
              disabled={isGenerating}
              isDarkMode={isDarkMode}
              className="w-full size-lg"
              icon={Share2}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareOptionsModal;
