import React, { useState, useRef, useEffect } from 'react';
import { Copy, Plus, X, Settings, Check, Edit3, Eye, Trash2, FileText, Pencil, Copy as CopyIcon, Globe, ChevronDown, ChevronUp, GripVertical, Download, Image as ImageIcon, List } from 'lucide-react';
import html2canvas from 'html2canvas';

// --- 翻译配置 (Translations) ---
const TRANSLATIONS = {
  cn: {
    template_management: "模版管理",
    template_subtitle: "切换或管理不同 Prompt",
    new_template: "新建模版",
    bank_config: "词库配置",
    bank_subtitle: "所有模版共享同一套词库",
    preview_mode: "预览交互",
    edit_mode: "编辑模版",
    copy_result: "复制结果",
    export_image: "保存长图",
    copied: "已复制",
    insert: "插入",
    add_option_placeholder: "新增选项...",
    add_bank_group: "创建新变量组",
    add_bank_title: "新增变量分类",
    label_name: "显示名称 (Label)",
    label_placeholder: "例如: 武器类型",
    id_name: "唯一标识 (ID)",
    id_placeholder: "例如: weapon",
    confirm_add: "确认添加",
    cancel: "取消",
    preview_status: "预览与交互模式",
    editing_status: "正在编辑模版结构...",
    rename: "重命名",
    duplicate: "创建副本",
    delete: "删除",
    select: "选择",
    no_options: "暂无选项，请在左侧添加",
    please_select: "请选择...",
    undefined_var: "未定义变量",
    alert_id_exists: "该 ID 已存在！",
    alert_keep_one: "至少需要保留一个模版",
    confirm_delete_template: "确定要删除这个模版吗？操作无法撤销。",
    confirm_delete_bank: "确定要删除“{{name}}”整个词库吗？",
    new_template_name: "新模版",
    new_template_content: "### 新模版\n\n开始编辑你的内容，使用 {{variable}} 插入变量。",
    copy_suffix: " (副本)",
    add_custom_option: "添加自定义选项",
    confirm: "确定",
    category_label: "分类 (Category)",
    category_character: "人物 (Character)",
    category_item: "物品 (Item)",
    category_action: "动作 (Action)",
    category_location: "地点 (Location)",
    category_visual: "画面 (Visuals)",
    category_other: "其他 (Other)",
    manage_categories: "管理分类",
    add_category: "新增分类",
    category_name_placeholder: "分类名称",
    delete_category_confirm: "确定要删除分类“{{name}}”吗？该分类下的词库将归为“其他”。",
    edit_category: "编辑分类"
  },
  en: {
    template_management: "Templates",
    template_subtitle: "Manage your Prompts",
    new_template: "New Template",
    bank_config: "Word Banks",
    bank_subtitle: "Shared across all templates",
    preview_mode: "Preview",
    edit_mode: "Edit",
    copy_result: "Copy Result",
    export_image: "Save Image",
    copied: "Copied",
    insert: "Insert",
    add_option_placeholder: "Add option...",
    add_bank_group: "New Variable Group",
    add_bank_title: "Add Variable Category",
    label_name: "Display Name",
    label_placeholder: "e.g. Weapon Type",
    id_name: "Unique ID",
    id_placeholder: "e.g. weapon",
    confirm_add: "Confirm",
    cancel: "Cancel",
    preview_status: "Preview & Interactive Mode",
    editing_status: "Editing Template Structure...",
    rename: "Rename",
    duplicate: "Duplicate",
    delete: "Delete",
    select: "Select",
    no_options: "No options, add from left",
    please_select: "Select...",
    undefined_var: "Undefined",
    alert_id_exists: "ID already exists!",
    alert_keep_one: "Keep at least one template",
    confirm_delete_template: "Delete this template? Cannot be undone.",
    confirm_delete_bank: "Delete the entire bank “{{name}}”?",
    new_template_name: "New Template",
    new_template_content: "### New Template\n\nStart editing content. Use {{variable}} to insert variables.",
    copy_suffix: " (Copy)",
    add_custom_option: "Add Custom Option",
    confirm: "Confirm",
    category_label: "Category",
    category_character: "Character",
    category_item: "Item",
    category_action: "Action",
    category_location: "Location",
    category_visual: "Visuals",
    category_other: "Other",
    manage_categories: "Manage Categories",
    add_category: "Add Category",
    category_name_placeholder: "Category Name",
    delete_category_confirm: "Delete category “{{name}}”? Banks will be moved to 'Other'.",
    edit_category: "Edit Category"
  }
};

const INITIAL_CATEGORIES = {
  character: { id: "character", label: "人物 (CHARACTER)", color: "blue" },
  item: { id: "item", label: "物品 (ITEM)", color: "amber" },
  action: { id: "action", label: "动作 (ACTION)", color: "rose" },
  location: { id: "location", label: "地点 (LOCATION)", color: "emerald" },
  visual: { id: "visual", label: "画面 (VISUALS)", color: "violet" },
  other: { id: "other", label: "其他 (OTHER)", color: "slate" }
};

const CATEGORY_STYLES = {
  blue: {
    text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200",
    hoverBg: "hover:bg-blue-100", hoverBorder: "hover:border-blue-300",
    ring: "ring-blue-300", bgActive: "bg-blue-100",
    badgeText: "text-blue-700", badgeBg: "bg-blue-100",
    dotBg: "bg-blue-500", btnBg: "bg-blue-600",
    inputRing: "focus:ring-blue-200", inputBorder: "focus:border-blue-500"
  },
  amber: {
    text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200",
    hoverBg: "hover:bg-amber-100", hoverBorder: "hover:border-amber-300",
    ring: "ring-amber-300", bgActive: "bg-amber-100",
    badgeText: "text-amber-700", badgeBg: "bg-amber-100",
    dotBg: "bg-amber-500", btnBg: "bg-amber-600",
    inputRing: "focus:ring-amber-200", inputBorder: "focus:border-amber-500"
  },
  rose: {
    text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200",
    hoverBg: "hover:bg-rose-100", hoverBorder: "hover:border-rose-300",
    ring: "ring-rose-300", bgActive: "bg-rose-100",
    badgeText: "text-rose-700", badgeBg: "bg-rose-100",
    dotBg: "bg-rose-500", btnBg: "bg-rose-600",
    inputRing: "focus:ring-rose-200", inputBorder: "focus:border-rose-500"
  },
  emerald: {
    text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200",
    hoverBg: "hover:bg-emerald-100", hoverBorder: "hover:border-emerald-300",
    ring: "ring-emerald-300", bgActive: "bg-emerald-100",
    badgeText: "text-emerald-700", badgeBg: "bg-emerald-100",
    dotBg: "bg-emerald-500", btnBg: "bg-emerald-600",
    inputRing: "focus:ring-emerald-200", inputBorder: "focus:border-emerald-500"
  },
  violet: {
    text: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200",
    hoverBg: "hover:bg-violet-100", hoverBorder: "hover:border-violet-300",
    ring: "ring-violet-300", bgActive: "bg-violet-100",
    badgeText: "text-violet-700", badgeBg: "bg-violet-100",
    dotBg: "bg-violet-500", btnBg: "bg-violet-600",
    inputRing: "focus:ring-violet-200", inputBorder: "focus:border-violet-500"
  },
  slate: {
    text: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200",
    hoverBg: "hover:bg-slate-100", hoverBorder: "hover:border-slate-300",
    ring: "ring-slate-300", bgActive: "bg-slate-100",
    badgeText: "text-slate-700", badgeBg: "bg-slate-100",
    dotBg: "bg-slate-500", btnBg: "bg-slate-600",
    inputRing: "focus:ring-slate-200", inputBorder: "focus:border-slate-500"
  }
};



