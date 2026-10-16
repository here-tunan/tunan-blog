import React from "react";

type Locale = "zh-CN" | "en";

type BoxDef = {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    emoji: string;
    accent: string;
    fs?: number;
    title: { zh: string; en: string };
    subs: { zh: string[]; en: string[] };
};

const BOXES: BoxDef[] = [
    {
        id: "cf", x: 300, y: 104, w: 310, h: 96, emoji: "☁️", accent: "fill-amber-400",
        title: { zh: "Cloudflare CDN", en: "Cloudflare CDN" },
        subs: {
            zh: ["缓存 · 隐藏主站源站 · SSL Full(strict)", "手动统计 beacon(仅博客页)"],
            en: ["caching · hides origin · SSL Full(strict)", "manual analytics beacon (blog pages only)"],
        },
    },
    {
        id: "vps", x: 280, y: 272, w: 810, h: 402, emoji: "🖥️", accent: "fill-slate-400",
        title: { zh: "VPS · RackNerd 洛杉矶 · Ubuntu 24.04 · 1C2G", en: "VPS · RackNerd Los Angeles · Ubuntu 24.04 · 1C2G" },
        subs: { zh: [], en: [] },
    },
    {
        id: "caddy", x: 480, y: 322, w: 230, h: 64, emoji: "🚦", accent: "fill-blue-400",
        title: { zh: "Caddy 反向代理", en: "Caddy reverse proxy" },
        subs: { zh: [":80/:443 · 自动 HTTPS"], en: [":80/:443 · auto HTTPS"] },
    },
    {
        id: "ui", x: 310, y: 442, w: 215, h: 74, emoji: "🌐", accent: "fill-sky-400",
        title: { zh: "tunan-ui · Next.js", en: "tunan-ui · Next.js" },
        subs: { zh: [":3000 · 博客前台"], en: [":3000 · public site"] },
    },
    {
        id: "blog", x: 548, y: 442, w: 215, h: 74, emoji: "⚙️", accent: "fill-indigo-400",
        title: { zh: "tunan-blog · Go Fiber", en: "tunan-blog · Go Fiber" },
        subs: { zh: [":3002 · API"], en: [":3002 · API"] },
    },
    {
        id: "admin", x: 786, y: 442, w: 215, h: 74, emoji: "🔐", accent: "fill-violet-400",
        title: { zh: "tunan-admin · Next.js", en: "tunan-admin · Next.js" },
        subs: { zh: [":3001 · 管理后台"], en: [":3001 · admin panel"] },
    },
    {
        id: "remark", x: 310, y: 562, w: 310, h: 84, emoji: "💬", accent: "fill-yellow-400",
        title: { zh: "Remark42 v1.18 · Docker", en: "Remark42 v1.18 · Docker" },
        subs: {
            zh: [":8080 · 评论系统", "登录: 匿名/邮箱/GitHub/TG/Google"],
            en: [":8080 · comments", "Login: anon/email/GitHub/TG/Google"],
        },
    },
    {
        id: "backup", x: 660, y: 562, w: 320, h: 84, emoji: "💾", accent: "fill-amber-400",
        title: { zh: "backup.sh · cron 3:15", en: "backup.sh · cron 3:15" },
        subs: {
            zh: ["mysqldump + 评论导出 + 配置打包"],
            en: ["mysqldump + comments + config bundle"],
        },
    },
    {
        id: "tidb", x: 1170, y: 296, w: 300, h: 96, emoji: "🗄️", accent: "fill-green-400",
        title: { zh: "TiDB Cloud Serverless", en: "TiDB Cloud Serverless" },
        subs: {
            zh: ["免费 · us-west-2 · 库 tunan", "MySQL 协议 · 强制 TLS :4000"],
            en: ["free · us-west-2 · db tunan", "MySQL protocol · TLS :4000"],
        },
    },
    {
        id: "r2", x: 1170, y: 556, w: 300, h: 112, emoji: "🪣", accent: "fill-purple-400",
        title: { zh: "Cloudflare R2 · 免费 10GB", en: "Cloudflare R2 · free 10GB" },
        subs: {
            zh: ["桶 blog-backup/", "mysql/ · config/ · remark42/", "30 天滚动保留"],
            en: ["bucket blog-backup/", "mysql/ · config/ · remark42/", "30-day rolling retention"],
        },
    },
    {
        id: "gmail", x: 1170, y: 738, w: 300, h: 64, emoji: "📧", accent: "fill-red-400",
        title: { zh: "Gmail SMTP", en: "Gmail SMTP" },
        subs: { zh: ["评论邮件通知"], en: ["comment email notifications"] },
    },
    {
        id: "tg", x: 1170, y: 846, w: 300, h: 64, emoji: "✈️", accent: "fill-cyan-400",
        title: { zh: "Telegram 频道", en: "Telegram channel" },
        subs: { zh: ["Blog's notify · 新评论推送"], en: ["Blog's notify · new comment push"] },
    },
    {
        id: "b1", x: 540, y: 962, w: 250, h: 62, emoji: "🏗️", accent: "fill-blue-400",
        title: { zh: "① 本地构建", en: "① Local build" },
        subs: { zh: ["Go 交叉编译 + 2×Next build"], en: ["Go cross-compile + 2×Next build"] },
    },
    {
        id: "b2", x: 840, y: 962, w: 250, h: 62, emoji: "📦", accent: "fill-violet-400",
        title: { zh: "② rsync 产物", en: "② rsync artifacts" },
        subs: { zh: ["→ /opt/tunan-*"], en: ["→ /opt/tunan-*"] },
    },
    {
        id: "b3", x: 1140, y: 962, w: 260, h: 62, emoji: "♻️", accent: "fill-green-400",
        title: { zh: "③ 重启 + 校验", en: "③ Restart + verify" },
        subs: { zh: ["systemctl + 静态资源检查"], en: ["systemctl + asset consistency"] },
    },
];

