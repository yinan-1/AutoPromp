import React from 'react';
import { X, Download, ImageIcon } from 'lucide-react';
import { WaypointsIcon } from '../icons/WaypointsIcon';
import { PremiumButton } from '../PremiumButton';
import { getLocalized } from '../../utils/helpers';

/**
 * 分享模版导入弹窗组件
 * 显示从分享链接/口令导入的模版预览，并确认是否导入
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - 是否打开弹窗
 * @param {Object} props.templateData - 模版数据
 * @param {Function} props.onClose - 关闭弹窗的回调
 * @param {Function} props.onImport - 确认导入的回调
 * @param {Function} props.t - 翻译函数
 * @param {Object} props.TAG_STYLES - 标签样式
 * @param {Function} props.displayTag - 显示标签的函数
 * @param {boolean} props.isDarkMode - 是否暗色模式
 * @param {string} props.language - 当前语言
 */
const ShareImportModal = ({ isOpen, templateData, onClose, onImport, t, TAG_STYLES, displayTag, isDarkMode, language }) => {
  if (!isOpen || !templateData) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border animate-scale-up ${isDarkMode ? 'bg-[#242120] border-white/5 shadow-black/50' : 'bg-white border-gray-100'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
          <h3 className={`text-xl font-black flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <div className="p-2 bg-orange-500 rounded-xl text-white">
              <WaypointsIcon size={20} />
            </div>
            {t('import_shared_template')}
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-white/10 text-gray-500' : 'hover:bg-gray-200 text-gray-500'}`}
          >
            <X size={20}/>
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-start gap-6">
            <div className={`w-24 h-24 shrink-0 rounded-3xl overflow-hidden shadow-lg border-4 ${isDarkMode ? 'border-white/10' : 'border-white'}`}>
              {templateData.imageUrl ? (
                <img src={templateData.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                  <ImageIcon size={32} className="text-gray-400" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className={`text-2xl font-black tracking-tight truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {getLocalized(templateData.name, language)}
              </h4>
              <p className="text-sm font-bold text-orange-500 uppercase tracking-widest mt-1">
                {templateData.author ? `${t('shared_by')} ${templateData.author}` : t('official')}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {templateData.tags?.map(tag => (
                  <span key={tag} className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${TAG_STYLES[tag] || TAG_STYLES["default"]}`}>
                    {displayTag(tag)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border text-sm leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar transition-all ${isDarkMode ? 'bg-black/40 border-white/5 text-gray-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]' : 'bg-gray-100/50 border-gray-200 text-gray-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]'}`}>
            <div className="whitespace-pre-wrap font-mono">
              {getLocalized(templateData.content, language)}
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <PremiumButton
              onClick={onClose}
              isDarkMode={isDarkMode}
              className="flex-1 size-lg"
              icon={X}
            >
              {t('cancel')}
            </PremiumButton>
            <PremiumButton
              onClick={onImport}
              active={true}
              isDarkMode={isDarkMode}
              className="flex-1 size-lg"
              icon={Download}
            >
              {t('import_now')}
            </PremiumButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareImportModal;
