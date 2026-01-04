import { useState, useMemo, useEffect, useCallback } from 'react';
import { compressTemplate, decompressTemplate, copyToClipboard, getLocalized } from '../utils/helpers';
import { PUBLIC_SHARE_URL } from '../data/templates';

// ====== 私有后端配置 ======
const API_BASE_URL = 
  import.meta.env.VITE_SHARE_API_URL || 
  'https://data.tanshilong.com/api/share';

/**
 * 分享功能 Hook
 * 提供模版分享、导入相关的功能
 * 支持链接分享和口令分享两种方式
 * 已升级支持私有短链服务器与自定义词库分享
 *
 * @param {Object} activeTemplate - 当前激活的模版
 * @param {Function} setTemplates - 更新模版的函数
 * @param {Function} setActiveTemplateId - 设置激活模版的函数
 * @param {Function} setDiscoveryView - 设置发现页视图的函数
 * @param {boolean} isMobileDevice - 是否为移动设备
 * @param {Function} setMobileTab - 设置移动端标签的函数
 * @param {string} language - 当前语言
 * @param {Function} t - 翻译函数
 * @param {Object} banks - 词库数据
 * @param {Function} setBanks - 更新词库的函数
 * @param {Object} categories - 分类数据
 * @param {Function} setCategories - 更新分类的函数
 * @returns {Object} 分享相关的状态和函数
 */