type EdgeDef = {
    x1: number; y1: number; x2: number; y2: number;
    lx?: number; ly?: number;
    zh?: string; en?: string;
    dashed?: boolean; flow?: boolean;
};

const EDGES: EdgeDef[] = [
    { x1: 190, y1: 152, x2: 300, y2: 152, flow: true },
    { x1: 440, y1: 200, x2: 575, y2: 322, flow: true },
    { x1: 555, y1: 386, x2: 420, y2: 442 },
    { x1: 610, y1: 386, x2: 650, y2: 442 },
    { x1: 665, y1: 386, x2: 880, y2: 442 },
    {
        x1: 763, y1: 479, x2: 1170, y2: 356, flow: true, lx: 905, ly: 400,
        zh: "SQL over TLS :4000", en: "SQL over TLS :4000",
    },
    {
        x1: 980, y1: 585, x2: 1170, y2: 600, flow: true, lx: 985, ly: 545,
        zh: "rclone 每日上传 · 30 天滚动", en: "rclone daily · 30-day rolling",
    },
    {
        x1: 620, y1: 604, x2: 1170, y2: 770, flow: true, lx: 845, ly: 706,
        zh: "SMTP 通知", en: "SMTP notify",
    },
    {
        x1: 620, y1: 625, x2: 1170, y2: 878, flow: true, lx: 875, ly: 800,
        zh: "bot 推送", en: "bot push",
    },
    { x1: 470, y1: 992, x2: 540, y2: 992, flow: true },
    { x1: 790, y1: 992, x2: 840, y2: 992, flow: true },
    { x1: 1090, y1: 992, x2: 1140, y2: 992, flow: true },
    {
        x1: 1270, y1: 962, x2: 940, y2: 674, dashed: true, lx: 1150, ly: 820,
        zh: "SSH 部署", en: "SSH deploy",
    },
];