// --- 初始数据配置 (Updated with new banks for examples) ---

const INITIAL_BANKS = {
  role: {
    label: "角色身份",
    category: "character",
    options: ["游戏与动漫概念美术设计大师", "资深影视角色原画师", "赛博朋克风格设计师", "暗黑幻想风格插画师"]
  },
  subject: {
    label: "主体对象",
    category: "character",
    options: ["女性角色", "男性角色", "机甲少女", "怪物拟人化", "奇幻种族(精灵/恶魔)"]
  },
  layout_focus: {
    label: "构图重心",
    category: "visual",
    options: ["全身立绘", "半身肖像", "动态战斗姿势", "背影回眸"]
  },
  // Example 1 related
  camera_angle: {
    label: "拍摄角度",
    category: "visual",
    options: ["脸颊和颈部特写", "目光锁定镜头", "单色下巴托手肖像", "透过模糊的肩带拍摄", "正面特写，面部阴影交错", "斜角拍摄的原始人像", "双手置于锁骨附近的特写", "坐姿半身侧面照", "侧面微距照"]
  },
  connectors: {
    label: "视觉引导",
    category: "visual",
    options: ["手绘箭头或引导线", "虚线连接", "彩色光束", "半透明数据线"]
  },
  underwear_style: {
    label: "私密内着拆解",
    category: "item",
    options: ["成套的蕾丝内衣裤", "运动风格纯棉内衣", "极简主义丝绸内衣", "哥特风格绑带内衣"]
  },
  expressions: {
    label: "表情集",
    category: "character",
    options: ["疯狂、病娇、狂喜", "羞涩、躲闪、红晕", "冷漠、鄙视、高傲", "痛苦、忍耐、咬唇"]
  },
  texture_zoom: {
    label: "材质特写",
    category: "visual",
    options: ["凌乱感与私处汗渍", "皮肤上的勒痕与红印", "丝袜的抽丝细节", "皮革的光泽与磨损"]
  },
  action_detail: {
    label: "动作细节",
    category: "action",
    options: ["带着项圈的爬行", "双手被缚在身后的挣扎", "跪姿并展示鞋底", "拉扯领口的诱惑"]
  },
  special_view: {
    label: "特殊视角",
    category: "visual",
    options: ["被踩在脚下的仰视视角", "从门缝中偷窥的视角", "镜子反射的背影", "监控摄像头的俯视视角"]
  },
  bag_content: {
    label: "随身包袋",
    category: "item",
    options: ["日常通勤包或手拿包", "战术腿包", "可爱的毛绒背包", "透明材质的痛包"]
  },
  cosmetics: {
    label: "美妆与护理",
    category: "item",
    options: ["常用的化妆品组合", "散落的口红与粉饼", "便携式补妆镜", "香水小样与护手霜"]
  },
  private_items: {
    label: "私密生活物件",
    category: "item",
    options: ["震动棒与项圈", "手铐与眼罩", "鞭子与蜡烛", "润滑液与安全套"]
  },
  art_style: {
    label: "画风",
    category: "visual",
    options: ["高质量的 2D 插画风格", "写实厚涂风格", "赛博朋克霓虹风格", "水彩手绘风格"]
  },
  background_style: {
    label: "背景风格",
    category: "visual",
    options: ["漫画网格笔记本", "蓝图设计稿纸", "工业风金属背景", "极简纯色背景"]
  },
  // Old ones preserved for compatibility or other templates
  lens_param: {
    label: "镜头参数",
    category: "visual",
    options: ["85mm, f/1.8", "85mm, f/2.0", "50mm, f/2.2", "50mm, f/2.5", "50mm, f/3.2", "35mm, f/4.5", "85mm, f/1.9"]
  },
  lighting: {
    label: "灯光布置",
    category: "visual",
    options: ["大型顶置柔光箱，轻微侧向反射光", "自然窗光", "伦勃朗光", "赛博朋克霓虹光", "影棚硬光"]
  },
  sticker_core: {
    label: "核心贴纸",
    category: "item",
    options: ["用户穿着甜美约会装的照片", "复古摇滚乐队T恤穿搭", "日系JK制服穿搭", "极简职场通勤装"]
  },
  sticker_decor: {
    label: "装饰元素",
    category: "item",
    options: ["手绘爱心、闪光符号", "星星、月亮贴纸", "复古邮票与票据", "赛博故障风Glitch元素"]
  },
  action_pose: {
    label: "互动姿势",
    category: "action",
    options: ["用手指在男人脑后比划'兔耳朵'", "勾肩搭背比V字手势", "互相指着对方大笑", "背靠背酷炫站姿"]
  },
  background_scene: {
    label: "背景场景",
    category: "location",
    options: ["俯瞰纽约市的复仇者大厦楼顶", "废弃的工业仓库", "熙熙攘攘的时代广场", "外太空飞船内部"]
  }
};

const INITIAL_DEFAULTS = {
  role: "游戏与动漫概念美术设计大师",
  subject: "女性角色",
  layout_focus: "全身立绘",
  camera_angle: "脸颊和颈部特写",
  connectors: "手绘箭头或引导线",
  underwear_style: "成套的蕾丝内衣裤",
  expressions: "疯狂、病娇、狂喜",
  texture_zoom: "凌乱感与私处汗渍",
  action_detail: "带着项圈的爬行",
  special_view: "被踩在脚下的仰视视角",
  bag_content: "日常通勤包或手拿包",
  cosmetics: "常用的化妆品组合",
  private_items: "震动棒与项圈",
  art_style: "高质量的 2D 插画风格",
  background_style: "漫画网格笔记本",
  
  // Legacy defaults
  lens_param: "85mm, f/1.8",
  lighting: "大型顶置柔光箱，轻微侧向反射光",
  sticker_core: "用户穿着甜美约会装的照片",
  sticker_decor: "手绘爱心、闪光符号",
  action_pose: "用手指在男人脑后比划'兔耳朵'",
  background_scene: "俯瞰纽约市的复仇者大厦楼顶"
};

