# Web 渲染方式完全指南 — SSR、CSR、SSG、ISR

一份从零开始理解 Web 渲染演进的指南：什么是 SSR/CSR/SSG/ISR？它们是怎么演化出来的？框架该怎么选？中国互联网为什么大量用 Vue？

本文是 [CDN-GUIDE.md](./CDN-GUIDE.md) 的姊妹篇 —— CDN 指南讲"缓存怎么加"，这篇讲"渲染发生在哪、什么时候发生"。理解了本文，才真正理解 CDN 指南里的 `revalidate` 和 `s-maxage` 为什么这么设计。

阅读对象：你自己，六个月后回来复习时看得懂。

---

## 目录

1. [先理清核心概念](#1-先理清核心概念)
2. [四种渲染方式对比全景](#2-四种渲染方式对比全景)
3. [SSR — 服务端渲染](#3-ssr--服务端渲染)
4. [CSR — 客户端渲染](#4-csr--客户端渲染)
5. [SSG — 静态生成](#5-ssg--静态生成)
6. [ISR — 增量静态再生](#6-isr--增量静态再生)
7. [用一个比喻记住它们](#7-用一个比喻记住它们)
8. [Web 渲染的演进史](#8-web-渲染的演进史)
9. [为什么有了 CSR 还要回归 SSR](#9-为什么有了-csr-还要回归-ssr)
10. [跨框架对照表](#10-跨框架对照表)
11. [Vue vs React：中国生态为什么爱 Vue](#11-vue-vs-react中国生态为什么爱-vue)
12. [如何选择：一张决策树](#12-如何选择一张决策树)
13. [回到 tunan.fun 的选型](#13-回到-tunanfun-的选型)
14. [术语速查](#14-术语速查)

---

## 1. 先理清核心概念

### 一个页面从"数据"到"用户屏幕"要经过几步？

任何 Web 页面显示到用户面前，都必须完成三件事：

1. **拿数据** — 从数据库/API 获取内容（"最新 10 篇文章")
2. **渲染 HTML** — 把数据填进模板，生成 HTML 字符串
3. **浏览器显示** — 用户看到内容

**渲染方式的差别，本质就是这三步发生在什么时机、什么位置。**

| 模式 | 拿数据在哪 | 渲染 HTML 在哪 | 什么时候 |
|------|-----------|--------------|---------|
| SSR  | 服务器     | 服务器         | 每次请求 |
| CSR  | 浏览器     | 浏览器         | 用户加载后 |
| SSG  | 构建机器   | 构建机器       | build 时（一次）|
| ISR  | 服务器     | 服务器         | 定期（TTL 到期后一次）|

后面每一章都会详细展开。

---

## 2. 四种渲染方式对比全景

在深入之前，先给你一张全景图：

```
         HTML 什么时候生成？          SEO   首屏速度   服务器压力   内容新鲜度
         ─────────────────────────   ────  ────────  ──────────  ────────
SSG      Build 时，一次性             ✅     ⚡⚡⚡      🌱 无        😐 需重 build
SSR      每次请求时，服务器渲染        ✅     ⚡⚡       🔥 高         ✅ 总最新
ISR      Build 时 + 定期在服务器刷新   ✅     ⚡⚡⚡      🌱 低         ✅ 可控延迟
CSR      浏览器里，运行时              ❌     🐢         🌱 无        ✅ 总最新
```

**关键洞察**：没有"最好"的模式，只有"最适合场景"的模式。

- 博客/新闻/电商 → SSR / ISR / SSG
- 后台系统/编辑器/工具 → CSR
- 纯文档站 → SSG

---

## 3. SSR — 服务端渲染

### 3.1 工作流程

```
用户浏览器                       Next.js 服务器            后端 API
    │                                 │                    │
    │ GET /blog                       │                    │
    ├────────────────────────────────>│                    │
    │                                 │ 调用 /article/list │
    │                                 ├───────────────────>│
    │                                 │<───────────────────┤
    │                                 │ 返回文章数据        │
    │                                 │                    │
    │                                 │ 渲染完整 HTML       │
    │                                 │ (带文章内容)        │
    │  完整的 HTML                     │                    │
    │  <html><body>                   │                    │
    │    <h1>文章1</h1>               │                    │
    │    <h1>文章2</h1>               │                    │
    │  </body></html>                 │                    │
    │<────────────────────────────────┤                    │
    │                                 │                    │
    │ ✅ 立刻看到内容                   │                    │
```

**关键点**：
- 服务器把 HTML **完整渲染好**再发给浏览器
- 浏览器"View Source" 能看到所有内容
- Google 爬虫、社交分享抓预览都拿到完整内容

### 3.2 优缺点

**优点：**
- ✅ SEO 友好（爬虫拿到完整 HTML）
- ✅ 首屏快（没有额外等待）
- ✅ 社交分享有预览
- ✅ 内容永远最新

**缺点：**
- ❌ 服务器压力大（每次请求都要渲染）
- ❌ 用户越多服务器越贵
- ❌ **可缓存性差**（除非配置 Cache-Control，见 CDN 指南第 8 章）

### 3.3 触发 SSR 的代码模式

Next.js 里，**只要 fetch 加了 `cache: 'no-store'` 就会自动进入 SSR 模式**：

```ts
// 这行代码让整个页面变成 SSR
const response = await fetch(`${API_URL}/article/list`, {
  cache: 'no-store',
});
```

这也是 `tunan.fun` 现在的状态。**每个用户访问都会走一遍完整流程，没有任何缓存**。CDN 指南第 8 章就是要把这个改成 ISR。

---

## 4. CSR — 客户端渲染

### 4.1 工作流程

```
用户浏览器                       静态服务器                后端 API
    │                                 │                    │
    │ GET /blog                       │                    │
    ├────────────────────────────────>│                    │
    │                                 │                    │
    │  空 HTML 骨架                    │                    │
    │  <html><body>                   │                    │
    │    <div id="app"></div>  ← 空! │                    │
    │    <script src="app.js"/>       │                    │
    │  </body></html>                 │                    │
    │<────────────────────────────────┤                    │
    │                                 │                    │
    │ 😐 白屏，什么都看不到              │                    │
    │                                 │                    │
    │ 下载 app.js (可能 500KB+)        │                    │
    ├────────────────────────────────>│                    │
    │<────────────────────────────────┤                    │
    │                                 │                    │
    │ 执行 JS，Vue/React 启动          │                    │
    │                                 │                    │
    │ 发起 fetch('/article/list')     │                    │
    ├───────────────────────────────────────────────────────>│
    │                                 │                    │
    │<───────────────────────────────────────────────────────┤
    │                                 │  返回 JSON 数据      │
    │                                 │                    │
    │ 在浏览器里渲染 DOM                │                    │
    │                                 │                    │
    │ ✅ 终于看到内容（2-3 秒后）        │                    │
```

**关键点**：
- 服务器只给一个**空壳 HTML** + 一个大 JS 文件
- 浏览器要**执行 JS** → **再发请求拿数据** → **在浏览器里拼 HTML**
- "View Source" 看不到任何内容

### 4.2 优缺点

**优点：**
- ✅ 服务器压力极小（纯静态文件）
- ✅ 交互丝滑（页面切换不刷新，像原生 App）
- ✅ 前后端职责清晰（后端只写 API）
- ✅ 组件化开发爽

**缺点：**
- ❌ **SEO 灾难**（爬虫看不到内容）
- ❌ **首屏慢**（白屏 2-8 秒）
- ❌ **社交分享抓不到预览**
- ❌ 依赖 JS，禁用 JS 就完全不能用
- ❌ 手机 CPU、电量替服务器打工

### 4.3 CSR 适合的场景

**登录后的应用**，SEO 不重要，用户能接受首屏加载：

- Gmail、Notion、Figma、Trello
- 后台管理系统（Ant Design Pro、Vue Admin）
- 游戏、编辑器、可视化工具（Figma、CodeSandbox、tldraw）
- 数据 Dashboard、BI 报表

**共同点**：都是"网页版桌面软件"，SSR 反而是累赘。

### 4.4 CSR 的典型技术栈

- **React SPA**：`create-react-app`、`Vite + React`
- **Vue SPA**：`create-vue`、`Vite + Vue`、`Vue CLI`

**注意**：Vue 和 React **本身都不是"CSR 框架"或"SSR 框架"**。它们只是渲染库，怎么用取决于你搭什么样的项目脚手架。

---

## 5. SSG — 静态生成

### 5.1 工作流程

```
Build 时（一次性完成）：
    构建工具 → 问后端拿数据 → 渲染好所有 HTML → 存成静态文件
    /blog.html
    /blog/article-1.html
    /blog/article-2.html
    ...

用户访问时：
用户浏览器                       静态服务器
    │                                 │
    │ GET /blog                       │
    ├────────────────────────────────>│
    │  完整 HTML（build 时生成的）     │
    │<────────────────────────────────┤
    │                                 │
    │ ✅ 立刻看到内容（超快）           │
```

**关键点**：
- 连服务器都不用跑代码，就是发**静态文件**
- 可以直接部署到 GitHub Pages、Netlify、Cloudflare Pages
- 极快、极便宜

### 5.2 优缺点

**优点：**
- ⚡ **速度极致快**（纯静态文件 + CDN）
- 💰 **成本极低**（不需要跑服务器）
- ✅ SEO 完美
- 🛡️ **安全性高**（没有服务端代码可攻击）

**缺点：**
- 😐 **内容更新需要重新 build + 部署**
- 😐 不适合内容频繁变动的场景
- 😐 不能做个性化（每个用户看到的都一样）

### 5.3 SSG 适合的场景

- 文档站（VitePress、Docusaurus）
- 技术博客（Hugo、Jekyll、Astro）
- 营销落地页
- 个人作品集

### 5.4 SSG 的典型工具

| 工具 | 语言/框架 | 特点 |
|-----|----------|------|
| **VitePress** | Vue | Vue 官方文档就用它 |
| **Docusaurus** | React | Meta 出品，文档站首选 |
| **Astro** | 多框架 | 可混用 React/Vue/Svelte |
| **Hugo** | Go | 速度快、生态大 |
| **Jekyll** | Ruby | GitHub Pages 原生支持 |
| **Next.js / Nuxt** | React / Vue | 也支持 SSG 模式 |

---

## 6. ISR — 增量静态再生

### 6.1 ISR 是什么

**ISR = SSG + 定期自动刷新**。这是 Next.js 发明的新范式，后来 Nuxt、SvelteKit 也跟进了。

**ISR 结合了 SSG 和 SSR 的优点**：
- 像 SSG 一样，页面预渲染成 HTML（快）
- 像 SSR 一样，会自动重新渲染（新）
- 关键：**重新渲染有 TTL 控制**，不是每次请求

### 6.2 工作流程

```
T=0s     Build 完成，页面预渲染。快照 v1。
T=10s    用户 A 访问 → 返回快照 v1 (50 ms) ⚡
T=30s    用户 B 访问 → 返回快照 v1 (50 ms) ⚡
T=59s    用户 C 访问 → 返回快照 v1 (50 ms) ⚡
         (revalidate=60，还在有效期)

T=61s    用户 D 访问
         → 快照过期了！
         → 后台重新调用 API + 渲染 → 快照 v2 (1500 ms)
         → 存起来
         → 返回给用户 D

T=62s    用户 E 访问 → 返回快照 v2 (50 ms) ⚡
T=90s    用户 F 访问 → 返回快照 v2 (50 ms) ⚡
...
```

**关键**：99% 的请求都在返回缓存快照（50ms），只有极少数触发重渲染（1500ms）。

### 6.3 触发 ISR 的代码

Next.js：

```ts
const response = await fetch(`${API_URL}/article/list`, {
  next: { revalidate: 60 },   // ← 这个 60 就是 TTL（秒）
});
```

Nuxt 3：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/blog': { swr: 60 },   // ← 一样的意思
  },
})
```

### 6.4 tradeoff

**你要接受的代价**：**新内容最多延迟 `revalidate` 秒才可见。**

- `revalidate: 60` → 新文章最多 1 分钟才在列表出现
- `revalidate: 3600` → 新文章最多 1 小时才在列表出现

**收益**：TTFB 从 1500ms 降到 50ms（30 倍加速），后端调用次数从"每个请求 1 次"降到"每 60 秒 1 次"。

对博客场景来说完全值得 —— 这也是 tunan.fun 要迁移到的目标状态。

---

## 7. 用一个比喻记住它们

想象你去餐厅吃饭：

| 模式 | 类比 | 特点 |
|------|------|------|
| **SSG** | **提前做好的三明治** | 客人来了直接拿走，超快，但只有那几种 |
| **SSR** | **客人点单，现场做** | 什么都能点，但要等 |
| **ISR** | **热柜里的现成菜** | 提前做好放柜台，卖光/放太久了再补一批 |
| **CSR** | **给食材和菜谱，自己回家做** | 服务员只给原料，你自己动手 |

**博客场景**：客人想吃现成的，不想自己做菜。所以 SSG / SSR / ISR 都行，CSR 不行。

---

## 8. Web 渲染的演进史

Web 渲染方式不是设计出来的，是**演化出来的**。理解演化路径，才理解每个模式的存在意义。

### 时间线

```
1990s ─ 2005    静态 HTML + 服务端渲染（PHP/JSP/ASP）
   │            所有内容服务器生成，浏览器只显示
   │
2006 ─ 2013     jQuery + AJAX 时代
   │            SSR 打底 + JS 局部增强
   │
2013 ─ 2018     🚀 CSR 全盛期（React/Vue/Angular 崛起）
   │            "SPA 是未来，所有东西都在浏览器里跑！"
   │
2016 ─ 2020     🤔 CSR 的问题暴露
   │            SEO 差、首屏慢、白屏、社交分享挂
   │
2018 ─ 至今     ✨ 现代 SSR 回归 + 新范式
                Next.js / Nuxt / Remix / SvelteKit
                "服务端渲染 + 客户端交互，全都要"
```

### 每个阶段的动机

**2005 之前**：Web 本来就是"服务端生成 HTML"，因为浏览器根本没能力做别的。

**2013-2018 CSR 崛起**：因为传统 SSR 每次点击都整页刷新（白屏、滚动位置丢失），大家想要 Gmail、Google Maps 那种"永远不刷新"的体验。React/Vue 让这个梦想成真。

**2018 至今 SSR 回归**：因为纯 CSR 有一堆致命问题（下一章详述），大家发现"其实我们只是想要交互丝滑，不是想丢掉 SSR"。于是 Next.js / Nuxt 出现，把两者融合。

### 一个有趣的观察

**前端十年就是绕了个大圈**：

```
2005: 服务端渲染（PHP）  ─┐
                          ├──> 中间那波"全都客户端渲染"是个弯路
2020: 服务端渲染（Next.js）─┘   现在又回归了，只是升级版
```

行业里有个梗：**"前端每 5 年就重新发明一次 SSR"** 😄

不过这次的 SSR 是站在 CSR 肩膀上的 —— React/Vue 的组件模型、状态管理、生态都留下来了，只是把渲染的时机从"浏览器"挪回了"服务器"。

---

## 9. 为什么有了 CSR 还要回归 SSR

CSR 曾经被视为"Web 的未来"。用了几年后，一堆问题浮出水面。

### 坑 1：SEO 灾难 🚫

Google 爬虫看到的 HTML：

```html
<div id="app"></div>   ← 就这个
```

即使 Google 后来能执行 JS，也有一堆问题：
- **慢**：普通 SSR 页面秒收录，SPA 可能几周才被完整抓取
- **不稳定**：JS 执行超时 → 收录空页面
- **Bing、百度、DuckDuckGo 更弱**，很多干脆不执行 JS

**对内容型网站（博客、新闻、电商）是致命伤。**

### 坑 2：首屏白屏 🐢

```
用户点开链接
├─ 0ms:    白屏
├─ 500ms:  下载 index.html（空的）
├─ 1500ms: 下载 app.js（500KB - 2MB）
├─ 2000ms: JS 解析 + 执行
├─ 2500ms: Vue/React 启动，发起 API 请求
├─ 3500ms: 数据返回，渲染 DOM
└─ 3500ms: 用户终于看到内容
```

**手机 4G 网络下这个过程可能 5-8 秒**。Google 的研究说：**页面加载超过 3 秒，53% 用户会离开**。

### 坑 3：社交分享抓不到预览 🚫

微信/Twitter/Facebook 分享链接时，它们的爬虫抓 `<meta>` 标签：

```html
<!-- SSR 输出 -->
<meta property="og:title" content="我的文章标题">
<meta property="og:image" content="/cover.jpg">

<!-- CSR 输出 -->
<meta property="og:title" content="Loading...">   ← 因为 JS 还没跑
```

结果：分享链接预览一片空白，点击率大跌。

### 坑 4：JS bundle 越来越大 📦

CSR 应用需要把**所有页面的所有代码**都下载到浏览器：

```
2015 年的 SPA：200 KB
2018 年的 SPA：1 MB
2020 年的 SPA：3 MB+
```

慢速网络、老手机直接崩溃。

### 坑 5：设备电量、算力浪费 🔋

同样一个页面：
- SSR：服务器渲染一次，1000 个用户看
- CSR：1000 个用户各自的手机 CPU 渲染 1000 次

**用户的手机在替服务器打工**，手机烫、耗电。

### 坑 6：可访问性差 ♿

屏幕阅读器（视障用户用）经常读不到 CSR 内容 —— 因为它们不总是等 JS 跑完。

### 坑 7：Hydration mismatch 等新复杂度 🌀

SSR + CSR 混合带来的"水合不匹配"问题、路由同步、状态管理复杂度爆炸 —— 前端工程师被搞崩溃。

### 现代 SSR 的解决方案

Next.js 这类框架采用了 **Hydration（水合）** 方案：

```
首次访问：
    服务端渲染完整 HTML → 浏览器立刻看到内容 ⚡ (像 SSR)

后续交互：
    React/Vue 在浏览器"接管"页面 → 切换路由无需刷新 🚀 (像 CSR)
```

**兼得两者优点** —— 你现在用的 Next.js 就是这种。

---

## 10. 跨框架对照表

好消息：**所有主流框架的渲染心智模型都是一样的**，只是 API 语法不同。

| 框架 | 语言/生态 | 静态生成 (SSG) | 增量再生 (ISR) | 服务端渲染 (SSR) |
|------|----------|--------------|--------------|----------------|
| **Next.js** | React | `fetch()` 无参 + `generateStaticParams` | `next: { revalidate: N }` | `cache: 'no-store'` |
| **Nuxt 3** | Vue | `nuxt generate` | `routeRules: { swr: 60 }` 或 `isr: 60` | 默认（`ssr: true`）|
| **SvelteKit** | Svelte | `prerender = true` | `config = { isr: { expiration: 60 } }` (Vercel) | 默认 |
| **Astro** | 多框架 | 默认（每页都是静态）| `prerender = false` + edge cache | server output mode |
| **Remix** | React | 无内建（走 loader）| `Cache-Control` 头 in `loader` | 默认 |
| **VitePress** | Vue | ✅ 完全静态站 | ❌ 需重 build | ❌ |
| **Docusaurus** | React | ✅ 完全静态站 | ❌ 需重 build | ❌ |
| **Hugo / Jekyll** | Go / Ruby | ✅ 完全静态站 | ❌ 需重 build | ❌ |

### Nuxt 3 的等价示例

如果你把 tunan.fun 用 Nuxt 3 重写，`revalidate: 60` 的对应写法是：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/blog':          { swr: 60 },              // 类似 ISR：60 秒刷新
    '/blog/**':       { swr: 3600 },
    '/api/**':        { cors: true, cache: false },
    '/':              { swr: 60 },
  },
})
```

**Mental model 和 Next.js 完全一样，只是语法换了个壳。** 迁移成本很低。

### HTTP 层的东西是框架无关的

无论用什么框架，`Cache-Control: s-maxage=60, stale-while-revalidate=3600` 这些 HTTP 头都是**跨框架、跨 CDN 通用的**。

这也是为什么 [CDN-GUIDE.md](./CDN-GUIDE.md) 第 7、10、11、12 章（Cloudflare 部分）是**完全框架无关**的 —— 只要源服务器发的响应头对，Cloudflare 一视同仁。

---

## 11. Vue vs React：中国生态为什么爱 Vue

一个常见误解需要先澄清：

> "Vue 只能做 CSR，React 才能做 SSR？"

**❌ 完全错误**。Vue 和 React **本身都是渲染库**，都完全支持 SSR：

| | React | Vue |
|---|-------|-----|
| 是否支持 SSR？ | ✅ | ✅ |
| 官方 meta 框架 | Next.js | **Nuxt** |
| 纯 CSR 用法 | Create React App / Vite | Vite / Vue CLI |

**Vue 和 React 完全对等。** 所以问题不是"Vue 能不能 SSR"，而是"**为什么中国公司用 Vue 大多只做 CSR**"。

### 原因 1：中文生态碾压 🐉

- Vue 作者尤雨溪是中国人
- 官方文档很早就有高质量中文版
- 中文社区活跃（掘金、知乎、B 站）
- 出问题搜中文答案，Vue 命中率 >> React

对英语不流利的开发者，是**降维打击**。

### 原因 2：Vue 学习曲线更平缓 📚

Vue 语法接近 HTML/CSS/JS 三件套，从 jQuery 时代的开发者更容易迁移过来。中国互联网早期一大批开发者是 jQuery 背景，Vue 是最平滑的升级路径。

### 原因 3：中国前端主战场是"后台系统" 💼

看看中国前端招聘 JD 最常见的活：

| 项目类型 | 占比 | 是否需要 SEO？ |
|---------|------|--------------|
| 后台管理系统（CRM/ERP/OA）| ~40% | ❌ 不需要 |
| 内部工具、Dashboard | ~20% | ❌ 不需要 |
| 小程序（微信/支付宝）| ~15% | ❌ 不需要 |
| App 内嵌 H5 | ~10% | ❌ 不需要 |
| 官网、落地页 | ~10% | ⚠️ 需要（很多用 SSG）|
| **需要 SEO 的 C 端网站** | **~5%** | ✅ 需要 |

**中国互联网的 C 端流量早就不靠搜索引擎**！主流入口是微信生态、抖音/小红书/B站、直接下载 App。**百度已经不是核心流量入口**。

既然不需要 SEO，那 CSR 就够用，Vue 开发体验又好，为什么要用更复杂的 SSR？

### 原因 4：Vue 后台生态成熟 🏢

Vue 的后台系统生态**碾压 React**：

- **Element Plus** / **Ant Design Vue**（组件库成熟）
- **vue-element-admin** / **vben-admin**（90k+ Stars 的开箱模板）
- 5 天能出个像样的后台

React 后台不是不行，但需要自己搭更多脚手架。

### 原因 5：小程序生态深度亲 Vue 📱

微信小程序、支付宝小程序的语法**深度借鉴 Vue**：

```vue
<!-- Vue -->
<div v-if="show" @click="handleClick">{{ msg }}</div>

<!-- 微信小程序 -->
<view wx:if="{{ show }}" bindtap="handleClick">{{ msg }}</view>
```

跨端框架也多是 Vue 系：
- **Uni-app**（DCloud）—— Vue 语法，一套代码发 8 个平台
- **Taro**（京东）—— 早期 React，现在两个都支持
- **mpvue**（美团）—— 直接 Vue

### 原因 6：企业采购决策 🏛️

- Element UI 是**饿了么/阿里前端团队**开源的 → 阿里系公司天然选用
- Ant Design Vue 是**蚂蚁**的 → 又是阿里系
- 国产化替代要求 → 政府、金融、国企倾向"国人主导"技术栈
- 团队培训成本 → 20 个人都会 Vue，换 React 要重新培训

### 那 SEO 敏感的中国 C 端网站用什么？

**很多也是 Vue 系（走 Nuxt）**：

| 网站 | 技术栈 |
|------|--------|
| 掘金 | Nuxt |
| 小米官网 | Vue + Nuxt |
| 京东部分商品页 | Vue + Nuxt |
| Vue.js 中文文档 | Vue + VitePress |

**Vue 完全能做 SSR，Nuxt 就是干这个的。**

### 中美对比

**核心差异：Google 是不是流量核心。**

| 维度 | 中国 | 美国 |
|-----|------|------|
| C 端流量来源 | 微信、抖音、小红书 | Google 搜索 |
| SEO 重要性 | 低 | 极高 |
| 主流场景 | 后台系统、小程序 | SaaS、内容网站、电商 |
| 首选框架 | Vue（CSR 为主）| React（SSR/Next.js 为主）|

**技术选型永远是商业环境的镜像。** 中国选 Vue + CSR 不是"技术落后"，是**匹配了中国互联网的真实场景**。

### 未来趋势

近几年中国前端也在"补 SSR 课"：
- 字节开源了 **Modern.js**（对标 Next.js）
- 阿里的 **UmiJS** 加了完整 SSR 支持
- Nuxt 3 在中国社区热度显著上升

原因：
- 出海业务需要 SEO（Google 流量）
- Web Vitals 影响国内浏览器打分（QQ 浏览器、UC 也在跟进）
- AI 爬虫（GPT/Claude/Gemini）抓取内容 → 新的"SEO"战场

**未来 3-5 年可能出现 Vue + Nuxt / React + Next.js 的迁移潮。**

---

## 12. 如何选择：一张决策树

```
你的网站是什么类型？
│
├─ 内容型（博客、新闻、电商、文档、企业官网）
│   ├─ 内容更新频繁（每天/每小时）
│   │   └─ ✅ SSR 或 ISR
│   │       ├─ 极致新鲜 → SSR (Next.js 默认)
│   │       └─ 追求性能 → ISR (revalidate: N)  ← tunan.fun 目标状态
│   │
│   └─ 内容更新慢（每周/每月）
│       └─ ✅ SSG（VitePress、Astro、Hugo）
│
├─ 应用型（后台、编辑器、Dashboard、SaaS 工具）
│   └─ ✅ CSR（纯 SPA 足够）
│       └─ 用 React + Vite 或 Vue + Vite
│
└─ 混合型（有内容页 + 有应用页，比如社交产品）
    └─ ✅ 现代 SSR 框架（Next.js / Nuxt）
        └─ 内容页 SSR/ISR，应用页 CSR
```

### 三个关键问题

问自己这三个问题，答案就出来了：

**Q1：搜索引擎能看到你的内容重要吗？**
- 是 → SSR / ISR / SSG
- 否 → CSR 也 OK

**Q2：你能接受几秒的首屏白屏吗？**
- 不能 → SSR / ISR / SSG
- 能 → CSR 也 OK

**Q3：内容多久变一次？**
- 每次请求都可能不同 → SSR
- 分钟到小时级更新 → ISR
- 天/周级更新 → SSG
- 用户互动才变 → CSR

---

## 13. 回到 tunan.fun 的选型

你的博客的属性：

| 维度 | 情况 |
|-----|------|
| 类型 | 内容型（博客）|
| SEO 需求 | ✅ 需要（想被 Google 搜到）|
| 首屏速度需求 | ✅ 需要（用户第一次访问就要看到内容）|
| 内容更新频率 | 分钟到小时级（发文章、编辑文章）|
| 全球用户 | ✅（美国+中国+其他）|

**结论**：ISR + CDN 是**最优选择**。

- ✅ **选 Next.js（React SSR/ISR）** — 已经选对了
- ⚠️ **但没开缓存** — 每个请求都是完整 SSR，浪费了 Next.js 最强的能力
- 🎯 **CDN 指南第 8 章的改造**就是让 SSR 变成 ISR，拿到"SSR 的完整性 + SSG 般的速度"

**如果当年选了 Nuxt（Vue SSR/ISR）也完全等价。** 都是内容型网站的正确解法。

**错误的做法**：内容型博客用纯 Vue SPA 或纯 React SPA（比如 create-react-app）。那样 SEO 就废了。

---

## 14. 术语速查

- **CSR (Client-Side Rendering)** — 客户端渲染，浏览器里跑 JS 生成 DOM
- **SSR (Server-Side Rendering)** — 服务端渲染，服务器每次请求都生成完整 HTML
- **SSG (Static Site Generation)** — 静态生成，build 时预渲染所有 HTML 存成文件
- **ISR (Incremental Static Regeneration)** — 增量静态再生，SSG + 定期在服务器刷新
- **SPA (Single Page Application)** — 单页应用，通常用 CSR 实现，切换路由不刷新页面
- **Hydration（水合）** — 服务器渲染的静态 HTML 到达浏览器后，客户端 JS "接管"页面并添加交互能力
- **SEO** — Search Engine Optimization，让搜索引擎能抓取和排名你的内容
- **TTFB (Time To First Byte)** — 浏览器等到第一字节的时间，SSR 类关键指标
- **LCP (Largest Contentful Paint)** — 页面主要内容显示的时间，用户感知的"加载完成"
- **revalidate** — Next.js 里控制 ISR 刷新周期的字段（秒）
- **swr (stale-while-revalidate)** — Nuxt 里对应 ISR 的字段，也是 HTTP 缓存指令
- **Nuxt** — Vue 官方 meta 框架，对标 Next.js
- **VitePress** — Vue 官方静态站生成器（SSG），文档站首选
- **Element Plus / Ant Design Vue** — Vue 生态主流组件库，后台系统常用

---

## 一页速查

```
渲染时机                 SSG    SSR    ISR    CSR
─────────────────────────────────────────────────
Build 时                 ✅              ✅
每次请求                        ✅
定期（TTL 触发）                        ✅
浏览器运行时                                    ✅

SEO                      ✅     ✅      ✅     ❌
首屏速度                 ⚡⚡⚡  ⚡⚡    ⚡⚡⚡  🐢
服务器压力               🌱     🔥      🌱    🌱
内容新鲜度               😐     ✅      ✅    ✅

代表框架
  React 系:  Astro     Next.js   Next.js   CRA/Vite
  Vue 系:   VitePress   Nuxt      Nuxt     Vite

适合场景:
  文档、博客   实时数据   博客、电商  后台系统
              个性化      新闻       工具
```

---

## 相关文档

- [CDN-GUIDE.md](./CDN-GUIDE.md) — 讲怎么给 tunan.fun 加 Cloudflare CDN，本文的实操延续
- Next.js 官方文档：https://nextjs.org/docs/app/building-your-application/rendering
- Nuxt 官方文档：https://nuxt.com/docs/guide/concepts/rendering

---

## 一句话记住整篇文档

> **渲染发生在服务器上还是浏览器里，就决定了 SEO、首屏速度、缓存能力、服务器成本的全部差异。**
>
> **SSG / SSR / ISR / CSR 的区别，本质是"什么时候、在哪里生成 HTML"的四种答案。**