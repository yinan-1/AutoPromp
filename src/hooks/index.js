/**
 * Hooks 统一导出文件
 * 集中管理所有自定义 Hooks 的导出
 */

// 现有的 Hooks
export { useStickyState } from './useStickyState';

// 新增的 Hooks
export { useEditorHistory } from './useEditorHistory';
export { useLinkageGroups, parseVariableName } from './useLinkageGroups';
export { useShareFunctions } from './useShareFunctions';
export { useTemplateManagement } from './useTemplateManagement';