function curve(x1: number, y1: number, x2: number, y2: number) {
    if (Math.abs(y2 - y1) < 24) return `M ${x1} ${y1} L ${x2} ${y2}`;
    const cy = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`;
}

function renderLines(
    cx: number, cy: number, lines: string[], fs: number, keyPrefix: string,
) {
    const lineH = fs * 1.4;
    return lines.map((ln, i) => (
        <tspan
            key={`${keyPrefix}-${i}`}
            x={cx}
            y={cy - ((lines.length - 1) / 2 - i) * lineH + fs * 0.35}
        >
            {ln}
        </tspan>
    ));
}

export default function ArchitectureDiagram({ locale }: { locale: string }) {
    const isZh = locale === "zh-CN";
    const t = (b: BoxDef) => (isZh ? b.title.zh : b.title.en);
    const subs = (b: BoxDef) => (isZh ? b.subs.zh : b.subs.en);
    const heading = isZh ? "这个博客是怎么跑起来的" : "How this blog runs";
    const titleText = isZh
        ? "Tunan Blog · 生产架构总览(2026-10)"
        : "Tunan Blog · Production Architecture (2026-10)";
    const visitorText = isZh ? "访客" : "Visitors";
    const macText = isZh ? "开发机 Mac" : "Dev machine";
    const live = isZh ? "全系统运行中" : "All systems operational";
    const footer = isZh
        ? "恢复手册: deploy/backup/README.md · 每月演练: bash /opt/deploy/restore-drill.sh · 架构决策: MIGRATION.md"
        : "Recovery manual: deploy/backup/README.md · Monthly drill: bash /opt/deploy/restore-drill.sh · Decisions: MIGRATION.md";

    const css = `
    .arch-panel { fill: url(#arch-panel-light); }
    .dark .arch-panel { fill: url(#arch-panel-dark); }
    .arch-card { fill: url(#arch-card-light); }
    .dark .arch-card { fill: url(#arch-card-dark); }
    .arch-card-stroke { stroke: #e2e8f0; }
    .dark .arch-card-stroke { stroke: #334155; }
    .arch-panel-stroke { stroke: #cbd5e1; }
    .dark .arch-panel-stroke { stroke: #475569; }
    .arch-line { stroke: #94a3b8; }
    .dark .arch-line { stroke: #64748b; }
    .arch-title { fill: #1e293b; font-weight: 600; }
    .dark .arch-title { fill: #f1f5f9; }
    .arch-sub { fill: #64748b; }
    .dark .arch-sub { fill: #94a3b8; }
    .arch-heading { fill: #0f172a; }
    .dark .arch-heading { fill: #f8fafc; }
    .arch-flow { stroke: #3b82f6; stroke-dasharray: 5 7; animation: arch-flow 1.5s linear infinite; }
    .dark .arch-flow { stroke: #60a5fa; }
    .arch-pulse { animation: arch-pulse 2.4s ease-in-out infinite; }
    @keyframes arch-flow { to { stroke-dashoffset: -12; } }
    @keyframes arch-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }
    @media (prefers-reduced-motion: reduce) {
      .arch-flow, .arch-pulse { animation: none; }
    }`;

    return (
        <section className="rounded-[2rem] border border-gray-100/80 dark:border-gray-800 bg-white/70 dark:bg-gray-900/40 p-4 sm:p-6 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-1">
                <h2 className="text-2xl font-bold font-mono text-gray-800 dark:text-gray-100">
                    {heading}
                </h2>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    {live}
                </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {isZh
                    ? "浏览器可横向滚动查看完整架构(手机端左右滑动) · 蓝色流线 = 数据流向"
                    : "Scroll horizontally for the full architecture (swipe on mobile) · blue streams = data flow"}
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-blue-50/40 via-white/40 to-purple-50/40 dark:from-gray-950/50 dark:via-gray-900/30 dark:to-indigo-950/30">
                <svg
                    viewBox="0 0 1500 1130"
                    className="min-w-[1000px] w-full h-auto font-sans"
                    role="img"
                    aria-label={titleText}
                >
                    <style>{css}</style>
                    <defs>
                        <linearGradient id="arch-card-light" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#ffffff" />
                            <stop offset="1" stopColor="#f1f5f9" />
                        </linearGradient>
                        <linearGradient id="arch-card-dark" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#1e293b" />
                            <stop offset="1" stopColor="#0f172a" />
                        </linearGradient>
                        <linearGradient id="arch-panel-light" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#f8fafc" />
                            <stop offset="1" stopColor="#eef2ff" />
                        </linearGradient>
                        <linearGradient id="arch-panel-dark" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#0f172a" />
                            <stop offset="1" stopColor="#111827" />
                        </linearGradient>
                        <marker id="arch-arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
                            <path d="M0,0 L10,4 L0,8 z" className="fill-slate-500 dark:fill-slate-300" />
                        </marker>
                        <pattern id="arch-dots" width="22" height="22" patternUnits="userSpaceOnUse">
                            <circle cx="1.5" cy="1.5" r="1.2" className="fill-slate-300 dark:fill-slate-700" />
                        </pattern>
                    </defs>

                    <rect x="0" y="0" width="1500" height="1130" fill="url(#arch-dots)" opacity={0.35} />

                    <text x={750} y={46} textAnchor="middle" fontSize={26} className="arch-heading" fontWeight={700}>
                        {titleText}
                    </text>

                    {BOXES.map((b) => {
                        const isPanel = b.id === "vps";
                        const lines = subs(b);
                        const fs = b.fs ?? 15;
                        return (
                            <g key={b.id}>
                                {isPanel && <rect x="0" y="0" width="1500" height="1130" fill="url(#arch-dots)" opacity={0} />}
                                <rect
                                    x={b.x} y={b.y} width={b.w} height={b.h} rx={14} ry={14}
                                    className={`${isPanel ? "arch-panel" : "arch-card"} ${isPanel ? "arch-panel-stroke" : "arch-card-stroke"}`}
                                    strokeWidth={1.5}
                                />
                                <rect x={b.x} y={b.y + 12} width={3.5} height={b.h - 24} rx={1.75} className={b.accent} />
                                {!isPanel && (
                                    <>
                                        <circle cx={b.x + 30} cy={b.y + b.h / 2} r={15} className="fill-slate-100 dark:fill-slate-800" />
                                        <text x={b.x + 30} y={b.y + b.h / 2 + 5.5} textAnchor="middle" fontSize={15}>
                                            {b.emoji}
                                        </text>
                                    </>
                                )}
                                <text
                                    x={b.x + 54}
                                    y={b.y + (isPanel ? 36 : b.h / 2 - (lines.length * 17) / 2 + 5)}
                                    fontSize={isPanel ? 18 : fs + 1}
                                    className={isPanel ? "arch-heading" : "arch-title"}
                                >
                                    {t(b)}
                                </text>
                                {lines.map((ln, i) => (
                                    <text
                                        key={`${b.id}-s-${i}`}
                                        x={b.x + 54}
                                        y={b.y + (isPanel ? 62 : b.h / 2 - (lines.length * 17) / 2 + 23 + i * 17)}
                                        fontSize={12.5}
                                        className="arch-sub"
                                    >
                                        {ln}
                                    </text>
                                ))}
                            </g>
                        );
                    })}

                    {EDGES.map((e, i) => (
                        <g key={`e-${i}`}>
                            <path
                                d={curve(e.x1, e.y1, e.x2, e.y2)}
                                fill="none"
                                strokeWidth={1.4}
                                className={e.dashed ? "arch-line" : "arch-line"}
                                strokeDasharray={e.dashed ? "6 4" : undefined}
                                markerEnd={e.dashed ? undefined : "url(#arch-arrow)"}
                            />
                            {e.flow && (
                                <path
                                    d={curve(e.x1, e.y1, e.x2, e.y2)}
                                    fill="none"
                                    strokeWidth={1.8}
                                    className="arch-flow"
                                />
                            )}
                            {e.zh && (
                                <text x={e.lx} y={e.ly} fontSize={13} className="arch-sub">
                                    {isZh ? e.zh : e.en}
                                </text>
                            )}
                        </g>
                    ))}

                    <g>
                        <rect x={1155} y={20} width={215} height={34} rx={17} className="arch-card arch-card-stroke" strokeWidth={1} />
                        <circle cx={1175} cy={37} r={4.5} className="arch-pulse fill-emerald-500" />
                        <text x={1188} y={41.5} fontSize={13.5} className="arch-title">
                            {live}
                        </text>
                    </g>

                    <text x={300} y={1104} fontSize={13} className="arch-sub">
                        {footer}
                    </text>
                </svg>
            </div>
        </section>
    );
}
