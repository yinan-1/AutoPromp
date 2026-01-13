import React, { useRef } from 'react';
import { Eye, Edit3, Copy, Check, ImageIcon, Pencil, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { WaypointsIcon } from './icons/WaypointsIcon';
import { getLocalized } from '../utils/helpers';
import { TemplatePreview } from './TemplatePreview';
import { VisualEditor } from './VisualEditor';
import { EditorToolbar } from './EditorToolbar';
import { PremiumButton } from './PremiumButton';

/**
 * TemplateEditor 组件 - 整合模板编辑的所有UI元素
 * 包括：顶部工具栏、编辑模式、预览模式
 */
export const TemplateEditor = React.memo(({
  // ===== 模板数据 =====
  activeTemplate,
  banks,
  defaults,
  categories,
  INITIAL_TEMPLATES_CONFIG,
  TEMPLATE_TAGS,
  TAG_STYLES,

  // ===== 语言相关 =====
  language,
  templateLanguage,
  setTemplateLanguage,

  // ===== 编辑模式状态 =====
  isEditing,
  setIsEditing,
  handleStartEditing,
  handleStopEditing,

  // ===== 历史记录 =====
  historyPast,
  historyFuture,
  handleUndo,
  handleRedo,

  // ===== 联动组 =====
  cursorInVariable,
  currentGroupId,
  handleSetGroup,
  handleRemoveGroup,

  // ===== 变量交互 =====
  activePopover,
  setActivePopover,
  handleSelect,
  handleAddCustomAndSelect,
  popoverRef,

  // ===== 标题编辑 =====
  editingTemplateNameId,
  tempTemplateName,
  setTempTemplateName,
  saveTemplateName,
  startRenamingTemplate,
  setEditingTemplateNameId,
  tempTemplateAuthor,
  setTempTemplateAuthor,

  // ===== 标签编辑 =====
  handleUpdateTemplateTags,
  editingTemplateTags,
  setEditingTemplateTags,

  // ===== 图片管理 =====
  fileInputRef,
  setShowImageUrlInput,
  handleResetImage,
  handleDeleteImage,
  setImageUpdateMode,
  setCurrentImageEditIndex,

  // ===== 分享/导出/复制 =====
  handleShareLink,
  handleExportImage,
  isExporting,
  handleCopy,
  copied,

  // ===== 模态框 =====
  setIsInsertModalOpen,

  // ===== 其他 =====
  updateActiveTemplateContent,
  setZoomedImage,
  t,
  isDarkMode,
  isMobileDevice,
  mobileTab,
  textareaRef,
  // AI 相关（预留接口）
  onGenerateAITerms = null,  // AI 生成词条的回调函数
}) => {
  // 统一的容器样式
  const containerStyle = !isMobileDevice ? (isDarkMode ? {
    borderRadius: '16px',
    border: '1px solid transparent',
    backgroundImage: 'linear-gradient(180deg, #3B3B3B 0%, #242120 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
  } : {
    borderRadius: '16px',
    border: '1px solid transparent',
    backgroundImage: 'linear-gradient(180deg, #FAF5F1 0%, #F6EBE6 100%), linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
  }) : {};

  const innerBoxStyle = !isMobileDevice ? {
    background: isDarkMode 
      ? 'linear-gradient(#252525, #252525) padding-box, linear-gradient(0deg, #646464 0%, rgba(0, 0, 0, 0) 100%) border-box'
      : 'linear-gradient(#E8E3DD, #E8E3DD) padding-box, linear-gradient(0deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%) border-box',
    boxShadow: 'inset 0px 2px 4px 0px rgba(0, 0, 0, 0.2)',
    border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
  } : {};

  // 模板支持的语言
  const templateLangs = activeTemplate?.language
    ? (Array.isArray(activeTemplate.language) ? activeTemplate.language : [activeTemplate.language])
    : ['cn', 'en'];

  const supportsChinese = templateLangs.includes('cn');
  const supportsEnglish = templateLangs.includes('en');
  const showLanguageToggle = templateLangs.length > 1;

  return (
    <div
      className={`
        ${(mobileTab === 'editor') ? 'flex fixed inset-0 z-30 md:static md:bg-transparent' : 'hidden'}
        ${(mobileTab === 'editor') && isMobileDevice ? (isDarkMode ? 'bg-[#2A2928]' : 'bg-white') : ''}
        md:flex flex-1 shrink-[1] md:min-w-[400px] flex-col h-full overflow-hidden relative
        md:rounded-2xl origin-left
      `}
    >
      <div 
        style={containerStyle}
        className={`flex flex-col w-full h-full ${!isMobileDevice ? 'backdrop-blur-sm' : ''}`}
      >

        {/* ===== 顶部工具栏 ===== */}
        {(!isMobileDevice || mobileTab !== 'settings') && (
          <div className={`px-4 md:px-8 py-3 md:py-4 border-b flex flex-col gap-3 z-30 h-auto flex-shrink-0 pt-safe ${isDarkMode ? 'border-white/5' : 'border-gray-100/50'}`}>
            {/* 第一行：标题、语言切换与模式切换 */}
            <div className="w-full flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3 overflow-hidden">
                {/* Language Toggle - Mobile: Left of Title */}
                {isMobileDevice && showLanguageToggle && (
                  <div className={`premium-toggle-container ${isDarkMode ? 'dark' : 'light'} scale-90 origin-left shrink-0`}>
                    <button
                      onClick={() => supportsChinese && setTemplateLanguage('cn')}
                      className={`premium-toggle-item ${isDarkMode ? 'dark' : 'light'} ${templateLanguage === 'cn' ? 'is-active' : ''} !px-2`}
                    >
                      CN
                    </button>
                    <button
                      onClick={() => supportsEnglish && setTemplateLanguage('en')}
                      className={`premium-toggle-item ${isDarkMode ? 'dark' : 'light'} ${templateLanguage === 'en' ? 'is-active' : ''} !px-2`}
                    >
                      EN
                    </button>
                  </div>
                )}

                {!isMobileDevice && (
                  <h1 className={`text-xl md:text-2xl font-black truncate tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {getLocalized(activeTemplate?.name, language)}
                  </h1>
                )}

                {/* Language Toggle - Desktop: Right of Title */}
                {!isMobileDevice && showLanguageToggle && (
                  <div className={`premium-toggle-container ${isDarkMode ? 'dark' : 'light'} shrink-0`}>
                    <button
                      onClick={() => supportsChinese && setTemplateLanguage('cn')}
                      disabled={!supportsChinese}
                      className={`
                        premium-toggle-item ${isDarkMode ? 'dark' : 'light'}
                        ${!supportsChinese
                          ? 'opacity-30 cursor-not-allowed'
                          : templateLanguage === 'cn'
                            ? 'is-active'
                            : ''}
                      `}
                    >
                      CN
                    </button>
                    <button
                      onClick={() => supportsEnglish && setTemplateLanguage('en')}
                      disabled={!supportsEnglish}
                      className={`
                        premium-toggle-item ${isDarkMode ? 'dark' : 'light'}
                        ${!supportsEnglish
                          ? 'opacity-30 cursor-not-allowed'
                          : templateLanguage === 'en'
                            ? 'is-active'
                            : ''}
                      `}
                    >
                      EN
                    </button>
                  </div>
                )}
              </div>

              {/* 模式切换 */}
              <div className={`premium-toggle-container ${isDarkMode ? 'dark' : 'light'} shrink-0`}>
                <button
                  onClick={handleStopEditing}
                  className={`premium-toggle-item ${isDarkMode ? 'dark' : 'light'} ${!isEditing ? 'is-active' : ''}`}
                  title={t('preview_mode')}
                >
                  <Eye size={14} /> <span className="hidden md:inline ml-1.5">{t('preview_mode')}</span>
                </button>
                <button
                  onClick={handleStartEditing}
                  className={`premium-toggle-item ${isDarkMode ? 'dark' : 'light'} ${isEditing ? 'is-active' : ''}`}
                  title={t('edit_mode')}
                >
                  <Edit3 size={14} /> <span className="hidden md:inline ml-1.5">{t('edit_mode')}</span>
                </button>
              </div>
            </div>

            {/* 第二行：分享、保存、复制按钮 */}
            <div className="w-full flex items-center justify-end gap-1.5 md:gap-3 shrink-0">
              <PremiumButton
                onClick={handleShareLink}
                title={language === 'cn' ? '分享模版' : t('share_link')}
                icon={WaypointsIcon}
                isDarkMode={isDarkMode}
                className="flex-none"
              >
                <span className="hidden md:inline ml-1.5">{language === 'cn' ? '分享模版' : t('share')}</span>
              </PremiumButton>

              <PremiumButton
                onClick={handleExportImage}
                disabled={isEditing || isExporting}
                title={isExporting ? t('exporting') : (language === 'cn' ? '导出长图' : t('export_image'))}
                icon={ImageIcon}
                isDarkMode={isDarkMode}
                className="flex-none"
              >
                <span className="hidden md:inline ml-1.5 truncate">
                  {isExporting ? (language === 'cn' ? '导出中...' : 'Exp...') : (language === 'cn' ? '导出长图' : 'Img')}
                </span>
              </PremiumButton>

              <PremiumButton
                onClick={handleCopy}
                title={copied ? t('copied') : (language === 'cn' ? '复制结果' : t('copy_result'))}
                icon={copied ? Check : Copy}
                active={true}
                isDarkMode={isDarkMode}
                className="flex-none"
              >
                <span className="hidden md:inline ml-1.5 truncate">
                  {copied ? t('copied') : (language === 'cn' ? '复制结果' : 'Copy')}
                </span>
              </PremiumButton>
            </div>
          </div>
        )}

        {/* ===== 核心内容区 ===== */}
        <div className={`flex-1 overflow-hidden relative flex flex-col ${mobileTab === 'settings' ? 'pt-0' : (!isMobileDevice ? 'p-2' : 'pb-24')}`}>
          <div 
            style={innerBoxStyle}
            className={`flex-1 overflow-hidden relative flex flex-col ${!isMobileDevice ? 'rounded-xl' : ''}`}
          >
            {/* 编辑模式 */}
            {isEditing ? (
              <div className="flex-1 relative overflow-hidden flex flex-col">
                {/* 编辑工具栏 */}
                <div className={`backdrop-blur-sm ${isDarkMode ? 'bg-white/5' : 'bg-white/30'}`}>
                  <EditorToolbar
                    onInsertClick={() => setIsInsertModalOpen(true)}
                    canUndo={historyPast.length > 0}
                    canRedo={historyFuture.length > 0}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    t={t}
                    isDarkMode={isDarkMode}
                    cursorInVariable={cursorInVariable}
                    currentGroupId={currentGroupId}
                    onSetGroup={handleSetGroup}
                    onRemoveGroup={handleRemoveGroup}
                  />
                </div>

                {/* Edit Mode: Title & Author Inputs */}
                <div className={`px-8 pt-6 pb-4 flex flex-col gap-4 border-b ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-100/50 border-gray-200'}`}>
                  <div className="flex flex-col gap-1.5">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                      {language === 'cn' ? '模版标题 (Title)' : 'Template Title'}
                    </label>
                    <input
                      type="text"
                      value={tempTemplateName}
                      onChange={(e) => setTempTemplateName(e.target.value)}
                      onBlur={saveTemplateName}
                      className={`text-xl font-bold bg-transparent border-b-2 border-orange-500/20 focus:border-orange-500 focus:outline-none w-full pb-1 transition-all ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                      placeholder={t('label_placeholder')}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                      {language === 'cn' ? '作者 (Author)' : 'Author'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={tempTemplateAuthor}
                        onChange={(e) => setTempTemplateAuthor(e.target.value)}
                        onBlur={saveTemplateName}
                        disabled={INITIAL_TEMPLATES_CONFIG.some(cfg => cfg.id === activeTemplate.id)}
                        className={`text-sm font-bold bg-transparent border-b border-dashed focus:border-solid border-orange-500/30 focus:border-orange-500 focus:outline-none w-full pb-1 transition-all ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                        placeholder={language === 'cn' ? '作者名称...' : 'Author name...'}
                      />
                      {INITIAL_TEMPLATES_CONFIG.some(cfg => cfg.id === activeTemplate.id) && (
                        <p className="text-[10px] text-orange-500/50 font-bold italic mt-1">
                          {language === 'cn' ? '* 系统模版作者不可修改' : '* System template author is read-only'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Visual Editor */}
                <VisualEditor
                  ref={textareaRef}
                  value={getLocalized(activeTemplate?.content, templateLanguage)}
                  onChange={(e) => {
                    const newText = e.target.value;
                    if (typeof activeTemplate.content === 'object') {
                      updateActiveTemplateContent({
                        ...activeTemplate.content,
                        [templateLanguage]: newText
                      });
                    } else {
                      updateActiveTemplateContent(newText);
                    }
                  }}
                  banks={banks}
                  categories={categories}
                  isDarkMode={isDarkMode}
                  activeTemplate={activeTemplate}
                  language={language}
                  t={t}
                />
              </div>
            ) : (
              /* 预览模式 */
              <TemplatePreview
                activeTemplate={activeTemplate}
                banks={banks}
                defaults={defaults}
                categories={categories}
                activePopover={activePopover}
                setActivePopover={setActivePopover}
                handleSelect={handleSelect}
                handleAddCustomAndSelect={handleAddCustomAndSelect}
                popoverRef={popoverRef}
                t={t}
                displayTag={(tag) => {
                  const tagLabels = {
                    '创意': { cn: '创意', en: 'Creative' },
                    '人物': { cn: '人物', en: 'Character' },
                    '场景': { cn: '场景', en: 'Scene' },
                    '风格': { cn: '风格', en: 'Style' },
                    '物品': { cn: '物品', en: 'Object' },
                  };
                  return getLocalized(tagLabels[tag] || tag, language);
                }}
                TAG_STYLES={TAG_STYLES}
                setZoomedImage={setZoomedImage}
                fileInputRef={fileInputRef}
                setShowImageUrlInput={setShowImageUrlInput}
                handleResetImage={handleResetImage}
                handleDeleteImage={handleDeleteImage}
                language={templateLanguage}
                setLanguage={setTemplateLanguage}
                TEMPLATE_TAGS={TEMPLATE_TAGS}
                handleUpdateTemplateTags={handleUpdateTemplateTags}
                editingTemplateTags={editingTemplateTags}
                setEditingTemplateTags={setEditingTemplateTags}
                setImageUpdateMode={setImageUpdateMode}
                setCurrentImageEditIndex={setCurrentImageEditIndex}
                editingTemplateNameId={editingTemplateNameId}
                tempTemplateName={tempTemplateName}
                setTempTemplateName={setTempTemplateName}
                saveTemplateName={saveTemplateName}
                startRenamingTemplate={startRenamingTemplate}
                setEditingTemplateNameId={setEditingTemplateNameId}
                tempTemplateAuthor={tempTemplateAuthor}
                setTempTemplateAuthor={setTempTemplateAuthor}
                INITIAL_TEMPLATES_CONFIG={INITIAL_TEMPLATES_CONFIG}
                isDarkMode={isDarkMode}
                isEditing={isEditing}
                setIsInsertModalOpen={setIsInsertModalOpen}
                historyPast={historyPast}
                historyFuture={historyFuture}
                handleUndo={handleUndo}
                handleRedo={handleRedo}
                cursorInVariable={cursorInVariable}
                currentGroupId={currentGroupId}
                handleSetGroup={handleSetGroup}
                handleRemoveGroup={handleRemoveGroup}
                updateActiveTemplateContent={updateActiveTemplateContent}
                textareaRef={textareaRef}
                templateLanguage={templateLanguage}
                onGenerateAITerms={onGenerateAITerms}  // 传递 AI 生成回调
                handleShareLink={handleShareLink} // 传递分享回调
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

TemplateEditor.displayName = 'TemplateEditor';
