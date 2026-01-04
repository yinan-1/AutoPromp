// EditorToolbar 组件 - 编辑器工具栏
import React, { useState } from 'react';
import { Plus, Undo, Redo, Link, Unlink, ChevronDown, ChevronUp } from 'lucide-react';
import { PremiumButton } from './PremiumButton';

export const EditorToolbar = ({ 
  onInsertClick, 
  canUndo, 
  canRedo, 
  onUndo, 
  onRedo, 
  t, 
  isDarkMode,
  // 分组功能相关
  cursorInVariable = false,
  currentGroupId = null,
  onSetGroup,
  onRemoveGroup
}) => {
  const [isGroupsExpanded, setIsGroupsExpanded] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className={`flex flex-col border-b backdrop-blur-md flex-shrink-0 z-20 ${isDarkMode ? 'border-white/5 bg-white/5 text-gray-300' : 'border-gray-200 bg-white/80'}`}>
      {/* 第一行：撤销/重做 & 插入按钮 */}
      <div className="h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {/* Undo/Redo */}
          <div className="flex items-center gap-2">
            <PremiumButton 
              onClick={onUndo} 
              disabled={!canUndo} 
              title={t('undo') || "撤消"} 
              icon={Undo} 
              isDarkMode={isDarkMode}
              className="!p-1" 
            />
            <PremiumButton 
              onClick={onRedo} 
              disabled={!canRedo} 
              title={t('redo') || "重做"} 
              icon={Redo} 
              isDarkMode={isDarkMode}
              className="!p-1" 
            />
          </div>

          <div className={`h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-300'}`} />

          {/* 移动端折叠触发器 */}
          {isMobile && (
            <button 
              onClick={() => setIsGroupsExpanded(!isGroupsExpanded)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all ${isDarkMode ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <Link size={14} className={currentGroupId ? 'text-orange-500' : ''} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {currentGroupId ? `${t('link_group') || '联动组'} ${currentGroupId}` : (t('link_group') || '联动组')}
              </span>
              {isGroupsExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}

          {/* 桌面端显示联动组标签 */}
          {!isMobile && (
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                {t('link_group') || '联动组'}:
              </span>
              <div className={`premium-toggle-container ${isDarkMode ? 'dark' : 'light'}`}>
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    onClick={() => onSetGroup(num)}
                    disabled={!cursorInVariable}
                    className={`
                      premium-toggle-item ${isDarkMode ? 'dark' : 'light'}
                      !px-3 !py-1 min-w-[32px]
                      ${currentGroupId === num.toString() ? 'is-active' : ''}
                      ${!cursorInVariable ? 'opacity-30 cursor-not-allowed' : ''}
                    `}
                    title={cursorInVariable ? `${t('set_group') || '设置为联动组'} ${num}` : t('place_cursor_in_variable') || '请将光标置于变量内'}
                  >
                    {num}
                  </button>
                ))}
                
                {currentGroupId && <div className={`w-px h-4 self-center mx-1 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`} />}

                {currentGroupId && (
                  <button
                    onClick={onRemoveGroup}
                    disabled={!cursorInVariable}
                    className={`
                      premium-toggle-item ${isDarkMode ? 'dark' : 'light'}
                      !px-3 !py-1 text-red-500 hover:text-red-600 hover:bg-red-500/10
                      ${!cursorInVariable ? 'opacity-30 cursor-not-allowed' : ''}
                    `}
                    title={t('remove_group') || "解除关联"}
                  >
                    <Unlink size={14} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Insert */}
        <div className="flex items-center gap-2">
          <PremiumButton 
            onClick={onInsertClick} 
            icon={Plus} 
            isDarkMode={isDarkMode}
          >
            {t('insert')}
          </PremiumButton>
        </div>
      </div>

      {/* 移动端折叠面板：联动组选择 */}
      {isMobile && isGroupsExpanded && (
        <div className={`px-4 py-4 border-t animate-in slide-in-from-top-1 duration-200 ${isDarkMode ? 'border-white/5 bg-black/20' : 'border-gray-100 bg-gray-50/50'}`}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black uppercase tracking-widest px-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {t('link_group_desc') || '设置选中变量的联动编号'}
              </span>
              {currentGroupId && (
                <button
                  onClick={onRemoveGroup}
                  disabled={!cursorInVariable}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-red-500 text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/10 rounded-xl transition-all border border-red-500/20"
                >
                  <Unlink size={12} /> {t('remove_group') || "解除关联"}
                </button>
              )}
            </div>
            <div className={`premium-toggle-container ${isDarkMode ? 'dark' : 'light'} !w-full !justify-around !p-1.5`}>
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  onClick={() => onSetGroup(num)}
                  disabled={!cursorInVariable}
                  className={`
                    premium-toggle-item ${isDarkMode ? 'dark' : 'light'}
                    flex-1 !py-2.5 !text-sm
                    ${currentGroupId === num.toString() ? 'is-active' : ''}
                    ${!cursorInVariable ? 'opacity-30 cursor-not-allowed' : ''}
                  `}
                >
                  {num}
                </button>
              ))}
            </div>
            {!cursorInVariable && (
              <p className="text-[11px] text-orange-500/80 font-bold italic px-1 text-center">
                {t('place_cursor_in_variable') || '请先将光标置于编辑器中的变量内'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
