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
        id: "cf", x: 180, y: 104, w: 310, h: 96, emoji: "☁️", accent: "fill-amber-400",
        title: { zh: "Cloudflare CDN", en: "Cloudflare CDN" },
        subs: {
            zh: ["缓存 · 隐藏主站源站 · SSL Full(strict)", "手动统计 beacon(仅博客页)"],
            en: ["caching · hides origin · SSL Full(strict)", "manual analytics beacon (blog pages only)"],
        },
    },
    {
        id: "vps", x: 160, y: 272, w: 810, h: 402, emoji: "🖥️", accent: "fill-slate-400",
        title: { zh: "VPS · RackNerd 洛杉矶 · Ubuntu 24.04 · 1C2G", en: "VPS · RackNerd Los Angeles · Ubuntu 24.04 · 1C2G" },
        subs: { zh: [], en: [] },
    },
    {
        id: "caddy", x: 450, y: 322, w: 230, h: 64, emoji: "🚦", accent: "fill-blue-400",
        title: { zh: "Caddy 反向代理", en: "Caddy reverse proxy" },
        subs: { zh: [":80/:443 · 自动 HTTPS"], en: [":80/:443 · auto HTTPS"] },
    },
    {
        id: "ui", x: 215, y: 442, w: 215, h: 74, emoji: "🌐", accent: "fill-sky-400",
        title: { zh: "tunan-ui · Next.js", en: "tunan-ui · Next.js" },
        subs: { zh: [":3000 · 博客前台"], en: [":3000 · public site"] },
    },
    {
        id: "blog", x: 453, y: 442, w: 215, h: 74, emoji: "⚙️", accent: "fill-indigo-400",
        title: { zh: "tunan-blog · Go Fiber", en: "tunan-blog · Go Fiber" },
        subs: { zh: [":3002 · API"], en: [":3002 · API"] },
    },
    {
        id: "admin", x: 691, y: 442, w: 215, h: 74, emoji: "🔐", accent: "fill-violet-400",
        title: { zh: "tunan-admin · Next.js", en: "tunan-admin · Next.js" },
        subs: { zh: [":3001 · 管理后台"], en: [":3001 · admin panel"] },
    },
    {
        id: "remark", x: 215, y: 562, w: 310, h: 84, emoji: "💬", accent: "fill-yellow-400",
        title: { zh: "Remark42 v1.18 · Docker", en: "Remark42 v1.18 · Docker" },
        subs: {
            zh: [":8080 · 评论系统", "登录: 匿名/邮箱/GitHub/TG/Google"],
            en: [":8080 · comments", "Login: anon/email/GitHub/TG/Google"],
        },
    },
    {
        id: "backup", x: 553, y: 562, w: 320, h: 84, emoji: "💾", accent: "fill-amber-400",
        title: { zh: "backup.sh · cron 3:15", en: "backup.sh · cron 3:15" },
        subs: {
            zh: ["mysqldump + 评论导出 + 配置打包"],
            en: ["mysqldump + comments + config bundle"],
        },
    },
    {
        id: "tidb", x: 1010, y: 296, w: 300, h: 96, emoji: "🗄️", accent: "fill-green-400",
        title: { zh: "TiDB Cloud Serverless", en: "TiDB Cloud Serverless" },
        subs: {
            zh: ["免费 · us-west-2 · 库 tunan", "MySQL 协议 · 强制 TLS :4000"],
            en: ["free · us-west-2 · db tunan", "MySQL protocol · TLS :4000"],
        },
    },
    {
        id: "r2", x: 1010, y: 556, w: 300, h: 112, emoji: "🪣", accent: "fill-purple-400",
        title: { zh: "Cloudflare R2 · 免费 10GB", en: "Cloudflare R2 · free 10GB" },
        subs: {
            zh: ["桶 blog-backup/", "mysql/ · config/ · remark42/", "30 天滚动保留"],
            en: ["bucket blog-backup/", "mysql/ · config/ · remark42/", "30-day rolling retention"],
        },
    },
    {
        id: "gmail", x: 215, y: 720, w: 310, h: 64, emoji: "📧", accent: "fill-red-400",
        title: { zh: "Gmail SMTP", en: "Gmail SMTP" },
        subs: { zh: ["评论邮件通知"], en: ["comment email notifications"] },
    },
    {
        id: "tg", x: 553, y: 720, w: 320, h: 64, emoji: "✈️", accent: "fill-cyan-400",
        title: { zh: "Telegram 频道", en: "Telegram channel" },
        subs: { zh: ["Blog's notify · 新评论推送"], en: ["Blog's notify · new comment push"] },
    },
    {
        id: "b1", x: 420, y: 962, w: 250, h: 62, emoji: "🏗️", accent: "fill-blue-400",
        title: { zh: "① 本地构建", en: "① Local build" },
        subs: { zh: ["Go 交叉编译 + 2×Next build"], en: ["Go cross-compile + 2×Next build"] },
    },
    {
        id: "b2", x: 720, y: 962, w: 250, h: 62, emoji: "📦", accent: "fill-violet-400",
        title: { zh: "② rsync 产物", en: "② rsync artifacts" },
        subs: { zh: ["→ /opt/tunan-*"], en: ["→ /opt/tunan-*"] },
    },
    {
        id: "b3", x: 980, y: 962, w: 260, h: 62, emoji: "♻️", accent: "fill-green-400",
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
    { x1: 70, y1: 152, x2: 180, y2: 152, flow: true },
    { x1: 335, y1: 200, x2: 565, y2: 322, flow: true },
    { x1: 480, y1: 386, x2: 322, y2: 442 },
    { x1: 565, y1: 386, x2: 560, y2: 442 },
    { x1: 650, y1: 386, x2: 798, y2: 442 },
    {
        x1: 668, y1: 479, x2: 1050, y2: 344, flow: true, lx: 830, ly: 395,
        zh: "SQL over TLS :4000", en: "SQL over TLS :4000",
    },
    {
        x1: 873, y1: 604, x2: 1050, y2: 600, flow: true, lx: 930, ly: 585,
        zh: "rclone 每日上传 · 30 天滚动", en: "rclone daily · 30-day rolling",
    },
    {
        x1: 300, y1: 646, x2: 345, y2: 720, flow: true, lx: 215, ly: 692,
        zh: "SMTP 通知", en: "SMTP notify",
    },
    {
        x1: 440, y1: 646, x2: 700, y2: 720, flow: true, lx: 540, ly: 690,
        zh: "bot 推送", en: "bot push",
    },
    { x1: 670, y1: 993, x2: 720, y2: 993, flow: true },
    { x1: 970, y1: 993, x2: 1020, y2: 993, flow: true },
    {
        x1: 1150, y1: 962, x2: 940, y2: 674, dashed: true, lx: 1120, ly: 820,
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
    const live = isZh ? "全系统运行中" : "All systems operational";
    const scrollHint = isZh
        ? "左右滑动查看全图 · 蓝色流线 = 数据流向"
        : "Swipe horizontally · blue streams = data flow";
    const titleText = isZh
        ? "Tunan Blog · 生产架构总览(2026-10)"
        : "Tunan Blog · Production Architecture (2026-10)";
    const visitorText = isZh ? "访客" : "Visitors";
    const macText = isZh ? "开发机 Mac" : "Dev machine";
    const footer = isZh
        ? "恢复手册: deploy/backup/README.md · 每月演练: bash /opt/deploy/restore-drill.sh"
        : "Recovery manual: deploy/backup/README.md · Monthly drill: bash /opt/deploy/restore-drill.sh";

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
        <section>
            <div className="mb-5 flex justify-end">
                <span className="text-[13px] text-muted-foreground">
                    {scrollHint}
                </span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-border bg-background">
                <svg
                    viewBox="0 0 1340 1130"
                    className="min-w-[880px] w-full h-auto font-sans"
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

                    <rect x="0" y="0" width="1340" height="1130" fill="url(#arch-dots)" opacity={0.35} />

                    <text x={670} y={46} textAnchor="middle" fontSize={26} className="arch-heading" fontWeight={700}>
                        {titleText}
                    </text>

                    <text x={125} y={132} textAnchor="middle" fontSize={13} className="arch-sub">
                        {visitorText}
                    </text>

                    {BOXES.map((b) => {
                        const isPanel = b.id === "vps";
                        const lines = subs(b);
                        const fs = b.fs ?? 15;
                        return (
                            <g key={b.id}>
                                {isPanel && <rect x="0" y="0" width="1340" height="1130" fill="url(#arch-dots)" opacity={0} />}
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
                        <rect x={1035} y={20} width={215} height={34} rx={17} className="arch-card arch-card-stroke" strokeWidth={1} />
                        <circle cx={1055} cy={37} r={4.5} className="arch-pulse fill-emerald-500" />
                        <text x={1068} y={41.5} fontSize={13.5} className="arch-title">
                            {live}
                        </text>
                    </g>

                    <text x={830} y={946} textAnchor="middle" fontSize={13} className="arch-sub">
                        {macText}
                    </text>

                    <text x={160} y={1104} fontSize={13} className="arch-sub">
                        {footer}
                    </text>
                </svg>
            </div>
        </section>
    );
}
