'use client'

import React from "react";
import { useLocale } from "@/app/i18n/locale-context";

const skills = [
    {
        name: "java",
        href: "https://www.java.com",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg"
    },
    {
        name: "spring",
        href: "https://spring.io/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/spring/spring-original.svg"
    },
    {
        name: "linux",
        href: "https://www.linux.org/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg"
    },
    {
        name: "redis",
        href: "https://redis.io",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original-wordmark.svg"
    },
    {
        name: "mysql",
        href: "https://www.mysql.com/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg"
    },
    {
        name: "mongodb",
        href: "https://www.mongodb.com/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg"
    },
    {name: "git", href: "https://git-scm.com/", img: "https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg"},
    {
        name: "docker",
        href: "https://www.docker.com/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg"
    },
    {
        name: "kubernetes",
        href: "https://kubernetes.io",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/kubernetes/kubernetes-plain.svg"
    },
    {
        name: "python",
        href: "https://www.python.org",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg"
    },
    {
        name: "go",
        href: "https://golang.org/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original.svg"
    },
    {
        name: "vuejs",
        href: "https://vuejs.org/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original.svg"
    },
    {
        name: "react",
        href: "https://reactjs.org/",
        img: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg"
    },
    {
        name: "javascript",
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
        <div className="rounded-3xl border border-white/60 dark:border-gray-800 bg-white/60 dark:bg-gray-900/45 p-5 shadow-sm">
            <svg viewBox="0 0 240 240" className="mx-auto h-72 w-full max-w-[320px] overflow-visible">
                <defs>
                    <linearGradient id="skillRadarFill" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.42" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.32" />
                    </linearGradient>
                    <linearGradient id="skillRadarStroke" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#9333ea" />
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
                            strokeOpacity="0.12"
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
                            strokeOpacity="0.10"
                            strokeWidth="1"
                        />
                    );
                })}

                <polygon
                    points={polygonPoints}
                    fill="url(#skillRadarFill)"
                    stroke="url(#skillRadarStroke)"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                />

                {data.map((item, index) => {
                    const point = getPoint(item.value, index, total);
                    const label = getAxisPoint(index, total, 108);
                    return (
                        <g key={item.label}>
                            <circle cx={point.x} cy={point.y} r="4" fill="#2563eb" className="dark:fill-blue-300" />
                            <text
                                x={label.x}
                                y={label.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="fill-gray-600 text-[10px] font-semibold dark:fill-gray-300"
                            >
                                {item.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

export default function Skills() {
    const { locale, dictionary } = useLocale();

    return (
        <section className="relative overflow-hidden rounded-[2rem] border border-gray-100/80 dark:border-gray-800 bg-gradient-to-br from-gray-50/70 via-white/70 to-gray-100/70 dark:from-gray-900/30 dark:via-gray-950/40 dark:to-gray-900/30 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
            <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-blue-200/20 blur-3xl" />
            <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-purple-200/20 blur-3xl" />
            <div className="relative">
                <h3 className="font-mono font-bold text-2xl pb-6">{dictionary.about.skills}</h3>
                <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <SkillRadar locale={locale} />

                    <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {skills.map((item, index) => (
                            <a href={item.href} key={index}
                               className="group rounded-2xl border border-white/60 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 p-3 flex items-center justify-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:bg-white dark:hover:bg-gray-800">
                                <img src={item.img} width={36} height={36} alt={item.name} className="transition-transform duration-300 group-hover:scale-110" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}