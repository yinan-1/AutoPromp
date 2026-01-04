import { useState, useCallback, useRef } from 'react';

/**
 * 编辑器历史记录 Hook
 * 提供撤销/重做功能
 *
 * @param {string} activeTemplateId - 当前激活的模版 ID
 * @param {Object} activeTemplate - 当前激活的模版对象
 * @param {Function} setTemplates - 更新模版的函数
 * @returns {Object} 历史记录相关的状态和函数
 */
export const useEditorHistory = (activeTemplateId, activeTemplate, setTemplates) => {
  const [historyPast, setHistoryPast] = useState([]);
  const [historyFuture, setHistoryFuture] = useState([]);
  const historyLastSaveTime = useRef(0);

  /**
   * 更新模版内容，并自动记录历史
   * @param {*} newContent - 新的模版内容
   * @param {boolean} forceSaveHistory - 是否强制保存历史记录
   */
  const updateActiveTemplateContent = useCallback((newContent, forceSaveHistory = false) => {
    // History Management
    const now = Date.now();
    const shouldSave = forceSaveHistory || (now - historyLastSaveTime.current > 1000);

    if (shouldSave) {
      setHistoryPast(prev => [...prev, activeTemplate.content]);
      setHistoryFuture([]); // Clear redo stack on new change
      historyLastSaveTime.current = now;
    }

    setTemplates(prev => prev.map(t =>
      t.id === activeTemplateId ? { ...t, content: newContent } : t
    ));
  }, [activeTemplate.content, activeTemplateId, setTemplates]);

  /**
   * 撤销操作
   */
  const handleUndo = useCallback(() => {
    if (historyPast.length === 0) return;

    const previous = historyPast[historyPast.length - 1];
    const newPast = historyPast.slice(0, -1);

    setHistoryFuture(prev => [activeTemplate.content, ...prev]);
    setHistoryPast(newPast);

    // Direct update without saving history again
    setTemplates(prev => prev.map(t =>
      t.id === activeTemplateId ? { ...t, content: previous } : t
    ));
  }, [activeTemplate.content, activeTemplateId, historyPast, setTemplates]);

  /**
   * 重做操作
   */
  const handleRedo = useCallback(() => {
    if (historyFuture.length === 0) return;

    const next = historyFuture[0];
    const newFuture = historyFuture.slice(1);

    setHistoryPast(prev => [...prev, activeTemplate.content]);
    setHistoryFuture(newFuture);

    // Direct update without saving history again
    setTemplates(prev => prev.map(t =>
      t.id === activeTemplateId ? { ...t, content: next } : t
    ));
  }, [activeTemplate.content, activeTemplateId, historyFuture, setTemplates]);

  /**
   * 重置历史记录（当切换模版时调用）
   */
  const resetHistory = useCallback(() => {
    setHistoryPast([]);
    setHistoryFuture([]);
    historyLastSaveTime.current = 0;
  }, []);

  return {
    historyPast,
    historyFuture,
    updateActiveTemplateContent,
    handleUndo,
    handleRedo,
    resetHistory,
    canUndo: historyPast.length > 0,
    canRedo: historyFuture.length > 0,
  };
};