const DEFAULT_TEMPLATE_CONTENT = `### Role (角色设定)
你是一位顶尖的 {{role}}，擅长制作详尽的角色设定图（Character Sheet）。你具备“像素级拆解”的能力，能够透视角色的穿着层级、捕捉微表情变化，并将与其相关的物品进行具象化还原。你特别擅长通过 {{subject}} 的私密物品、随身物件和生活细节来侧面丰满人物性格与背景故事。

### Task (任务目标)
根据用户上传或描述的主体形象，生成一张**“全景式角色深度概念分解图”**。该图片必须包含 {{layout_focus}}，并在其周围环绕展示该人物的服装分层、不同表情、核心道具、材质特写，以及极具生活气息的私密与随身物品展示。

### Visual Guidelines (视觉规范)
**1. 构图布局 (Layout):**
- **中心位 (Center):** 放置角色的 {{layout_focus}}，作为视觉锚点。
- **环绕位 (Surroundings):** 在中心人物四周空白处，有序排列拆解后的元素。
- **视觉引导 (Connectors):** 使用{{connectors}}，将周边的拆解物品与中心人物的对应部位或所属区域连接起来。

**2. 拆解内容 (Deconstruction Details):**
- **服装分层 (Clothing Layers):** 将角色的服装拆分为单品展示
- **私密内着拆解:** 独立展示角色的内层衣物，重点突出设计感与材质。例如： {{underwear_style}} （展示细节与剪裁）。
- **表情集 (Expression Sheet):** 在角落绘制 3-4 个不同的头部特写，展示不同的情绪，如： {{expressions}} 。
- **材质特写 (Texture & Zoom):** 选取关键部位进行放大特写。例如： {{texture_zoom}} ，增加对小物件材质的描绘。
- **动作:** 绘制特殊的动作和表情，例如：{{action_detail}}，增加动作的深度刻画。
- **特殊视角:** 绘制从某种特殊场景下拍摄的特殊视角，例如：{{special_view}}

- **关联物品 (Related Items):**
 - **随身包袋与内容物:** 绘制 {{bag_content}}，并将其“打开”，展示散落在旁的物品。
 - **美妆与护理:** 展示 {{cosmetics}}。
 - **私密生活物件:** 具象化角色隐藏面的物品。根据角色性格可能包括： {{private_items}}，需以一种设计图的客观视角呈现。

**3. 风格与注释 (Style & Annotations):**
- **画风:** {{art_style}}，线条干净利落。
- **背景:** {{background_style}}，营造设计手稿的氛围。
- **文字说明:** 在每个拆解元素旁模拟手写注释，简要说明材质或品牌/型号暗示。

### Workflow (执行逻辑)
1. 分析主体的核心特征、穿着风格及潜在性格。
2. 提取可拆解的一级元素（外套、鞋子、大表情）。
3. 脑补并设计二级深度元素（她内衣穿什么风格？包里装什么？独处时用什么？）。
4. 生成一张包含所有这些元素的组合图，确保透视准确，光影统一，注释清晰。
5. 使用中文，高清输出。`;

const TEMPLATE_PHOTO_GRID = `### Photo Grid Composition (九宫格摄影)
编辑场景，3x3网格布局，冷灰色无缝背景。人物（面部特征与上传图片完全一致）身穿炭灰色无袖连衣裙。

**灯光设置:** {{lighting}}。

**照片细节包括：**
1. {{camera_angle}}，前景手指虚化 ({{lens_param}})；
2. 目光锁定镜头，可见顶部反光 ({{lens_param}})；
3. 单色下巴托手肖像，画面填充强烈 ({{lens_param}})；
4. 透过模糊的肩带拍摄的半遮肩照 ({{lens_param}})；
5. 正面特写，面部阴影交错 ({{lens_param}})；
6. 斜角拍摄的原始人像，头发蓬乱 ({{lens_param}})；
7. 双手置于锁骨附近的特写 ({{lens_param}})；
8. 坐姿半身侧面照，画面边缘虚化 ({{lens_param}})；
9. 侧面微距照，单颗水滴高光 ({{lens_param}})。

**后期处理:** 原始素材，平滑对比度，编辑柔化效果。`;

const TEMPLATE_FASHION_MOODBOARD = `### Fashion Illustration Moodboard (时尚插画情绪板)
一张9:16竖屏的高级时尚插画情绪板，模拟平板扫描效果。

**背景:** 纯手绘的奶油色水彩晕染纸张，带有淡淡的粉色网格。
**视觉核心:** 数张具有明显白色模切宽边和柔和投影的亮面乙烯基贴纸。

**贴纸内容:**
- **中央:** {{sticker_core}}，光线明亮。
- **左侧:** 对这套穿搭的解构贴纸，整齐折叠的外套和精致的高跟鞋。
- **右下角:** 关键的隐藏层贴纸：一套折叠整齐的高级白色蕾丝内衣，展现细腻纹理。
- **互动元素:** 一只穿着粉色系、与用户服装呼应的Labubu艺术公仔贴纸正趴在一个手绘对话框上。

**装饰细节:** 周围装饰着蜡笔质感的 {{sticker_decor}} 和潦草的中文书法标注OOTD。
**注意:** 画面中绝无任何人手、笔或物理桌面背景，纯粹的平面艺术插画。`;

const TEMPLATE_FUN_SELFIE = `### Fun Selfie with Deadpool (死侍合影)
让死侍站在男人旁边，{{action_pose}}，同时对着镜头露出调皮的表情。

**背景:** 以 {{background_scene}} 为背景。

**要求:** 保持自拍构图不变，让两个角色自然地融入画面，光影统一，互动自然。`;

const INITIAL_TEMPLATES = [
  {
    id: "tpl_default",
    name: "角色概念分解图",
    content: DEFAULT_TEMPLATE_CONTENT,
    selections: {}
  },
  {
    id: "tpl_photo_grid",
    name: "3x3 摄影网格",
    content: TEMPLATE_PHOTO_GRID,
    selections: {}
  },
  {
    id: "tpl_fashion",
    name: "时尚情绪板插画",
    content: TEMPLATE_FASHION_MOODBOARD,
    selections: {}
  },
  {
    id: "tpl_deadpool",
    name: "死侍趣味合影",
    content: TEMPLATE_FUN_SELFIE,
    selections: {}
  }
];

// --- 持久化存储 Hook ---
const useStickyState = (defaultValue, key) => {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};