export const useShareFunctions = (
  activeTemplate,
  setTemplates,
  setActiveTemplateId,
  setDiscoveryView,
  isMobileDevice,
  setMobileTab,
  language,
  t,
  banks,
  setBanks,
  categories,
  setCategories
) => {
  // 分享功能相关状态
  const [sharedTemplateData, setSharedTemplateData] = useState(null);
  const [showShareImportModal, setShowShareImportModal] = useState(false);
  const [showShareOptionsModal, setShowShareOptionsModal] = useState(false);
  const [showImportTokenModal, setShowImportTokenModal] = useState(false);
  const [importTokenValue, setImportTokenValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false); // 新增：网络请求状态

  // 计算分享 URL（保留作为兜底的长链接预览，但在实际分享时会尝试生成短链）
  const shareUrlMemo = useMemo(() => {
    if (!activeTemplate) return "";

    const compressed = compressTemplate(activeTemplate, banks, categories);
    const base = PUBLIC_SHARE_URL || (window.location.origin + window.location.pathname);

    if (!compressed) return base;

    const fullUrl = `${base}${base.endsWith('/') ? '' : '/'}#/share?share=${compressed}`;
    return fullUrl;
  }, [activeTemplate, banks, categories]);

  // 检查分享参数（在 URL 中检测分享链接）
  useEffect(() => {
    const handleCheckShare = async () => {
      // 兼容查询参数和哈希参数
      const hashStr = window.location.hash.split('?')[1] || "";
      const urlParams = new URLSearchParams(window.location.search || hashStr);
      let shareData = urlParams.get('share');

      // 如果没有直接获取到 share 参数，尝试从整个 hash 字符串中解析
      if (!shareData && window.location.hash.includes('share=')) {
        const match = window.location.hash.match(/share=([^&?]+)/);
        if (match) shareData = match[1];
      }

      if (shareData) {
        // 如果输入的是完整的 URL，提取 share 参数部分
        if (shareData.includes('share=')) {
          try {
            const innerUrl = new URL(shareData.startsWith('http') ? shareData : 'http://x.com/' + shareData);
            const innerParams = new URLSearchParams(innerUrl.search || innerUrl.hash.split('?')[1]);
            shareData = innerParams.get('share') || shareData;
          } catch (e) {
            // 如果解析失败，保持原样
          }
        }

        // --- 核心改动：支持短码解析 ---
        // 如果 shareData 长度较短（比如 8 位），说明是短码，需要去后端请求
        if (shareData.length <= 15) {
          try {
            const res = await fetch(`${API_BASE_URL}/${shareData}`);
            const result = await res.json();
            if (result.data) {
              const decoded = decompressTemplate(result.data);
              if (decoded) {
                setSharedTemplateData(decoded);
                setShowShareImportModal(true);
              }
            }
          } catch (e) {
            console.warn("Short code fetch failed, might be legacy link:", e);
            // 这里可以不报错，因为可能是无效的长链接片段
          }
        } else {
          // --- 原有长链解析逻辑 ---
          const decoded = decompressTemplate(shareData);
          if (decoded && decoded.name && decoded.content) {
            setSharedTemplateData(decoded);
            setShowShareImportModal(true);
          }
        }

        // 清理 URL，避免刷新时重复触发
        const newUrl = window.location.origin + window.location.pathname + window.location.hash.split('?')[0];
        window.history.replaceState({}, document.title, newUrl);
      }
    };

    handleCheckShare();
    window.addEventListener('hashchange', handleCheckShare);
    return () => window.removeEventListener('hashchange', handleCheckShare);
  }, []);

  /**
   * 辅助函数：向后端换取短码
   */
  const getShortCodeFromServer = useCallback(async (compressedData) => {
    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: compressedData })
      });
      const result = await res.json();
      return result.code;
    } catch (e) {
      console.error("Failed to get short code:", e);
      return null;
    }
  }, []);

  /**
   * 手动口令导入处理函数 (支持短码)
   * 支持多种格式：完整 URL、口令格式、原始分享码
   *
   * @param {string} token - 分享口令或链接
   */
  const handleManualTokenImport = useCallback(async (token) => {
    if (!token) return;

    let shareData = token.trim();

    // 识别是否是特殊的口令格式 #pf$token$
    if (shareData.includes('#pf$') && shareData.includes('$')) {
      const match = shareData.match(/#pf\$([^$]+)\$/);
      if (match) shareData = match[1];
    }

    // 识别是否是完整的 URL 链接
    if (shareData.includes('http://') || shareData.includes('https://') || shareData.includes('share=')) {
      try {
        // 尝试解析 URL
        const urlObj = new URL(shareData.startsWith('http') ? shareData : 'http://temp.com/' + shareData);
        const params = new URLSearchParams(urlObj.search || urlObj.hash.split('?')[1]);
        const extracted = params.get('share');
        if (extracted) shareData = extracted;
      } catch (e) {
        // 解析失败则按原样尝试
      }
    }

    // 如果是短码，去服务器换取完整数据
    if (shareData.length <= 15) {
      try {
        const res = await fetch(`${API_BASE_URL}/${shareData}`);
        const result = await res.json();
        if (result.data) {
          shareData = result.data;
        }
      } catch (e) {
        console.error("Short code import fetch failed:", e);
      }
    }

    const decoded = decompressTemplate(shareData);
    if (decoded && decoded.name && decoded.content) {
      setSharedTemplateData(decoded);
      setShowShareImportModal(true);
    } else {
      alert(language === 'cn' ? '无效的分享口令或链接' : 'Invalid share token or link');
    }
  }, [language]);

  /**
   * 导入分享的模版
   * 将分享的模版数据添加到用户的模版列表中
   * 同时也导入相关的词库和分类，并处理键名冲突
   */
  const handleImportSharedTemplate = useCallback(() => {
    if (!sharedTemplateData) return;

    let templateToImport = {
      ...sharedTemplateData,
      id: `tpl_shared_${Date.now()}`,
      selections: sharedTemplateData.selections || {},
      author: sharedTemplateData.author || t('official')
    };

    const keyMap = {};
    const banksToImport = sharedTemplateData.banks || {};
    const categoriesToImport = sharedTemplateData.categories || {};

    // 1. 预扫描冲突的词库键名并建立映射
    // 按键名长度降序排序，避免替换时前缀冲突（如 bank 和 bank_extra）
    const sortedOldKeys = Object.keys(banksToImport).sort((a, b) => b.length - a.length);

    sortedOldKeys.forEach(oldKey => {
      const bank = banksToImport[oldKey];
      if (banks[oldKey]) {
        // 如果本地已存在同名键，且内容不完全一致，则需要重命名导入的词库
        const existingBank = banks[oldKey];
        const isSame = JSON.stringify(existingBank.options) === JSON.stringify(bank.options);
        
        if (!isSame) {
          let newKey = oldKey;
          let charCode = 65; // 'A' 的 ASCII 码
          
          // 辅助函数：根据数字生成字母后缀 (0 -> A, 1 -> B, 26 -> AA ...)
          const getLetterSuffix = (num) => {
            let suffix = '';
            let n = num;
            while (n >= 0) {
              suffix = String.fromCharCode((n % 26) + 65) + suffix;
              n = Math.floor(n / 26) - 1;
            }
            return suffix;
          };

          let index = 0;
          // 确保新生成的键名在本地和本次导入中都是唯一的
          while (banks[newKey] || banksToImport[newKey] || Object.values(keyMap).includes(newKey)) {
             newKey = `${oldKey}_${getLetterSuffix(index)}`;
             index++;
          }
          keyMap[oldKey] = newKey;
        }
      }
    });

    // 2. 如果有重命名，同步更新模板内容和已选状态
    if (Object.keys(keyMap).length > 0) {
      const updateContentText = (text) => {
        if (typeof text !== 'string') return text;
        let newText = text;
        // 按照排序后的键名依次替换，确保逻辑正确
        sortedOldKeys.forEach(oldKey => {
          if (keyMap[oldKey]) {
            const newKey = keyMap[oldKey];
            // 匹配 {{oldKey}} 或 {{oldKey_xxx}} 或 {{ oldKey }}
            // 这里的正则要足够精确，只替换变量名部分
            const regex = new RegExp(`({{\\s*)${oldKey}((?=[_\\s}])|(?=}))`, 'g');
            newText = newText.replace(regex, `$1${newKey}`);
          }
        });
        return newText;
      };

      const updateContent = (content) => {
        if (!content) return content;
        if (typeof content === 'string') {
          return updateContentText(content);
        } else if (typeof content === 'object') {
          const newContent = {};
          Object.keys(content).forEach(lang => {
            newContent[lang] = updateContentText(content[lang]);
          });
          return newContent;
        }
        return content;
      };

      templateToImport.content = updateContent(templateToImport.content);
      
      // 更新 selections 中的键名 (格式为 key-idx 或 key_groupId-idx)
      const newSelections = {};
      Object.entries(templateToImport.selections).forEach(([selKey, val]) => {
        let currentSelKey = selKey;
        sortedOldKeys.forEach(oldKey => {
          if (keyMap[oldKey]) {
            const newKey = keyMap[oldKey];
            // 匹配开头是 oldKey，后面跟着 - (普通变量) 或 _ (联动组)
            const regex = new RegExp(`^${oldKey}(?=[-_])`);
            if (regex.test(currentSelKey)) {
              currentSelKey = currentSelKey.replace(regex, newKey);
            }
          }
        });
        newSelections[currentSelKey] = val;
      });
      templateToImport.selections = newSelections;
    }

    // 3. 执行词库导入（合并到本地词库，使用处理冲突后的键名）
    setBanks(prevBanks => {
      const newBanks = { ...prevBanks };
      let hasChange = false;
      Object.entries(banksToImport).forEach(([oldKey, bank]) => {
        const finalKey = keyMap[oldKey] || oldKey;
        if (!newBanks[finalKey]) {
          newBanks[finalKey] = bank;
          hasChange = true;
        }
      });
      return hasChange ? newBanks : prevBanks;
    });

    // 4. 执行分类导入
    if (Object.keys(categoriesToImport).length > 0) {
      setCategories(prevCats => {
        const newCats = { ...prevCats };
        let hasChange = false;
        Object.entries(categoriesToImport).forEach(([id, cat]) => {
          if (!newCats[id]) {
            newCats[id] = cat;
            hasChange = true;
          }
        });
        return hasChange ? newCats : prevCats;
      });
    }

    // 5. 完成模板导入
    setTemplates(prev => [...prev, templateToImport]);
    setActiveTemplateId(templateToImport.id);
    setShowShareImportModal(false);
    setSharedTemplateData(null);
    setDiscoveryView(false);

    if (isMobileDevice) {
      setMobileTab('editor');
    }
  }, [sharedTemplateData, setTemplates, setActiveTemplateId, setDiscoveryView, isMobileDevice, setMobileTab, t, setBanks, setCategories, banks]);

  /**
   * 打开分享选项弹窗
   */
  const handleShareLink = useCallback(() => {
    setShowShareOptionsModal(true);
  }, []);

  /**
   * 复制分享链接到剪贴板 (升级为短链接)
   */
  const doCopyShareLink = useCallback(async () => {
    if (!activeTemplate) return;
    setIsGenerating(true);

    const compressed = compressTemplate(activeTemplate, banks, categories);
    const shortCode = await getShortCodeFromServer(compressed);
    
    const base = PUBLIC_SHARE_URL || (window.location.origin + window.location.pathname);
    // 优先使用短码，失败则降级使用压缩的长串
    const finalShareData = shortCode || compressed;
    const fullUrl = `${base}${base.endsWith('/') ? '' : '/'}#/share?share=${finalShareData}`;

    const success = await copyToClipboard(fullUrl);
    setIsGenerating(false);

    if (success) {
      alert(t('share_success'));
      setShowShareOptionsModal(false);
    } else {
      alert(language === 'cn' ? '复制失败，请手动长按复制' : 'Copy failed, please copy manually');
    }
  }, [activeTemplate, getShortCodeFromServer, t, language, banks, categories]);

  /**
   * 复制分享口令（微信友好格式，支持短码）
   * 格式：「Prompt分享」我的新模版：XXX\n复制整段文字，打开【提示词填空器】即可导入：\n#pf$token$
   */
  const handleShareToken = useCallback(async () => {
    if (!activeTemplate) return;
    setIsGenerating(true);

    const compressed = compressTemplate(activeTemplate, banks, categories);
    const shortCode = await getShortCodeFromServer(compressed);
    const templateName = getLocalized(activeTemplate.name, language);
    
    const finalToken = shortCode || compressed;
    const tokenText = `「Prompt分享」我的新模版：${templateName}\n复制整段文字，打开【提示词填空器】即可导入：\n#pf$${finalToken}$`;

    const success = await copyToClipboard(tokenText);
    setIsGenerating(false);

    if (success) {
      alert(language === 'cn' ? '分享口令已复制，快去发给好友吧！' : 'Share token copied!');
      setShowShareOptionsModal(false);
    } else {
      alert(language === 'cn' ? '复制失败，请尝试链接分享' : 'Copy failed, please try Link Share');
    }
  }, [activeTemplate, language, getShortCodeFromServer, banks, categories]);

  return {
    // 状态
    sharedTemplateData,
    showShareImportModal,
    showShareOptionsModal,
    showImportTokenModal,
    importTokenValue,
    shareUrlMemo,
    isGenerating,

    // 设置状态的函数
    setSharedTemplateData,
    setShowShareImportModal,
    setShowShareOptionsModal,
    setShowImportTokenModal,
    setImportTokenValue,

    // 功能函数
    handleManualTokenImport,
    handleImportSharedTemplate,
    handleShareLink,
    doCopyShareLink,
    handleShareToken,
    getShortCodeFromServer,
  };
};
