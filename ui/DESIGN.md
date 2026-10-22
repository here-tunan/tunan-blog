# DESIGN.md — 纸墨编辑部（全站设计合同）

> 每一页、每一个组件改动前先读这份文件。方向不是"简洁现代"，是**纸上墨迹的编辑部排版**。

## 1. 视觉主题与气质

暖白纸底上的墨色排版：安静、密读、有刊物感。层级靠**留白分级 + 发丝分隔线**，
不靠卡片堆叠和阴影。霞鹜文楷大标题是全站唯一记忆点，也是别人抄不走的身份。
访客是陌生人：每个首屏要在 5 秒内回答"这是谁 / 他做什么 / 值得看什么"。

## 2. 色板与角色（OKLCH，token 定义在 `app/globals.css`）

| Token | Light | Dark | 角色 |
|---|---|---|---|
| `--paper` 画布 | `0.975 0.006 95` | `0.185 0.006 85` | 页面底色（60% 视觉权重） |
| `--paper-raised` 浮起面 | `0.993 0.004 95` | `0.23 0.006 85` | 输入框、muted 面 |
| `--ink` 主墨 | `0.25 0.012 95` | `0.88 0.012 95` | 标题、正文主色 |
| `--ink-2` 次墨 | `0.42 0.012 95` | `0.78 0.01 95` | 正文、dark 正文 |
| `--ink-3` 弱墨 | `0.55 0.01 95` | `0.64 0.008 95` | 辅助文字、日期 |
| `--line` 发丝线 | `0.90 0.008 95` | `0.28 0.006 85` | 分隔线、边框 |
| `--tone-indigo` 靛蓝 | `0.51 0.21 277` | `0.62 0.17 277` | 强调色（10%），链接/激活/hover |
| `--tone-indigo-wash` 靛蓝淡染 | `0.955 0.022 277` | `0.28 0.06 277` | 激活底、标签底 |

语义类（tailwind.config 已映射）：`bg-background` `text-foreground` `text-muted-foreground`
`border-border` `bg-accent text-accent-foreground` `bg-primary` `ring-ring`。
**强调色只有靛蓝一个**。导航图标默认弱墨，hover 升全墨；唯一例外：Discord hover 亮品牌蓝紫
`#5865F2`（品牌色只允许在 hover 上出现），Folo 保留烧录的品牌橙。

## 3. 字体

- **展示层**：霞鹜文楷 `"LXGW WenKai"`（已自托管 Regular；标题用 400–500 字重，不造 faux bold）
- **正文**：`--font-inter` + 系统中文栈（PingFang SC / Microsoft YaHei）
- **代码与数字**：`font-mono`（只在真正的代码/数据上用；中文标题禁止 font-mono——中文没有等宽效果）
- 层级：display 34–44px / h2 24–28px / h3 18–20px / body 16px 行高 1.8（中文）/ small 13.5px
- 大标题（≥32px）`letter-spacing: -0.022em`，h2 `-0.012em`，正文默认

## 4. 组件形态

- **列表行**（博客、翻译、书）：无边卡，行间发丝线；hover 底色 `foreground/4` + 墨线从左生长
- **分区**：默认无卡。必须容器化时 = `rounded-xl border border-border bg-background`，一档阴影 `0 1px 3px rgba(0,0,0,.10)`
- **按钮**：pill 或 `rounded-lg`；hover 底色步进；按下 `active:scale-[0.96]`；禁用 40% 透明
- **标签/chip**：`rounded-full border border-border bg-accent px-2.5 py-0.5 text-[13px]`，全站只有这一种写法
- **导航**：悬浮纸 pill（`bg-background/85 border-border backdrop-blur`），条目纯文字 + 墨线激活态
- **评分星**：靛蓝实心 / `--line` 空心，不用金色

## 5. 布局

- 容器 `--content-width: 1054px` 不变；内边距 `px-4 sm:px-6`
- 间距走 8 的倍数；分区之间 64–96px；首屏到第一分区 48–64px
- 时间轴、about、首页全部单栏编辑部流；辅助信息右对齐同基线

## 6. 深度

光模式：层级靠 `paper → paper-raised → white` 明度阶梯 + 一档阴影，能不用阴影就不用。
暗模式：`paper(0.185) → raised(0.23)` 亮度阶梯是唯一深度语言，阴影基本无效不用边框堆叠。

## 7. Do / Don't

✅ 文楷大标题、发丝线、留白分级、单一靛蓝、`active:scale`、`prefers-reduced-motion` 全动画尊重
❌ 渐变文字（`bg-clip-text`）、backdrop-blur 当卡片、紫蓝渐变底、`border-left` 粗条当强调、
　 emoji 当图标/章节符、`transition: all`、金色星星、一张页面超过一种胶囊写法

## 8. 响应式

- 断点沿用 sm/lg；导航移动端保持单行 pill（搜索折叠成图标）
- 触控目标 ≥ 40×40；`touch-action: manipulation`
- 全出血区块用 `env(safe-area-inset-*)`

## 9. Agent 速查

```
画布 bg-background   正文 text-foreground(主)/text-muted-foreground(辅)
强调   text-primary / bg-primary / bg-accent(+text-accent-foreground)
线条   border-border / divide-border   面板 rounded-xl border border-border bg-background
标题   font-display text-3xl tracking-[-0.022em] text-foreground
```

示例 prompt："给 weekly 页做列表：`divide-y divide-border`，行 `py-4 flex justify-between`，
标题 `text-foreground group-hover:text-primary`，日期 `font-mono text-[13px] text-muted-foreground`，
行 hover `bg-foreground/[0.04]`，标题 hover 墨线 `after:scale-x-100`。"

---

*主题冻结说明：`.cyberpunk` CSS 块与 `themes.ts` 已冻结（仅 light/dark 在用），不再投入，最后统一清理或对齐。*
