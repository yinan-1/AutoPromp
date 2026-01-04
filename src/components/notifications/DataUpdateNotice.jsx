import React from 'react';
import { RefreshCw } from 'lucide-react';

/**
 * 数据更新提示弹窗
 * 当系统模板或词库有更新时显示
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - 是否显示弹窗
 * @param {Function} props.onLater - 稍后更新的回调
 * @param {Function} props.onUpdate - 立即更新的回调
 * @param {Function} props.t - 翻译函数
 */
const DataUpdateNotice = ({ isOpen, onLater, onUpdate, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transition-all">
        <div className="flex items-center gap-3 mb-4 text-orange-600">
          <div className="p-2 bg-orange-100 rounded-lg">
            <RefreshCw size={24} />
          </div>
          <h3 className="text-xl font-bold">{t('update_available_title')}</h3>
        </div>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {t('update_available_msg')}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onLater}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            {t('later')}
          </button>
          <button
            onClick={onUpdate}
            className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 font-bold"
          >
            {t('update_now')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataUpdateNotice;
