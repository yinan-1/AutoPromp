# Prompt Fill (提示词填空器)

[English](./README.md) | [中文](./README.md#prompt-fill-提示词填空器-1)

A **structured prompt generation tool** designed specifically for AI painting (GPT, Midjourney, Nano Banana, etc.). Help users quickly build, manage, and iterate complex prompts through a visual "fill-in-the-blank" interaction.

一个专为 AI 绘画（GPT、Nano Banana 等）设计的**结构化提示词生成工具**。通过可视化的"填空"交互方式，帮助用户快速构建、管理和迭代复杂的 Prompt。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/Version-0.6.1-orange.svg)
![Data](https://img.shields.io/badge/Data-0.7.2-green.svg)
![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)

<img width="1343" height="612" alt="image@1x-2" src="https://github.com/user-attachments/assets/7c3d969b-7f63-46fc-a16a-e3074da6c692" />
<img width="1343" height="620" alt="1231333" src="https://github.com/user-attachments/assets/08c90a9f-7b1e-4b3d-84fc-650bccfd1d2b" />

## 📝 Foreword / 写在前面

**English:**
Prompt Fill is now at version **v0.6.1**. The original intention of this project is to solve the problem of hard-to-remember, hard-to-manage, and tedious modification of prompts in the AI painting process. By structuring prompts, creation becomes as simple as "filling in the blanks".

**中文：**
Prompt Fill 现已迭代至 **v0.6.1** 版本。本项目初衷是解决 AI 绘画过程中提示词难记忆、难管理、修改繁琐的问题。通过将 Prompt 结构化，让创作变得像"填空"一样简单。

### 🌟 Progress & Core Features / 目前进度与核心功能

*   **✅ Full Dark Mode Support**: One-click theme switching for desktop and mobile. / **全面暗色模式支持**：支持桌面端与移动端的一键主题切换。
*   **✅ Linkage Groups**: Sync modifications globally within groups (e.g., `{{color}}_1`). / **词组联动系统**：支持变量成组联动，修改一处，全局同步。
*   **✅ Structured Prompt Engine**: Automatic interactive form conversion via `{{variable}}`. / **结构化 Prompt 引擎**：支持 `{{variable}}` 语法，自动转化为交互式表单。
*   **✅ Dynamic Bank System**: Preset art tags with category management and batch import. / **动态词库系统**：预置数百个常用标签，支持分类管理与批量导入。
*   **✅ HD Social Sharing**: Export beautiful JPG long images with auto-extracted colors. / **高清社交分享**：内置模版封面渲染，支持一键导出精美 JPG 长图。
*   **✅ Cloud Awareness**: Real-time sync for official templates and features. / **模版/版本感知**：官方模版云端同步感知，无需手动刷新。
*   **✅ Local Storage**: Private data stored in browser LocalStorage. / **纯本地存储**：基于浏览器 LocalStorage，数据完全掌握在自己手中。

---

## ✨ Core Features / 核心特性

### 🧩 Intelligent Bank Management / 智能词库管理
*   **Category Management**: Color-coded categories (e.g., characters, actions) for visual clarity. / **分类管理**：支持自定义分类并通过颜色区分，视觉更清晰。
*   **Bidirectional Sync**: Directly add custom options in preview to sync back to the bank. / **双向同步**：预览填空时可直接添加"自定义选项"，自动同步到词库。
*   **Category Editor**: Manage categories and 12 preset colors. / **分类编辑器**：内置分类管理器，支持颜色配置。
*   **Responsive Layout**: Efficient masonry multi-column layout. / **响应式布局**：词库列表支持瀑布流式多列布局。

### 📝 Multi-Template System / 多模版系统
*   **Independent Templates**: Create separate prompt templates for different use cases. / **独立模版**：支持创建多个独立的 Prompt 模版。
*   **Isolated State**: Variable selections are independent per template. / **独立状态**：每个模版的变量选择互不干扰。
*   **Clone/Copy**: One-click duplication for A/B testing. / **副本克隆**：支持一键创建模版副本，方便进行 A/B 测试。

### 🖱️ Visual Interaction / 可视化交互
*   **WYSIWYG Editing**: Highlighting variables by category color during editing. / **所见即所得编辑**：编辑模式下变量根据分类颜色高亮显示。
*   **Linkage Groups**: Sync same variables in designated groups. / **成组联动 (Linkage Groups)**：设置联动组，具有相同组号的变量自动保持同步。
*   **Drag & Drop**: Insert variables by dragging bank cards. / **拖拽插入**：直接将词库卡片拖入编辑区域即可快速插入。
*   **Preview Mode**: Templates render variables as clickable dropdowns. / **预览模式**：模版中的变量自动渲染为可点击的下拉菜单。
*   **Multi-Instance**: Multiple occurrences of the same variable work independently. / **独立实例**：同一变量在模版中出现多次时可分别选择不同值。

### 💾 Auto Persistence / 自动持久化
*   Changes are automatically saved to LocalStorage. / 利用 LocalStorage 自动保存所有修改。
*   No data loss on refresh or browser close. / 刷新页面或关闭浏览器后数据不会丢失。

### 🖼️ Image Management / 图像管理
*   **Preview Images**: Templates support associated preview images. / **预览图展示**：每个模版支持关联预览图。
*   **Custom Upload**: Replace default previews with your own images. / **自定义上传**：支持上传自定义图片替换默认预览图。
*   **Image Actions**: Hover for large view, upload, or reset. / **图片操作**：悬停显示操作按钮：查看大图、上传、重置。
*   **Ambient Background**: Blurry background effect at the top. / **装饰背景**：预览图作为模糊背景显示在模版顶部。

### 📋 Export & Share / 导出与分享
*   **One-click Copy**: Copy clean generated prompt text. / **一键复制**：复制最终生成的纯净 Prompt 文本。
*   **Save Long Image**: Export HD JPGs for archiving and sharing. / **保存长图**：将填好的模版导出为高清图片，方便分享。

---

## 🛠️ Tech Stack / 技术栈

*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Frontend**: [React](https://react.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Export**: [html2canvas](https://html2canvas.hertzen.com/)

---

## 🚀 Quick Start / 快速开始

### Prerequisites / 前置要求
Node.js v18+ is recommended. / 推荐使用 Node.js v18+。

### Installation / 安装与运行

1.  **Clone / 克隆项目**
    ```bash
    git clone https://github.com/TanShilongMario/PromptFill.git
    cd PromptFill
    ```
2.  **Install / 安装依赖**
    ```bash
    npm install
    ```
3.  **Dev / 启动开发服务器**
    ```bash
    npm run dev
    ```
4.  **Build / 构建生产版本**
    ```bash
    npm run build
    ```

### Shortcut Scripts / 快捷启动脚本
*   **macOS**: `start.command`
*   **Windows**: `start.bat`

---

## 📖 Usage Guide / 使用指南

### 1. Manage Categories / 管理分类
Manage categories and colors at the top of the left panel. Each category has a unique color for quick identification. / 点击左侧面板顶部的"管理分类"，添加或修改分类及其颜色。

### 2. Create Banks / 创建词库
Create "Variable Groups" and add options (single or batch). Cards can be dragged into the editor. / 点击"创建新变量组"添加词库，支持单条或批量添加选项。

### 3. Edit Templates / 编辑模版
Use "Edit Template" to enter visual mode. Supports drag-and-drop insertion, manual `{{variable}}` input, and Undo/Redo. / 点击"编辑模版"进入可视化编辑模式，支持拖拽插入或手动输入变量。

### 4. Preview & Generate / 预览与生成
Switch to "Preview Interaction". Select options from dropdowns. Use "+ Add Custom Option" to save new values directly. / 切换回"预览交互"模式，点击变量选择选项，支持直接添加新选项到词库。

### 5. Manage Images / 管理模版图片
Hover over preview images to view large versions, upload custom images, or reset to default. / 悬停在预览图上可查看大图、上传自定义图或重置默认图。

### 6. Export & Share / 导出与分享
Copy the final prompt or save as a long image. JSON Import/Export is available for backup. / 复制生成的结果或保存为长图。支持 JSON 导入/导出。

---

## 💡 Tips / 使用技巧

1.  **Batch Creation**: Input multiple lines to add multiple options at once. / **批量创建**：添加选项时可一次输入多行。
2.  **Clone Templates**: Duplicate templates for A/B testing. / **模版副本**：使用副本功能进行对比测试。
3.  **Color Coding**: Use distinct colors for complex template structures. / **颜色编码**：为不同变量设色使结构清晰。
4.  **Multi-Instance**: Multiple same variables are assigned unique indices (e.g., `color-0`). / **多实例**：同名变量会自动分配独立索引。
5.  **Custom Previews**: Uploading representative images helps identification. / **自定义预览**：上传参考图有助于快速识别。
6.  **Image Specs**: Square or vertical images around 300px are recommended. / **图片建议**：推荐 300px 左右的正方形或竖图。
7.  **Data Safety**: Regularly export JSON as data is local to the browser. / **数据安全**：所有数据存储在本地，建议定期导出备份。
8.  **Tags & Search**: Use tags to filter and locate templates quickly. / **标签化检索**：通过标签快速定位模版。
9.  **Masonry View**: Efficiently browse covers in the template list. / **瀑布流浏览**：多张封面浏览更高效。
10. **Import/Export (Beta)**: Backup or share via one-click JSON export. / **导入/导出**：一键备份或共享 JSON。
11. **Multi-source Upload**: Supports local files and URLs for images. / **多源上传**：支持本地文件与图片 URL。
12. **Local Focus**: Sync across devices manually using JSON files. / **本地化存储**：跨设备同步请配合导入/导出。

---

## 🗺️ Roadmap / 路线图

*   **🚀 Application / 产品应用化**: Native iOS app & Desktop version (Electron/Tauri). / iOS 原生应用与桌面端软件。
*   **🤝 Ecosystem / 模版生态**: One-click sharing and online community. / 模版一键分享与在线社区。
*   **🤖 AI Empowerment / AI 智能**: AI bank expansion & AI prompt reorganization. / AI 词库扩充与 AI 提示词重组优化。
*   **✨ Deep UX / 深度优化**: More built-in templates & infinite hierarchy. / 更多高质量模版与无限层级组织。

---

## 📝 Change Log / 更新日志

### Version 0.6.1 (2025-12-26)
*   **🔗 Linkage Group Bug Fix**: Fixed loose matching bug in linkage groups. / **联动组逻辑修复**：修复了联动组匹配过于宽松的 Bug。
*   **🆙 Version Alignment**: Synchronized version identifiers site-wide. / **全站版本号对齐**：同步升级了各处的版本号标识。
*   **🎨 UI Refinement**: Optimized contrast and feedback in dark mode. / **UI 细节微调**：优化了暗色模式下的 UI 交互。

### Version 0.6.0 (2025-12-25)
*   **🎨 UI Upgrade & Dark Mode**: Full dark theme support for desktop/mobile and Xmas theme. / **UI 全面升级与暗色模式**：支持全站暗色模式及圣诞限定彩蛋。
*   **🔗 Linkage Groups**: Synchronized variable modifications within groups. / **词组联动功能上线**：支持在同一组内的变量同步更新。
*   **📱 Mobile Depth Optimization**: Better dark mode adaptation and icon contrast. / **移动端深度优化**：设置页适配及图标美化。
*   **🐞 Bug Fixes**: Improved export stability and storage reliability. / **Bug 修复与体验提升**：导出稳定性与存储写入优化。

### Version 0.5.1 (2025-12-22)
*   **📱 Mobile Interaction**: Immersive details, drawer menus, and 3D gyroscope effects. / **移动端交互大革新**：沉浸式详情页、侧滑抽屉及陀螺仪 3D 效果。
*   **⚡ Performance**: High-performance Mesh Gradient background and 60FPS scrolling. / **性能与稳定性优化**：Mesh Gradient 背景与平滑滚动逻辑。
*   **🛠️ Data Merging**: Smooth upgrade mechanism for user data migration. / **智能数据合并**：优化了数据迁移逻辑，支持平滑升级。

### Version 0.5.0 (2025-12-20)
*   **🏗️ Architecture**: Decoupled components and significant performance improvements. / **深度架构重构**：组件化解耦及性能飞跃。
*   **🎨 New UX**: New Discovery View with masonry layout and floating toolbar. / **全新交互体验**：独立发现页与抽屉式悬浮。
*   **📸 Enhanced Export**: Wider long images (860px) and improved variable styles. / **导出功能增强**：宽度优化与文字美化。
*   **🔔 Sync Awareness**: App/Template version checking and cloud sync notifications. / **模版更新感知**：双重版本校验与实时同步。

### Version 0.4.1 (2025-12-12)
*   **Export Optimization**: JPG format (smaller size), blurry background, and cleaner layout. / **导出功能优化**：JPG 格式、模糊背景及布局重构。
*   **Mobile Experience**: Toast notifications instead of alerts and detailed backup info. / **移动端体验提升**：Toast 通知及导入进度反馈。

### Version 0.4.0 (2025-12-10)
*   **Features**: Masonry display, tag filtering, and Base64 pre-fetching for exports. / **功能更新**：瀑布流展示、标签过滤及导出优化。
*   **New Content**: New high-quality templates and expanded banks. / **新模版/词库**：新增多个高分模版及配套词库。

### Version 0.3.0 (2025-12-08)
*   **UI & Docs**: Premium button design and structured usage guide. / **UI 优化与文档完善**：统一设计语言及重构指南。
*   **Image Management**: Custom preview uploads and Lightbox support. / **图像管理功能**：支持自定义预览图上传及全屏预览。

### Version 0.2.0
*   Long image export, custom category colors, and responsive layout fixes. / 增加导出长图、颜色配置及布局优化。

### Version 0.1.0
*   Initial release: basic template/bank management and interaction system. / 初始版本发布。

---

## 🤝 Contribution / 贡献
Issues and Pull Requests are welcome! / 欢迎提交 Issue 或 Pull Request 来改进这个项目！

## 📄 License / 许可证
MIT License / [MIT 许可证](LICENSE).

---
**Made with ❤️ by 角落工作室**
