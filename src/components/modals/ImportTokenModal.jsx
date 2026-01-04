import React from 'react';
import { X, Download } from 'lucide-react';
import { PremiumButton } from '../PremiumButton';

/**
 * 导入模版弹窗组件
 * 支持通过分享口令或链接导入模版
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - 是否打开弹窗
 * @param {Function} props.onClose - 关闭弹窗的回调
 * @param {string} props.tokenValue - 输入的口令值
 * @param {Function} props.onTokenChange - 口令值变化的回调
 * @param {Function} props.onConfirm - 确认导入的回调
 * @param {boolean} props.isDarkMode - 是否暗色模式
 * @param {string} props.language - 当前语言
 * @param {string} props.confirmText - 确认按钮文字
 */
const ImportTokenModal = ({ isOpen, onClose, tokenValue, onTokenChange, onConfirm, isDarkMode, language, confirmText }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden border animate-scale-up ${isDarkMode ? 'bg-[#242120] border-white/5' : 'bg-white border-gray-100'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 relative">
          <button
            onClick={handleClose}
            className={`absolute top-6 right-6 p-2 rounded-full transition-all ${isDarkMode ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            <X size={20} />
          </button>
          <h3 className={`text-xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {language === 'cn' ? '导入模版' : 'Import Template'}
          </h3>
          <p className={`text-xs font-bold mb-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {language === 'cn' ? '请输入分享口令或链接' : 'Please enter share token or link'}
          </p>

          <div className="space-y-4">
            <div className={`relative group ${isDarkMode ? 'dark' : 'light'}`}>
              <input
                autoFocus
                type="text"
                value={tokenValue}
                onChange={(e) => onTokenChange(e.target.value)}
                placeholder={language === 'cn' ? '粘贴口令或链接...' : 'Paste token or link...'}
                className={`w-full px-5 py-4 text-sm font-semibold rounded-2xl transition-all duration-300 border-2 outline-none ${
                  isDarkMode
                    ? 'bg-black/20 border-white/10 text-white focus:border-orange-500/50'
                    : 'bg-gray-50 border-gray-100 text-gray-800 focus:border-orange-500/30'
                }`}
                onKeyDown={handleKeyDown}
              />
            </div>

            <PremiumButton
              onClick={handleConfirm}
              active={true}
              isDarkMode={isDarkMode}
              className="w-full size-lg"
              icon={Download}
            >
              {confirmText}
            </PremiumButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportTokenModal;
