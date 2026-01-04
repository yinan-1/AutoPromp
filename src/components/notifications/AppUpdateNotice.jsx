import React from 'react';
import { Sparkles, X } from 'lucide-react';

/**
 * 应用更新提示弹窗
 * 当应用版本或数据版本有更新时显示
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - 是否显示弹窗
 * @param {string} props.noticeType - 更新类型: 'app' | 'data'
 * @param {Function} props.onRefresh - 刷新页面的回调
 * @param {Function} props.onClose - 关闭弹窗的回调
 * @param {Function} props.t - 翻译函数
 */
const AppUpdateNotice = ({ isOpen, noticeType, onRefresh, onClose, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-[150]">
      <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-md ml-auto border border-blue-400">
        <div className="p-2 bg-white/20 rounded-xl">
          <Sparkles size={24} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium leading-snug">
            {noticeType === 'app' ? t('app_update_available_msg') : t('data_update_available_msg')}
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-white text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-black/10 whitespace-nowrap"
        >
          {t('refresh_now')}
        </button>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default AppUpdateNotice;
