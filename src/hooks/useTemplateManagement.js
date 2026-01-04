import { useCallback } from 'react';
import { TRANSLATIONS } from '../constants/translations';

/**
 * 模板管理 Hook
 * 封装模板的增删改查操作
 *
 * @param {Object} templates - 当前模板列表
 * @param {Function} setTemplates - 设置模板列表的函数
 * @param {string} activeTemplateId - 当前激活的模板ID
 * @param {Object} activeTemplate - 当前激活的模板对象
 * @param {Function} setActiveTemplateId - 设置激活模板ID的函数
 * @param {Function} setIsEditing - 设置编辑状态的函数
 * @param {Function} setEditingTemplateNameId - 设置编辑中模板名称ID的函数
 * @param {Function} setTempTemplateName - 设置临时模板名称的函数
 * @param {Function} setTempTemplateAuthor - 设置临时模板作者的函数
 * @param {string} language - 当前语言
 * @param {boolean} isMobileDevice - 是否为移动设备
 * @param {Function} setMobileTab - 设置移动端Tab的函数
 * @param {Array} INITIAL_TEMPLATES_CONFIG - 初始模板配置
 * @param {Function} t - 翻译函数
 */
export const useTemplateManagement = (
  templates,
  setTemplates,
  activeTemplateId,
  activeTemplate,
  setActiveTemplateId,
  setIsEditing,
  setEditingTemplateNameId,
  setTempTemplateName,
  setTempTemplateAuthor,
  language,
  isMobileDevice,
  setMobileTab,
  INITIAL_TEMPLATES_CONFIG,
  t
) => {
  // 添加新模板
  const handleAddTemplate = useCallback(() => {
    const newId = `tpl_${Date.now()}`;
    const newName = t('new_template_name');
    const newAuthor = "PromptFill User";
    const newTemplate = {
      id: newId,
      name: newName,
      author: newAuthor,
      content: t('new_template_content'),
      selections: {},
      tags: []
    };
    setTemplates(prev => [...prev, newTemplate]);
    setActiveTemplateId(newId);
    setIsEditing(true);

    // 初始化标题和作者编辑状态
    setEditingTemplateNameId(newId);
    setTempTemplateName(newName);
    setTempTemplateAuthor(newAuthor);

    // 在移动端自动切换到编辑Tab
    if (isMobileDevice) {
      setMobileTab('editor');
    }
  }, [setTemplates, setActiveTemplateId, setIsEditing, setEditingTemplateNameId, setTempTemplateName, setTempTemplateAuthor, isMobileDevice, setMobileTab, t]);

  // 复制模板
  const handleDuplicateTemplate = useCallback((t_item, e) => {
    e.stopPropagation();
    const newId = `tpl_${Date.now()}`;

    const duplicateName = (name) => {
      if (typeof name === 'string') return `${name}${t('copy_suffix')}`;
      const newName = { ...name };
      Object.keys(newName).forEach(lang => {
        const suffix = TRANSLATIONS[lang]?.copy_suffix || ' (Copy)';
        newName[lang] = `${newName[lang]}${suffix}`;
      });
      return newName;
    };

    const isSystemTemplate = INITIAL_TEMPLATES_CONFIG.some(cfg => cfg.id === t_item.id);
    const newTemplate = {
      ...t_item,
      id: newId,
      name: duplicateName(t_item.name),
      author: isSystemTemplate ? "PromptFill User" : (t_item.author || "PromptFill User"),
      selections: { ...t_item.selections }
    };
    setTemplates(prev => [...prev, newTemplate]);
    setActiveTemplateId(newId);
    // 在移动端自动切换到编辑Tab
    if (isMobileDevice) {
      setMobileTab('editor');
    }
  }, [INITIAL_TEMPLATES_CONFIG, setTemplates, setActiveTemplateId, isMobileDevice, setMobileTab, t]);

  // 删除模板
  const handleDeleteTemplate = useCallback((id, e) => {
    e.stopPropagation();
    if (templates.length <= 1) {
      alert(t('alert_keep_one'));
      return;
    }
    if (window.confirm(t('confirm_delete_template'))) {
      const newTemplates = templates.filter(t => t.id !== id);
      setTemplates(newTemplates);
      if (activeTemplateId === id) {
        setActiveTemplateId(newTemplates[0].id);
      }
    }
  }, [templates, activeTemplateId, setTemplates, setActiveTemplateId, t]);

  // 重置模板
  const handleResetTemplate = useCallback((id, e) => {
    e.stopPropagation();
    if (!window.confirm(t('confirm_reset_template'))) return;

    const original = INITIAL_TEMPLATES_CONFIG.find(t => t.id === id);
    if (!original) return;

    setTemplates(prev => prev.map(t =>
      t.id === id ? JSON.parse(JSON.stringify(original)) : t
    ));
  }, [INITIAL_TEMPLATES_CONFIG, setTemplates, t]);

  // 开始重命名模板
  const startRenamingTemplate = useCallback((t_item, e) => {
    if (e) e.stopPropagation();
    setIsEditing(true);
    setEditingTemplateNameId(t_item.id);
    setTempTemplateName(typeof t_item.name === 'string' ? t_item.name : t_item.name[language]);
    setTempTemplateAuthor(t_item.author || "");
  }, [setIsEditing, setEditingTemplateNameId, setTempTemplateName, setTempTemplateAuthor, language]);

  // 开始编辑
  const handleStartEditing = useCallback(() => {
    setIsEditing(true);
    if (activeTemplate) {
      startRenamingTemplate(activeTemplate);
    }
  }, [setIsEditing, activeTemplate, startRenamingTemplate]);

  // 停止编辑
  const handleStopEditing = useCallback(() => {
    setIsEditing(false);
    setEditingTemplateNameId(null);
  }, [setIsEditing, setEditingTemplateNameId]);

  // 保存模板名称
  const saveTemplateName = useCallback((editingTemplateNameId, tempTemplateName, tempTemplateAuthor) => {
    if (editingTemplateNameId && tempTemplateName && tempTemplateName.trim()) {
      setTemplates(prev => prev.map(t_item => {
        if (t_item.id === editingTemplateNameId) {
          const newName = typeof t_item.name === 'object'
            ? { ...t_item.name, [language]: tempTemplateName }
            : tempTemplateName;
          return { ...t_item, name: newName, author: tempTemplateAuthor };
        }
        return t_item;
      }));
      setEditingTemplateNameId(null);
    }
  }, [language, setTemplates, setEditingTemplateNameId]);

  return {
    handleAddTemplate,
    handleDuplicateTemplate,
    handleDeleteTemplate,
    handleResetTemplate,
    startRenamingTemplate,
    handleStartEditing,
    handleStopEditing,
    saveTemplateName
  };
};
