'use client'

import React from "react";
import { useLocale } from "@/app/i18n/locale-context";

const skills = [
    {
        name: "java",
        label: "Java",
        href: "https://www.java.com",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg"
    },
    {
        name: "spring",
        label: "Spring",
        href: "https://spring.io/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/spring/spring-original.svg"
    },
    {
        name: "linux",
        label: "Linux",
        href: "https://www.linux.org/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg"
    },
    {
        name: "redis",
        label: "Redis",
        href: "https://redis.io",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original-wordmark.svg"
    },
    {
        name: "mysql",
        label: "MySQL",
        href: "https://www.mysql.com/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg"
    },
    {
        name: "mongodb",
        label: "MongoDB",
        href: "https://www.mongodb.com/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg"
    },
    {name: "git", label: "Git", href: "https://git-scm.com/", img: "https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg"},
    {
        name: "docker",
        label: "Docker",
        href: "https://www.docker.com/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg"
    },
    {
        name: "kubernetes",
        label: "Kubernetes",
        href: "https://kubernetes.io",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/kubernetes/kubernetes-plain.svg"
    },
    {
        name: "python",
        label: "Python",
        href: "https://www.python.org",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg"
    },
    {
        name: "go",
        label: "Go",
        href: "https://golang.org/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original.svg"
    },
    {
        name: "vuejs",
        label: "Vue",
        href: "https://vuejs.org/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original.svg"
    },
    {
        name: "react",
        label: "React",
        href: "https://reactjs.org/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg"
    },
    {
        name: "javascript",
        label: "JavaScript",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg"
    },
];

function getPoint(value: number, index: number, total: number, radius = 86) {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const scaledRadius = radius * (value / 100);
    return {
        x: 120 + Math.cos(angle) * scaledRadius,
        y: 120 + Math.sin(angle) * scaledRadius,
    };
}

function getAxisPoint(index: number, total: number, radius = 86) {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    return {
        x: 120 + Math.cos(angle) * radius,
        y: 120 + Math.sin(angle) * radius,
    };
}

function SkillRadar({ locale }: { locale: string }) {
    const data = locale === 'zh-CN'
        ? [
            { label: '后端', value: 92 },
            { label: '数据库', value: 82 },
            { label: 'DevOps', value: 74 },
            { label: '前端', value: 68 },
            { label: 'AI 工具', value: 78 },
            { label: '写作', value: 72 },
        ]
        : [
            { label: 'Backend', value: 92 },
            { label: 'Database', value: 82 },
            { label: 'DevOps', value: 74 },
            { label: 'Frontend', value: 68 },
            { label: 'AI Tools', value: 78 },
            { label: 'Writing', value: 72 },
        ];

    const total = data.length;
    const gridLevels = [0.25, 0.5, 0.75, 1];
    const polygonPoints = data
        .map((item, index) => getPoint(item.value, index, total))
        .map((point) => `${point.x},${point.y}`)
        .join(' ');

    return (
        <svg
            viewBox="0 0 240 240"
            className="mx-auto h-72 w-full max-w-[320px] overflow-visible text-muted-foreground"
            role="img"
            aria-label={locale === 'zh-CN' ? '技能雷达图' : 'Skills radar chart'}
        >
            <defs>
                <linearGradient id="skillRadarFill" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.14" />
                </linearGradient>
            </defs>

            {gridLevels.map((level) => {
                const points = data
                    .map((_, index) => getAxisPoint(index, total, 86 * level))
                    .map((point) => `${point.x},${point.y}`)
                    .join(' ');

                return (
                    <polygon
                        key={level}
                        points={points}
                        fill="none"
                        stroke="currentColor"
                        strokeOpacity="0.35"
                        strokeWidth="1"
                    />
                );
            })}

            {data.map((_, index) => {
                const point = getAxisPoint(index, total);
                return (
                    <line
                        key={index}
                        x1="120"
                        y1="120"
                        x2={point.x}
                        y2={point.y}
                        stroke="currentColor"
                        strokeOpacity="0.25"
                        strokeWidth="1"
                    />
                );
            })}

            <polygon
                points={polygonPoints}
                fill="url(#skillRadarFill)"
                className="stroke-primary"
                strokeWidth="2.5"
                strokeLinejoin="round"
            />

            {data.map((item, index) => {
                const point = getPoint(item.value, index, total);
                const label = getAxisPoint(index, total, 108);
                return (
                    <g key={item.label}>
                        <circle cx={point.x} cy={point.y} r="4" className="fill-primary" />
                        <text
                            x={label.x}
                            y={label.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-foreground text-[11px] font-medium"
                        >
                            {item.label}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

export default function Skills() {
    const { locale } = useLocale();

    return (
        <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:items-center">
            <SkillRadar locale={locale} />

            <div className="flex flex-wrap content-start gap-2.5">
                {skills.map((item) => (
                    <a
                        href={item.href}
                        key={item.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
                    >
                        <img src={item.img} width={18} height={18} alt="" loading="lazy" className="shrink-0" />
                        <span>{item.label}</span>
                    </a>
                ))}
            </div>
        </div>
    );
}
