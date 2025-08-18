[English Readme](README.md)

# Tunan Blog

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

一个使用 Go 和 Next.js 构建的全栈博客应用，拥有一个功能丰富的现代化后台管理面板，以及一个设计简洁、响应迅速的前台界面。

## 在线 Demo

[https://www.tunan.fun](https://www.tunan.fun)

## 功能特性

### 前台站点 (`/ui`)

- **博客文章**: 简洁、易于阅读的文章界面，支持完整的 Markdown 渲染。
- **命令面板搜索**: 一个可通过键盘快速驱动的搜索界面（类似 VS Code 或 GitHub），用于快速查找文章和导航站点。
- **交互式评论系统**: 集成了 [Remark42](https://remark42.com/)，提供一个注重隐私、可自托管的评论体验。
- **浏览量跟踪**: 跟踪并显示每篇文章的浏览次数。
- **RSS Feed 生成**: 自动为博客更新生成 RSS feed，兼容所有 RSS 阅读器。
- **Folo 阅读器集成**: 包含为 [Folo](https://folo.im/) RSS 阅读器定制的追踪埋点。
- **书籍推荐**: 一个专门的区域用来展示博主精选的书籍列表。
- **项目展示**: 用于展示个人或专业项目。
- **SEO 友好**: 包含谷歌站点验证及其他 SEO 优化考量。
- **响应式设计**: 完全响应式的布局，确保在任何设备上都有最佳体验。
- **深色/浅色主题**: 提供主题切换开关以满足用户偏好。

### 后台管理面板 (`/ui-admin`)

- **安全认证**: 基于 JWT 的登录系统，保护后台管理路由。
- **仪表盘**: 一个核心仪表盘，用于查看关键指标，包括页面浏览量排行榜。
- **文章全功能管理 (CRUD)**: 使用富文本编辑器，对文章进行创建、读取、更新和删除操作。
- **书籍全功能管理 (CRUD)**: 轻松管理书籍推荐列表。
- **现代化 UI**: 基于 Ant Design 构建，提供专业、直观的用户体验。
- **主题化**: 支持浅色和深色两种模式。

## 技术栈

- **后端**: Go (Golang)，使用 [Fiber](https://gofiber.io/) Web 框架。
- **前台 (公开)**: [Next.js](https://nextjs.org/) (React), TypeScript, Tailwind CSS。
- **前台 (管理)**: [Next.js](https://nextjs.org/) (React), TypeScript, [Ant Design](https://ant.design/)。
- **数据库**: 设计上兼容 MySQL 和 SQLite。

## 本地启动

按照以下简单步骤，即可在本地启动并运行项目。

### 先决条件

- Go (版本 1.18 或更高)
- Node.js (版本 18 或更高)
- 一个正在运行的数据库实例: MySQL (v8.0+) 或 SQLite3
- npm 或 yarn

### 安装与设置

1.  **克隆仓库:**
    ```sh
    git clone https://github.com/your-username/tunan-blog.git
    cd tunan-blog
    ```

2.  **设置数据库:**
    - 如果使用 MySQL，请创建一个新的数据库 (例如 `tunan`)。
    - 执行项目根目录下的 `schema.sql` 文件来导入表结构。
      ```sh
      # MySQL 示例
      mysql -u your_user -p your_database < schema.sql
      ```

3.  **配置并运行后端:**
    - 进入项目根目录。
    - 创建并配置你的环境文件 (例如 `env/dev.yaml`)，填入数据库连接凭证和其他设置。
    - 运行后端服务:
      ```sh
      go run cmd/tunan-blog/main.go
      ```
    - 后端将在 `http://localhost:3002` 上可用。

4.  **设置前台站点:**
    - 进入 `ui` 目录:
      ```sh
      cd ui
      ```
    - 安装依赖:
      ```sh
      npm install
      ```
    - 运行开发服务:
      ```sh
      npm run dev
      ```
    - 前台站点将在 `http://localhost:3000` 上可用。

5.  **设置后台管理面板:**
    - 进入 `ui-admin` 目录:
      ```sh
      cd ui-admin
      ```
    - 安装依赖:
      ```sh
      npm install
      ```
    - 运行开发服务:
      ```sh
      npm run dev
      ```
    - 后台管理面板将在 `http://localhost:3001` 上可用。

## 配置说明

所有后端配置都通过 `/env` 目录下的 YAML 文件进行管理。应用默认加载 `dev.yaml`，如果 `GO_TUNAN_BLOG_ENV` 环境变量被设为 `prod`，则会加载 `prod.yaml`。

### 后台管理员认证

后台登录由 JWT 处理。你需要在 `.yaml` 文件中配置密码和 JWT 密钥。

1.  **设置一个临时密码**: 在你的 `dev.yaml` 或 `prod.yaml` 文件中，为 `admin_password` 设置一个明文密码，并为 `jwt_secret` 设置一个随机字符串。
    ```yaml
    auth:
      admin_password: "your-temporary-strong-password"
      jwt_secret: "a-very-strong-and-secret-string-for-jwt"
    ```
2.  **生成密码哈希**: 启动后端服务 (`go run cmd/tunan-blog/main.go`)。应用会检测到明文密码，自动使用 bcrypt 将其哈希，并在控制台日志中打印出哈希值。日志信息如下所示:
    ```
    IMPORTANT: Please update your dev.yaml with the new hashed password:
    auth:
      admin_password: "$2a$10$....(a long hash string)..."
    ```
3.  **更新配置**: 从日志中复制完整的哈希字符串 (`$2a$...`)，并用它替换掉 `.yaml` 文件中的临时密码。这便是你永久、安全的密码哈希。
4.  **重启**: 重启后端服务。现在你可以用在第 1 步中设置的明文密码登录了。

### 谷歌站点验证

要通过 Google Search Console 验证你的网站所有权:

1.  **文件位置**: meta 标签位于 `ui/app/layout.tsx`。
2.  **找到这一行**:
    ```html
    <meta name="google-site-verification" content="xxxx"/>
    ```
3.  **更新验证码**: 将 `xxxx` 替换为你自己的由谷歌提供的验证码。

### Folo 阅读器集成

要配置 Folo RSS 阅读器追踪，请在你的 `.yaml` 配置文件中的 `website` 键下更新以下字段:

```yaml
website:
  # ... 其他网站设置
  follow_feed_id: "YOUR_FOLO_FEED_ID"
  follow_user_id: "YOUR_FOLO_USER_ID"
```

## 项目结构

本项目中关键目录的简介:

```
.
├── api/          # Go 后端 API 源代码
├── cmd/          # 后端主应用入口
├── internal/     # 后端业务逻辑 (服务, 仓储)
├── ui/           # 面向公众的 Next.js 前台站点
└── ui-admin/     # 基于 Ant Design 的后台管理面板
```

## 贡献代码

开源社区因贡献而成为一个绝佳的学习、启发和创造之地。我们**非常感谢**你的任何贡献。

1.  Fork 本项目
2.  创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3.  提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4.  将分支推送到远程 (`git push origin feature/AmazingFeature`)
5.  开启一个 Pull Request

## 许可证

本项目基于 Apache 2.0 许可证分发。详情请见 `LICENSE` 文件。
