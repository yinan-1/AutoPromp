import { useState, useCallback, useRef } from 'react';

/**
 * 变量名解析工具函数
 * 从变量名中提取 baseKey 和 groupId
 * 例如: "fruit_1" -> { baseKey: "fruit", groupId: "1" }
 *       "fruit" -> { baseKey: "fruit", groupId: null }
 *
 * @param {string} varName - 变量名
 * @returns {Object} { baseKey, groupId }
 */
export const parseVariableName = (varName) => {
  const match = varName.match(/^(.+?)(?:_(\d+))?$/);
  if (match) {
    return {
      baseKey: match[1],
      groupId: match[2] || null
    };
  }
  return { baseKey: varName, groupId: null };
};

/**
 * 联动组管理 Hook
 * 提供变量联动组的功能，支持相同 baseKey 和 groupId 的变量同步更新
 *
 * @param {string} activeTemplateId - 当前激活的模版 ID
 * @param {Array} templates - 所有模版
 * @param {Function} setTemplates - 更新模版的函数
 * @param {Object} banks - 词库对象
 * @param {Function} handleAddOption - 添加选项的函数
 * @returns {Object} 联动组相关的函数和状态
 */
export const useLinkageGroups = (
  activeTemplateId,
  templates,
  setTemplates,
  banks,
  handleAddOption
) => {
  // 光标在变量内的状态
  const [cursorInVariable, setCursorInVariable] = useState(false);
  const [currentVariableName, setCurrentVariableName] = useState(null);
  const [currentGroupId, setCurrentGroupId] = useState(null);

  /**
   * 查找模板中所有需要联动的变量
   * 规则：相同 baseKey 且相同 groupId 的变量联动
   *
   * @param {Object} template - 模版对象
   * @param {string} baseKey - 变量的基础键名
   * @param {string|null} groupId - 组 ID
   * @returns {Array} 联动变量的 uniqueKey 数组
   */
  const findLinkedVariables = useCallback((template, baseKey, groupId) => {
    if (!groupId) return []; // 没有 groupId 的变量不联动

    const linkedKeys = [];
    const content = typeof template.content === 'object'
      ? Object.values(template.content).join('\n')
      : template.content || '';

    // 找到所有 {{baseKey_groupId}} 格式的变量
    const allMatches = content.matchAll(/\{\{([^}]+)\}\}/g);
    const counters = {};

    for (const match of allMatches) {
      const fullKey = match[1].trim();
      const parsed = parseVariableName(fullKey);

      // 匹配相同 baseKey 且相同 groupId 的变量
      if (parsed.baseKey === baseKey && parsed.groupId === groupId) {
        const idx = counters[fullKey] || 0;
        counters[fullKey] = idx + 1;
        linkedKeys.push(`${fullKey}-${idx}`);
      }
    }

    return linkedKeys;
  }, []);

  /**
   * 更新模版的选择值，并同步更新所有联动的变量
   *
   * @param {string} uniqueKey - 变量的唯一键
   * @param {*} value - 要设置的值
   * @param {Array} linkedKeys - 需要联动的变量键数组
   */
  const updateActiveTemplateSelection = useCallback((uniqueKey, value, linkedKeys = []) => {
    setTemplates(prev => prev.map(t => {
      if (t.id === activeTemplateId) {
        const newSelections = { ...t.selections, [uniqueKey]: value };

        // 同步更新所有联动的变量
        linkedKeys.forEach(linkedKey => {
          if (linkedKey !== uniqueKey) {
            newSelections[linkedKey] = value;
          }
        });

        return {
          ...t,
          selections: newSelections
        };
      }
      return t;
    }));
  }, [activeTemplateId, setTemplates]);

  /**
   * 处理变量选择
   * 自动处理联动组的同步更新
   *
   * @param {string} key - 变量键名
   * @param {number} index - 变量索引
   * @param {*} value - 选中的值
   * @param {Function} setActivePopover - 关闭弹出层的函数
   */
  const handleSelect = useCallback((key, index, value, setActivePopover) => {
    const uniqueKey = `${key}-${index}`;

    // 解析变量名，检查是否有联动组
    const parsed = parseVariableName(key);

    // 如果有关联组，找到所有需要联动的变量
    let linkedKeys = [];
    if (parsed.groupId) {
      const activeTemplate = templates.find(t => t.id === activeTemplateId);
      if (activeTemplate) {
        linkedKeys = findLinkedVariables(activeTemplate, parsed.baseKey, parsed.groupId);
      }
    }

    updateActiveTemplateSelection(uniqueKey, value, linkedKeys);
    if (setActivePopover) {
      setActivePopover(null);
    }
  }, [parseVariableName, findLinkedVariables, updateActiveTemplateSelection, templates, activeTemplateId]);

  /**
   * 添加自定义选项并选中
   * 同时会添加到词库中（如果不存在）
   *
   * @param {string} key - 变量键名
   * @param {number} index - 变量索引
   * @param {string} newValue - 新选项的值
   * @param {Function} setActivePopover - 关闭弹出层的函数
   */
  const handleAddCustomAndSelect = useCallback((key, index, newValue, setActivePopover) => {
    if (!newValue || !newValue.trim()) return;

    // 解析变量名，获取 baseKey（词库的 key）
    const parsed = parseVariableName(key);
    const baseKey = parsed.baseKey;

    // 1. Add to bank if not exists (使用 baseKey)
    if (banks[baseKey] && !banks[baseKey].options.includes(newValue)) {
      handleAddOption(baseKey, newValue);
    }

    // 2. Select it (使用完整的 key，可能包含 groupId)
    handleSelect(key, index, newValue, setActivePopover);
  }, [banks, handleSelect, handleAddOption]);

  return {
    parseVariableName,
    cursorInVariable,
    setCursorInVariable,
    currentVariableName,
    setCurrentVariableName,
    currentGroupId,
    setCurrentGroupId,
    findLinkedVariables,
    updateActiveTemplateSelection,
    handleSelect,
    handleAddCustomAndSelect,
  };
};
