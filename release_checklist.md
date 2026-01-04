# Prompt Fill 发版指南 (Release Checklist)

本仓库采用多重版本校验机制，发版时请务必同步更新以下位置的版本号，以确保“更新提醒”和“数据同步”功能正常工作。

## 1. 核心版本文件

### [应用版本] App Version
用于触发“应用更新提醒”以及显示在 UI 各处。
- **`package.json`**: `"version": "x.x.x"`
- **`src/App.jsx`**: `const APP_VERSION = "x.x.x";`
- **`public/version.json`**: `"appVersion": "x.x.x"`

### [数据版本] Data Version
用于触发“词库/模板更新提醒”，当预置数据（`templates.js` 或 `banks.js`）变动时必须升级。
- **`src/data/templates.js`**: `export const SYSTEM_DATA_VERSION = "x.x.x";`
- **`public/version.json`**: `"dataVersion": "x.x.x"`

---

## 2. 文档与 UI 同步

### 更新日志 (Changelog)
发版前需在设置界面添加对应的版本说明。
- **`src/components/SettingsView.jsx`**: 在 `updateLogs` 数组最前端添加新版本对象。
- **`src/components/MobileSettingsView.jsx`**: 在 `updateLogs` 数组最前端添加新版本对象（注意格式略有不同）。

### 外部文档
- **`README.md`**: 
    - 更新顶部的 Shields.io Badge 徽章。
    - 更新“前言/Foreword”部分的版本号描述。

---

## 3. 发版检查清单 (Final Checklist)

1. [ ] 是否已运行 `npm run build` 确保构建无误？
2. [ ] `public/version.json` 里的版本号是否与 `App.jsx` 完全一致？
3. [ ] `SYSTEM_DATA_VERSION` 是否已根据数据变动情况升级？
4. [ ] 手机端和电脑端的更新日志是否已同步？
5. [ ] GitHub 徽章是否已更新？

---

## 4. 自动化建议
未来可考虑使用 GitHub Actions 自动从 `package.json` 同步版本号到 `version.json`。