// --- 组件：可点击的变量词 ---
const Variable = ({ id, index, config, currentVal, isOpen, onToggle, onSelect, onAddCustom, popoverRef, t }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [customVal, setCustomVal] = useState("");

  // Determine styles based on category
  const categoryId = config?.category || 'other';
  const colorKey = CATEGORIES[categoryId]?.color || 'slate';
  const style = CATEGORY_STYLES[colorKey];

  // Reset state when popover closes
  useEffect(() => {
    if (!isOpen) {
        setIsAdding(false);
        setCustomVal("");
    }
  }, [isOpen]);

  if (!config) return <span className="text-red-400 bg-red-50 px-1 rounded border border-red-200 text-xs" title={`${t('undefined_var')}: ${id}`}>[{id}?]</span>;

  const handleAddSubmit = () => {
      if (customVal.trim()) {
          onAddCustom(customVal.trim());
          setCustomVal("");
          setIsAdding(false);
      }
  };

  return (
    <div className="relative inline-block mx-1 align-baseline group text-base">
      <span 
        onClick={onToggle}
        className={`
          cursor-pointer px-2 py-0.5 rounded-md border transition-all duration-200 select-none font-medium
          ${style.text} ${style.bg} ${style.border}
          ${style.hoverBg} ${style.hoverBorder}
          ${isOpen ? `ring-2 ${style.ring} ${style.bgActive}` : ''}
        `}
      >
        {currentVal || <span className={`${style.text} opacity-50 italic`}>{t('please_select')}</span>}
      </span>
      
      {/* Popover - 词库选择器 */}
      {isOpen && (
        <div 
          ref={popoverRef}
          className="absolute left-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden flex flex-col text-left"
          style={{ minWidth: '280px' }}
        >
          <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider flex justify-between items-center">
            <span>{t('select')} {config.label} ({index + 1})</span>
             <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${style.badgeBg} ${style.badgeText} font-medium`}>
                {t(CATEGORIES[categoryId].t_key)}
            </span>
          </div>
          <div className="max-h-60 overflow-y-auto p-2 space-y-1">
            {config.options.length > 0 ? config.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(opt)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  currentVal === opt 
                    ? `${style.bgActive} ${style.text} font-medium` 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                {opt}
              </button>
            )) : (
              <div className="px-3 py-4 text-center text-gray-400 text-sm">
                {t('no_options')}
              </div>
            )}
          </div>
          
           {/* Add Custom Option Footer */}
           <div className="p-2 border-t border-gray-100 bg-gray-50">
             {isAdding ? (
                 <div className="flex gap-2">
                     <input 
                        autoFocus
                        type="text"
                        value={customVal}
                        onChange={(e) => setCustomVal(e.target.value)}
                        placeholder={t('add_option_placeholder')}
                        className={`flex-1 min-w-0 px-2 py-1 text-sm border border-gray-300 rounded ${style.inputBorder} outline-none`}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSubmit()}
                     />
                     <button 
                        onClick={handleAddSubmit}
                        disabled={!customVal.trim()}
                        className={`px-2 py-1 ${style.btnBg} text-white rounded text-xs font-medium hover:opacity-90 disabled:opacity-50`}
                     >
                        {t('confirm')}
                     </button>
                 </div>
             ) : (
                 <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsAdding(true);
                    }}
                    className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs ${style.text} ${style.bg} hover:${style.bgActive} rounded border ${style.border} transition-colors font-medium dashed`}
                 >
                    <Plus size={12} /> {t('add_custom_option')}
                 </button>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Visual Editor Component (New) ---
const VisualEditor = React.forwardRef(({ value, onChange, banks, categories }, ref) => {
  const preRef = useRef(null);

  const handleScroll = (e) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const renderHighlights = (text) => {
    // Split by {{...}}
    const parts = text.split(/(\{\{[^{}\n]+\}\})/g);
    return parts.map((part, i) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
         const key = part.slice(2, -2).trim();
         const bank = banks[key];
         const categoryId = bank?.category || 'other';
         const colorKey = categories[categoryId]?.color || 'slate';
         const style = CATEGORY_STYLES[colorKey];
         
         // Style needs to match font metrics exactly, so avoid padding/border that adds width
         return (
            <span key={i} className={`${style.bg} ${style.text} font-bold rounded-sm border-b-2 ${style.border}`}>
               {part}
            </span>
         );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-50">
      {/* Backdrop */}
      <pre
        ref={preRef}
        className="absolute inset-0 p-8 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words pointer-events-none text-gray-800 overflow-hidden m-0"
        style={{ fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }} 
        aria-hidden="true"
      >
        {renderHighlights(value)}
        <br />
      </pre>

      {/* Textarea */}
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        onScroll={handleScroll}
        className="absolute inset-0 w-full h-full p-8 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words bg-transparent text-transparent caret-gray-800 resize-none focus:outline-none overflow-auto z-10 m-0 selection:bg-indigo-200 selection:text-indigo-900"
        style={{ fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
        spellCheck={false}
      />
    </div>
  );
});

// --- 组件：可折叠的词库组 ---
const BankGroup = ({ bankKey, bank, onInsert, onDeleteOption, onAddOption, onDeleteBank, onUpdateBankCategory, categories, t }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isEditingCategory, setIsEditingCategory] = useState(false);

    const categoryId = bank.category || 'other';
    const colorKey = categories[categoryId]?.color || 'slate';
    const style = CATEGORY_STYLES[colorKey];

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', `{{${bankKey}}}`);
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <div 
            draggable="true"
            onDragStart={handleDragStart}
            className={`bg-white rounded-lg border ${style.border} relative group/card hover:shadow-sm transition-all overflow-hidden break-inside-avoid mb-3 cursor-grab active:cursor-grabbing`}
        >
            {/* Header / Collapsed View */}
            <div 
                className={`flex justify-between items-start p-3 cursor-pointer ${style.hoverBg} transition-colors`}
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div className="flex items-start gap-2 overflow-hidden flex-1 pr-2">
                    <div className="mt-0.5 flex-shrink-0">
                        {isCollapsed ? <ChevronDown size={16} className={style.text} /> : <ChevronUp size={16} className={style.text} />}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className={`text-sm font-bold ${style.text} truncate leading-tight`}>{bank.label}</span>
                        <code className="text-[10px] text-gray-400 truncate font-mono">{bankKey}</code>
                    </div>
                </div>
                <div className="flex gap-1 items-center">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onInsert(bankKey); }}
                        title={t('insert')}
                        className={`p-1 ${style.text} bg-white rounded border border-transparent hover:${style.border} transition-colors flex items-center gap-1`}
                    >
                        <Plus size={14} /> 
                        {!isCollapsed && <span className="text-xs font-medium">{t('insert')}</span>}
                    </button>
                    
                    {!isCollapsed && (
                        <>
                            <button 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setIsEditingCategory(!isEditingCategory); 
                                }}
                                title={t('category_label')}
                                className={`p-1 text-gray-400 hover:${style.text} rounded transition-colors opacity-0 group-hover/card:opacity-100`}
                            >
                                <Settings size={14} />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteBank(bankKey); }}
                                className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors opacity-0 group-hover/card:opacity-100"
                            >
                                <Trash2 size={14} />
                            </button>
                        </>
                    )}
                </div>
            </div>
            
            {/* Expanded Content */}
            {!isCollapsed && (
                <div className={`p-3 pt-0 border-t ${style.border} ${style.bg}`}>
                    
                    {/* Category Edit Mode */}
                    {isEditingCategory && (
                        <div className="mb-3 pt-3 pb-3 border-b border-gray-200/50">
                            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">{t('category_label')}</label>
                            <select 
                                value={categoryId}
                                onChange={(e) => {
                                    onUpdateBankCategory(bankKey, e.target.value);
                                    setIsEditingCategory(false);
                                }}
                                className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {Object.values(categories).map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex flex-col gap-2 mb-3 mt-3">
                        {bank.options.map((opt, idx) => (
                            <div key={idx} className="group flex items-center justify-between gap-1 bg-white border border-gray-200 px-2 py-1 rounded text-xs text-gray-600 shadow-sm overflow-hidden">
                                <span className="truncate" title={opt}>{opt}</span>
                                <button 
                                    onClick={() => onDeleteOption(bankKey, opt)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-opacity flex-shrink-0"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder={t('add_option_placeholder')}
                            className={`flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 ${style.inputRing} ${style.inputBorder}`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onAddOption(bankKey, e.target.value);
                                    e.target.value = '';
                                }
                            }}
                        />
                        <button 
                            className="p-1 bg-white border border-gray-200 text-gray-500 rounded hover:bg-gray-50"
                            onClick={(e) => {
                                const input = e.currentTarget.previousSibling;
                                onAddOption(bankKey, input.value);
                                input.value = '';
                            }}
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Modal: Category Manager ---
const CategoryManager = ({ isOpen, onClose, categories, setCategories, banks, setBanks, t }) => {
  const [newCatName, setNewCatName] = useState("");
  const [newCatColor, setNewCatColor] = useState("slate");
  const [editingCatId, setEditingCatId] = useState(null);
  const [tempCatName, setTempCatName] = useState("");
  
  const availableColors = Object.keys(CATEGORY_STYLES);

  if (!isOpen) return null;

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const newId = `cat_${Date.now()}`;
    
    setCategories(prev => ({
      ...prev,
      [newId]: { id: newId, label: newCatName, color: newCatColor }
    }));
    setNewCatName("");
    setNewCatColor("slate");
  };

  const handleDeleteCategory = (catId) => {
    if (catId === 'other') return; // Cannot delete default
    
    const catName = categories[catId].label;
    if (window.confirm(t('delete_category_confirm', { name: catName }))) {
       // 1. Update banks to use 'other'
       const updatedBanks = { ...banks };
       Object.keys(updatedBanks).forEach(key => {
           if (updatedBanks[key].category === catId) {
               updatedBanks[key].category = 'other';
           }
       });
       setBanks(updatedBanks);

       // 2. Remove category
       const updatedCats = { ...categories };
       delete updatedCats[catId];
       setCategories(updatedCats);
    }
  };

  const startEditing = (cat) => {
      setEditingCatId(cat.id);
      setTempCatName(cat.label);
  };

  const saveEditing = () => {
      if (!tempCatName.trim()) return;
      setCategories(prev => ({
          ...prev,
          [editingCatId]: { ...prev[editingCatId], label: tempCatName }
      }));
      setEditingCatId(null);
  };

  const changeColor = (catId, color) => {
      setCategories(prev => ({
          ...prev,
          [catId]: { ...prev[catId], color }
      }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <List size={18} /> {t('manage_categories')}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded text-gray-500"><X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
           {/* Add New */}
           <div className="flex gap-2 items-center mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input 
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder={t('category_name_placeholder')}
                className="flex-1 text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-indigo-500"
              />
              <select 
                value={newCatColor}
                onChange={(e) => setNewCatColor(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1.5 bg-white"
              >
                {availableColors.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button 
                onClick={handleAddCategory}
                disabled={!newCatName.trim()}
                className="p-1.5 bg-indigo-600 text-white rounded disabled:opacity-50 hover:bg-indigo-700"
              >
                <Plus size={16} />
              </button>
           </div>

           {/* List */}
           <div className="space-y-2">
             {Object.values(categories).map(cat => (
               <div key={cat.id} className="flex items-center gap-2 p-2 border border-gray-100 rounded bg-white hover:border-gray-200 transition-colors">
                  <div className={`w-3 h-3 rounded-full ${CATEGORY_STYLES[cat.color].dotBg}`}></div>
                  
                  {editingCatId === cat.id ? (
                      <input 
                        autoFocus
                        value={tempCatName}
                        onChange={(e) => setTempCatName(e.target.value)}
                        onBlur={saveEditing}
                        onKeyDown={(e) => e.key === 'Enter' && saveEditing()}
                        className="flex-1 text-sm border border-indigo-300 rounded px-1 py-0.5 outline-none"
                      />
                  ) : (
                      <span className="flex-1 text-sm font-medium text-gray-700 truncate">{cat.label}</span>
                  )}

                  <div className="flex items-center gap-1">
                      {/* Color Picker */}
                      <div className="relative group/color">
                          <div className={`w-5 h-5 rounded cursor-pointer border border-gray-200 ${CATEGORY_STYLES[cat.color].bg}`}></div>
                          <div className="absolute right-0 top-full mt-1 hidden group-hover/color:grid grid-cols-5 gap-1 p-2 bg-white border border-gray-200 shadow-lg rounded z-10 w-32">
                              {availableColors.map(c => (
                                  <div 
                                    key={c} 
                                    onClick={() => changeColor(cat.id, c)}
                                    className={`w-4 h-4 rounded-full cursor-pointer hover:scale-110 transition-transform ${CATEGORY_STYLES[c].dotBg}`}
                                    title={c}
                                  />
                              ))}
                          </div>
                      </div>

                      <button onClick={() => startEditing(cat)} className="p-1 text-gray-400 hover:text-indigo-600 rounded"><Pencil size={14}/></button>
                      {cat.id !== 'other' && (
                          <button onClick={() => handleDeleteCategory(cat.id)} className="p-1 text-gray-400 hover:text-red-500 rounded"><Trash2 size={14}/></button>
                      )}
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  // Global State with Persistence
  const [banks, setBanks] = useStickyState(INITIAL_BANKS, "app_banks_v4"); 
  const [defaults, setDefaults] = useStickyState(INITIAL_DEFAULTS, "app_defaults_v4");
  const [language, setLanguage] = useStickyState("cn", "app_language_v1"); 
  const [categories, setCategories] = useStickyState(INITIAL_CATEGORIES, "app_categories_v1"); // New state
  
  const [templates, setTemplates] = useStickyState(INITIAL_TEMPLATES, "app_templates_v4");
  const [activeTemplateId, setActiveTemplateId] = useStickyState("tpl_default", "app_active_template_id_v2");
  
  // UI State
  const [bankSidebarWidth, setBankSidebarWidth] = useStickyState(420, "app_bank_sidebar_width_v1"); // Default width increased to 420px for 2-column layout
  const [isResizing, setIsResizing] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [activePopover, setActivePopover] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false); // New UI state
  
  // Add Bank State
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [newBankLabel, setNewBankLabel] = useState("");
  const [newBankKey, setNewBankKey] = useState("");
  const [newBankCategory, setNewBankCategory] = useState("other");

  // Template Management UI State
  const [editingTemplateNameId, setEditingTemplateNameId] = useState(null);
  const [tempTemplateName, setTempTemplateName] = useState("");

  const popoverRef = useRef(null);
  const textareaRef = useRef(null);
  const sidebarRef = useRef(null);

  // Helper: Translate
  const t = (key, params = {}) => {
    let str = TRANSLATIONS[language][key] || key;
    Object.keys(params).forEach(k => {
        str = str.replace(`{{${k}}}`, params[k]);
    });
    return str;
  };

  // Fix initial categories if empty (migration safety)
  useEffect(() => {
      if (!categories || Object.keys(categories).length === 0) {
          setCategories(INITIAL_CATEGORIES);
      }
  }, []);

  // Derived State: Current Active Template
  const activeTemplate = templates.find(t => t.id === activeTemplateId) || templates[0];

  // --- Effects ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setActivePopover(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Resizing Logic
  useEffect(() => {
      const handleMouseMove = (e) => {
          if (!isResizing) return;
          // Calculate new width based on mouse position relative to sidebar start
          // Since sidebar starts after the 240px template sidebar
          const newWidth = e.clientX - 240; 
          if (newWidth > 280 && newWidth < 800) { // Min/Max constraints
              setBankSidebarWidth(newWidth);
          }
      };

      const handleMouseUp = () => {
          setIsResizing(false);
          document.body.style.cursor = 'default';
          document.body.style.userSelect = 'auto';
      };

      if (isResizing) {
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
          document.body.style.cursor = 'col-resize';
          document.body.style.userSelect = 'none'; // Prevent text selection while resizing
      }

      return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
      };
  }, [isResizing, setBankSidebarWidth]);

  const startResizing = () => {
      setIsResizing(true);
  };

  // --- Template Actions ---

  const handleAddTemplate = () => {
    const newId = `tpl_${Date.now()}`;
    const newTemplate = {
      id: newId,
      name: t('new_template_name'),
      content: t('new_template_content'),
      selections: {}
    };
    setTemplates([...templates, newTemplate]);
    setActiveTemplateId(newId);
    setIsEditing(true);
  };

  const handleDuplicateTemplate = (t_item, e) => {
      e.stopPropagation();
      const newId = `tpl_${Date.now()}`;
      const newTemplate = {
          ...t_item,
          id: newId,
          name: `${t_item.name}${t('copy_suffix')}`,
          selections: { ...t_item.selections }
      };
      setTemplates([...templates, newTemplate]);
      setActiveTemplateId(newId);
  };

  const handleDeleteTemplate = (id, e) => {
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
  };

  const startRenamingTemplate = (t, e) => {
    e.stopPropagation();
    setEditingTemplateNameId(t.id);
    setTempTemplateName(t.name);
  };

  const saveTemplateName = () => {
    if (tempTemplateName.trim()) {
      setTemplates(prev => prev.map(t => 
        t.id === editingTemplateNameId ? { ...t, name: tempTemplateName } : t
      ));
    }
    setEditingTemplateNameId(null);
  };

  const updateActiveTemplateContent = (newContent) => {
    setTemplates(prev => prev.map(t => 
      t.id === activeTemplateId ? { ...t, content: newContent } : t
    ));
  };

  const updateActiveTemplateSelection = (uniqueKey, value) => {
    setTemplates(prev => prev.map(t => {
      if (t.id === activeTemplateId) {
        return {
          ...t,
          selections: { ...t.selections, [uniqueKey]: value }
        };
      }
      return t;
    }));
  };

  // --- Bank Actions ---

  const handleSelect = (key, index, value) => {
    const uniqueKey = `${key}-${index}`;
    updateActiveTemplateSelection(uniqueKey, value);
    setActivePopover(null);
  };

  const handleAddCustomAndSelect = (key, index, newValue) => {
    if (!newValue || !newValue.trim()) return;
    
    // 1. Add to bank if not exists
    if (!banks[key].options.includes(newValue)) {
        handleAddOption(key, newValue);
    }
    
    // 2. Select it
    handleSelect(key, index, newValue);
  };

  const handleAddOption = (key, newOption) => {
    if (!newOption.trim()) return;
    setBanks(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        options: [...prev[key].options, newOption]
      }
    }));
  };

  const handleDeleteOption = (key, optionToDelete) => {
    setBanks(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        options: prev[key].options.filter(opt => opt !== optionToDelete)
      }
    }));
  };

  const handleAddBank = () => {
    if (!newBankLabel.trim() || !newBankKey.trim()) return;
    const safeKey = newBankKey.trim().replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
    
    if (banks[safeKey]) {
      alert(t('alert_id_exists'));
      return;
    }

    setBanks(prev => ({
      ...prev,
      [safeKey]: {
        label: newBankLabel,
        category: newBankCategory,
        options: []
      }
    }));
    setDefaults(prev => ({ ...prev, [safeKey]: "" }));
    setNewBankLabel("");
    setNewBankKey("");
    setNewBankCategory("other");
    setIsAddingBank(false);
  };

  const handleDeleteBank = (key) => {
    if (window.confirm(t('confirm_delete_bank', { name: banks[key].label }))) {
      const newBanks = { ...banks };
      delete newBanks[key];
      setBanks(newBanks);
    }
  };

  const handleUpdateBankCategory = (key, newCategory) => {
      setBanks(prev => ({
          ...prev,
          [key]: {
              ...prev[key],
              category: newCategory
          }
      }));
  };

  // --- Editor Actions ---

  const insertVariableToTemplate = (key) => {
    const textToInsert = ` {{${key}}} `;
    
    if (!isEditing) {
      setIsEditing(true);
      setTimeout(() => {
        updateActiveTemplateContent(activeTemplate.content + textToInsert);
        // Simple scroll to bottom hack
        if(textareaRef.current) textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }, 50);
      return;
    };

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = activeTemplate.content;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    
    updateActiveTemplateContent(`${before}${textToInsert}${after}`);
    
    setTimeout(() => {
      textarea.focus();
      const newPos = start + textToInsert.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleCopy = () => {
    let finalString = activeTemplate.content;
    const counters = {};

    finalString = finalString.replace(/{{(.*?)}}/g, (match, key) => {
        const k = key.trim();
        const idx = counters[k] || 0;
        counters[k] = idx + 1;

        const uniqueKey = `${k}-${idx}`;
        // Prioritize selection, then default
        return activeTemplate.selections[uniqueKey] || defaults[k] || match;
    });

    const cleanText = finalString
        .replace(/###\s/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\n\s*\n/g, '\n\n');

    navigator.clipboard.writeText(cleanText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const handleExportImage = async () => {
    const element = document.getElementById('preview-card');
    if (!element) return;

    setIsExporting(true);
    try {
        const canvas = await html2canvas(element, {
            scale: 2, // High resolution
            useCORS: true,
            backgroundColor: '#ffffff', // Ensure white background
            logging: false,
            onclone: (clonedDoc) => {
                // You can manipulate the cloned document here if needed (e.g. hide scrollbars)
                const clonedElement = clonedDoc.getElementById('preview-card');
                if (clonedElement) {
                   clonedElement.style.boxShadow = 'none'; // Optional: remove shadow for cleaner export
                   clonedElement.style.border = 'none';
                   
                   // Add Footer Watermark
                   const footer = clonedDoc.createElement('div');
                   footer.style.marginTop = '40px';
                   footer.style.paddingTop = '20px';
                   footer.style.borderTop = '1px solid #f3f4f6';
                   footer.style.textAlign = 'center';
                   footer.style.color = '#9ca3af';
                   footer.style.fontSize = '12px';
                   footer.style.fontFamily = 'sans-serif';
                   footer.innerText = '由“提示词填空器”制作生成，Made by 角落工作室';
                   
                   clonedElement.appendChild(footer);
                }
            }
        });

        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `${activeTemplate.name.replace(/\s+/g, '_')}_prompt.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        console.error("Export failed:", err);
        alert("Export failed. Please try again.");
    } finally {
        setIsExporting(false);
    }
  };

  // --- Renderers ---

  const renderTemplateContent = () => {
    const lines = activeTemplate.content.split('\n');
    const counters = {}; 

    return lines.map((line, lineIdx) => {
      if (!line.trim()) return <div key={lineIdx} className="h-4"></div>;

      let content = line;
      let Type = 'div';
      let className = "text-gray-700 mb-1";

      if (line.startsWith('### ')) {
        Type = 'h3';
        className = "text-lg font-bold text-gray-900 mt-6 mb-3 border-b border-gray-100 pb-2";
        content = line.replace('### ', '');
      } else if (line.trim().startsWith('- ')) {
        className = "ml-4 flex items-start gap-2 text-gray-700 mb-1";
        content = (
          <>
            <span className="text-gray-400 mt-1.5">•</span>
            <span className="flex-1">{parseLineWithVariables(line.replace('- ', '').trim(), lineIdx, counters)}</span>
          </>
        );
        return <div key={lineIdx} className={className}>{content}</div>;
      } else if (/^\d+\.\s/.test(line.trim())) {
         className = "ml-4 flex items-start gap-2 text-gray-700 mb-1";
         const number = line.trim().match(/^\d+\./)[0];
         const text = line.trim().replace(/^\d+\.\s/, '');
         content = (
            <>
              <span className="font-mono text-gray-400 mt-0.5 min-w-[20px]">{number}</span>
              <span className="flex-1">{parseLineWithVariables(text, lineIdx, counters)}</span>
            </>
         );
         return <div key={lineIdx} className={className}>{content}</div>;
      }

      if (typeof content === 'string') {
          return <Type key={lineIdx} className={className}>{parseLineWithVariables(content, lineIdx, counters)}</Type>;
      }
      return <Type key={lineIdx} className={className}>{content}</Type>;
    });
  };

  const parseLineWithVariables = (text, lineKeyPrefix, counters) => {
    const parts = text.split(/({{[^}]+}})/g);
    return parts.map((part, idx) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        const key = part.slice(2, -2).trim();
        const varIndex = counters[key] || 0;
        counters[key] = varIndex + 1;
        
        const uniqueKey = `${key}-${varIndex}`;
        const currentValue = activeTemplate.selections[uniqueKey] || defaults[key];

        return (
          <Variable 
            key={`${lineKeyPrefix}-${idx}`}
            id={key}
            index={varIndex}
            config={banks[key]}
            currentVal={currentValue}
            isOpen={activePopover === uniqueKey}
            onToggle={(e) => {
              e.stopPropagation();
              setActivePopover(activePopover === uniqueKey ? null : uniqueKey);
            }}
            onSelect={(opt) => handleSelect(key, varIndex, opt)}
            onAddCustom={(val) => handleAddCustomAndSelect(key, varIndex, val)}
            popoverRef={popoverRef}
            t={t}
          />
        );
      }
      
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((bp, bIdx) => {
        if (bp.startsWith('**') && bp.endsWith('**')) {
          return <strong key={`${lineKeyPrefix}-${idx}-${bIdx}`} className="text-gray-900">{bp.slice(2, -2)}</strong>;
        }
        return <span key={`${lineKeyPrefix}-${idx}-${bIdx}`}>{bp}</span>;
      });
    });
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-slate-800 overflow-hidden">
      
      {/* --- 1. Templates Sidebar (Far Left) --- */}
      <div className="w-[240px] bg-gray-900 flex flex-col border-r border-gray-800 z-20 flex-shrink-0">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-white">
              <FileText className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold">{t('template_management')}</h2>
            </div>
            {/* Language Toggle */}
            <button 
              onClick={() => setLanguage(language === 'cn' ? 'en' : 'cn')}
              className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded hover:text-white hover:bg-gray-700 transition-colors flex items-center gap-1"
            >
              <Globe size={12} />
              {language.toUpperCase()}
            </button>
          </div>
          <p className="text-xs text-gray-500">{t('template_subtitle')}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {templates.map(t_item => (
             <div 
               key={t_item.id}
               onClick={() => setActiveTemplateId(t_item.id)}
               className={`
                 group flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-all
                 ${activeTemplateId === t_item.id ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}
               `}
             >
               {editingTemplateNameId === t_item.id ? (
                 <input 
                   autoFocus
                   type="text"
                   value={tempTemplateName}
                   onChange={(e) => setTempTemplateName(e.target.value)}
                   onBlur={saveTemplateName}
                   onKeyDown={(e) => e.key === 'Enter' && saveTemplateName()}
                   className="bg-gray-700 text-white text-sm px-2 py-1 rounded w-full outline-none border border-indigo-400"
                   onClick={(e) => e.stopPropagation()}
                 />
               ) : (
                 <>
                   <div className="flex items-center gap-2 overflow-hidden flex-1">
                     <span className="truncate text-sm font-medium">{t_item.name}</span>
                   </div>
                   <div className="hidden group-hover:flex items-center gap-1">
                     <button 
                       title={t('rename')}
                       onClick={(e) => startRenamingTemplate(t_item, e)}
                       className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                     >
                       <Pencil size={12} />
                     </button>
                     <button 
                       title={t('duplicate')}
                       onClick={(e) => handleDuplicateTemplate(t_item, e)}
                       className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
                     >
                       <CopyIcon size={12} />
                     </button>
                     <button 
                       title={t('delete')}
                       onClick={(e) => handleDeleteTemplate(t_item.id, e)}
                       className="p-1 hover:bg-red-900/50 rounded text-gray-400 hover:text-red-400"
                     >
                       <Trash2 size={12} />
                     </button>
                   </div>
                 </>
               )}
             </div>
          ))}
        </div>

        <div className="p-3 border-t border-gray-800">
          <button 
            onClick={handleAddTemplate}
            className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-2 rounded transition-colors"
          >
            <Plus size={16} /> {t('new_template')}
          </button>
        </div>
      </div>

      {/* --- 2. Bank Sidebar (Middle Left) - UPDATED Resizable & Responsive Layout --- */}
      <div 
        ref={sidebarRef}
        className="bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-10 flex-shrink-0 relative"
        style={{ width: `${bankSidebarWidth}px` }}
      >
        {/* Resizer Handle */}
        <div 
            className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-indigo-400 transition-colors z-50 group flex items-center justify-center"
            onMouseDown={startResizing}
        >
             {/* Visual handle indicator on hover */}
            <div className="h-8 w-1 rounded-full bg-gray-300 group-hover:bg-indigo-200 transition-colors"></div>
        </div>

        <div className="p-5 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-bold text-gray-800">{t('bank_config')}</h2>
            </div>
            <button 
                onClick={() => setIsCategoryManagerOpen(true)}
                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                title={t('manage_categories')}
            >
                <List size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-500">{t('bank_subtitle')}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-20">
          <div 
            className="block"
            style={{ 
                columnWidth: '210px', 
                columnGap: '12px'
            }}
          >
            {/* Render grouped banks */}
            {Object.keys(categories).map(catId => {
                 const catBanks = Object.entries(banks).filter(([_, bank]) => (bank.category || 'other') === catId);
                 if (catBanks.length === 0) return null;
                 
                 const catConfig = categories[catId];
                 // Fallback for deleted categories still referenced
                 if (!catConfig) return null; 

                 const style = CATEGORY_STYLES[catConfig.color] || CATEGORY_STYLES.slate;
                 
                 return (
                    <div key={catId} className="break-inside-avoid mb-6">
                        <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${style.text} flex items-center gap-1.5`}>
                           <span className={`w-1.5 h-1.5 rounded-full ${style.dotBg}`}></span>
                           {catConfig.label}
                        </h3>
                        <div>
                            {catBanks.map(([key, bank]) => (
                                <BankGroup 
                                    key={key}
                                    bankKey={key} 
                                    bank={bank} 
                                    onInsert={insertVariableToTemplate}
                                    onDeleteOption={handleDeleteOption}
                                    onAddOption={handleAddOption}
                                    onDeleteBank={handleDeleteBank}
                                    onUpdateBankCategory={handleUpdateBankCategory}
                                    categories={categories}
                                    t={t}
                                />
                            ))}
                        </div>
                    </div>
                 );
            })}
          </div>

            {isAddingBank ? (
                <div className="border-2 border-dashed border-indigo-200 rounded-lg p-4 bg-indigo-50/50 mt-4">
                    <h4 className="text-xs font-bold text-indigo-900 mb-3 uppercase tracking-wide">{t('add_bank_title')}</h4>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">{t('label_name')}</label>
                            <input 
                                autoFocus
                                type="text" 
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none"
                                placeholder={t('label_placeholder')}
                                value={newBankLabel}
                                onChange={e => setNewBankLabel(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">{t('id_name')}</label>
                            <input 
                                type="text" 
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 font-mono focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none"
                                placeholder={t('id_placeholder')}
                                value={newBankKey}
                                onChange={e => setNewBankKey(e.target.value)} 
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">{t('category_label')}</label>
                            <select 
                                value={newBankCategory}
                                onChange={e => setNewBankCategory(e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none bg-white"
                            >
                                {Object.values(categories).map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2 pt-1">
                            <button 
                                onClick={handleAddBank}
                                className="flex-1 bg-indigo-600 text-white text-xs py-1.5 rounded hover:bg-indigo-700 font-medium"
                            >
                                {t('confirm_add')}
                            </button>
                            <button 
                                onClick={() => setIsAddingBank(false)}
                                className="flex-1 bg-white border border-gray-300 text-gray-600 text-xs py-1.5 rounded hover:bg-gray-50"
                            >
                                {t('cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button 
                    onClick={() => setIsAddingBank(true)}
                    className="w-full py-3 mt-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:text-indigo-500 hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 font-medium text-sm"
                >
                    <Plus size={18} />
                    {t('add_bank_group')}
                </button>
            )}
        </div>
      </div>

      {/* --- Category Manager Modal --- */}
      <CategoryManager 
        isOpen={isCategoryManagerOpen} 
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        setCategories={setCategories}
        banks={banks}
        setBanks={setBanks}
        t={t}
      />

      {/* --- 3. Main Editor (Right) --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50/50 relative">
        
        {/* 顶部工具栏 */}
        <div className="px-8 py-4 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm z-20 h-[72px]">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{activeTemplate.name}</h1>
            <p className="text-xs text-gray-500 mt-0.5">
                {isEditing ? t('editing_status') : t('preview_status')}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button
                    onClick={() => setIsEditing(false)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${!isEditing ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Eye size={16} /> {t('preview_mode')}
                </button>
                <button
                    onClick={() => setIsEditing(true)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${isEditing ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Edit3 size={16} /> {t('edit_mode')}
                </button>
             </div>

            <div className="h-6 w-px bg-gray-200 mx-1"></div>

            <button
                onClick={handleExportImage}
                disabled={isEditing}
                className={`
                flex items-center gap-2 px-3 py-2 rounded-lg font-medium shadow-sm transition-all border
                bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-indigo-600
                disabled:opacity-50 disabled:cursor-not-allowed
                `}
                title={t('export_image')}
            >
                <ImageIcon size={18} />
                <span className="hidden sm:inline">{t('export_image')}</span>
            </button>

            <button
                onClick={handleCopy}
                className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-sm transition-all border
                ${copied 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-gray-900 border-gray-900 text-white hover:bg-gray-800'}
                `}
            >
                {copied ? <Check size={18} /> : <CopyIcon size={18} />}
                {copied ? t('copied') : t('copy_result')}
            </button>
          </div>
        </div>

        {/* 核心内容区 */}
        <div className="flex-1 overflow-hidden relative">
            {isEditing ? (
                <VisualEditor
                    ref={textareaRef}
                    value={activeTemplate.content}
                    onChange={(e) => updateActiveTemplateContent(e.target.value)}
                    banks={banks}
                />
            ) : (
                <div className="w-full h-full overflow-y-auto p-8">
                     <div 
                        id="preview-card"
                        className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8 min-h-[800px]"
                     >
                        <div id="final-prompt-content" className="prose prose-slate max-w-none">
                            {renderTemplateContent()}
                        </div>
                     </div>
                     <div className="h-20"></div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default App;
