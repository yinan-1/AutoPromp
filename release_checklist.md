# Prompt Fill 发版与数据维护指南 (Release Checklist)

本仓库采用“代码版本”与“数据版本”分离的机制。为了实现“一处修改，全端同步”，请务必遵循以下流程。

---

## 1. 版本号管理

### [应用版本] App Version
涉及 UI 改动、逻辑修复或新功能开发。
- **`package.json`**: `"version": "x.x.x"`
- **`src/App.jsx`**: `const APP_VERSION = "x.x.x";`
- **注意**：修改此版本后，必须重新通过 Git 推送并触发 Vercel 部署。

### [数据版本] Data Version
仅涉及模板添加、词库扩充或默认值修改。
- **`src/data/templates.js`**: `export const SYSTEM_DATA_VERSION = "x.x.x";`
- **注意**：数据变动后必须**手动递增**此版本号，以便触发用户的“新模板提醒”。

---

## 2. 模板与词库制作 (Data Update)

### 添加新模板
1.  在 `src/data/templates.js` 顶部定义模板内容常量（支持双语）。
2.  在 `INITIAL_TEMPLATES_CONFIG` 数组中注册该模板。
3.  确保 `id` 唯一，并配置好 `imageUrl` 和 `selections` 默认值。

### 扩充词库
1.  在 `src/data/banks.js` 的 `INITIAL_BANKS` 中添加新词条。
2.  若涉及新变量名，需同步在 `INITIAL_DEFAULTS` 中设置默认值。

---

## 3. 自动化同步 (Automation)

在任何数据修改完成后，必须运行同步脚本以生成分发用的 JSON 文件：

```bash
npm run sync-data
```

**该脚本会自动执行：**
- 将 `src/data/*.js` 的最新数据提取并转换为 `public/data/*.json`。
- 同步最新的 `appVersion` 和 `dataVersion` 到 `version.json`。
- 更新文件修改时间。

---

## 4. 后端部署 (Cloud Sync)

为了让国内用户和已安装用户实时获取更新，需要将生成的 JSON 上传至宝塔服务器：

- **目标目录**：`/www/wwwroot/promptfillapi/data/`
- **必传文件**：
    - `public/data/version.json`
    - `public/data/templates.json`
    - `public/data/banks.json`
- **生效操作**：
    1. 上传覆盖上述三个文件。
    2. **重启 Node 服务**：在宝塔“Node项目管理”中点击“重启”，确保静态资源缓存更新。
- **验证**：访问 `http://data.tanshilong.com/data/version.json` 确认版本号已更新。

---

## 5. 文档与 UI 同步

### 更新日志 (Changelog)
- **`src/components/SettingsView.jsx`**: 在 `updateLogs` 数组最前端添加版本说明。
- **`src/components/MobileSettingsView.jsx`**: 同步添加。

### 外部文档
- **`README.md`**: 更新顶部的 Shields.io Badge 徽章及版本描述。

---

## 6. AI 功能维护 (AI Feature)

### 功能开关
- **`src/constants/aiConfig.js`**: `AI_FEATURE_ENABLED`
  - 开发/测试环境建议开启 (`true`)。
  - 生产环境发版前需确认是否开放此功能。

### API Key 安全
- API Key 仅存储在用户浏览器的 `localStorage` 中，**严禁**硬编码在代码或提交到 Git。
- 测试时请确保清除本地缓存的测试 Key。

### UI 兼容性
- AI 功能开启时，`Variable` 组件会变为两列布局（宽度约 580px），需确保在各种屏幕尺寸下的显示效果。
- 检查 `TemplateEditor` -> `TemplatePreview` -> `Variable` 的 `onGenerateAITerms` 回调传递是否正常。

---

## 7. 存储架构 (Storage)

### IndexedDB 迁移
- 核心数据（模板、词库、分类、默认值）已切换至 **IndexedDB** 存储，以突破 LocalStorage 的 5MB 限制。
- 只有设置信息（语言、主题、最后版本号等）保留在 LocalStorage。
- 发版前确保 `src/utils/db.js` 中的数据库版本号和迁移逻辑正常。

---

## 8. 发版最终检查清单

1. [ ] `SYSTEM_DATA_VERSION` 已递增？
2. [ ] 已运行 `npm run sync-data`？
3. [ ] `public/data/` 下的 JSON 是否已上传至宝塔 `/api/data` 目录？
4. [ ] 宝塔 Node 项目是否已重启？
5. [ ] 手机端和电脑端的更新日志是否已同步？
6. [ ] 本地代码是否已执行 `git push`？
