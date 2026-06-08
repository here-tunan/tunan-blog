'use client'

import React from 'react';
import { useLocale } from '@/app/i18n/locale-context';

interface DeviceApp {
    id: number;
    name: string;
    category: string;
    description?: string;
    icon?: string;
    link?: string;
    sort_order: number;
}

export default function DevicesAndApps({ devicesAndApps }: { devicesAndApps: Record<string, DeviceApp[]> }) {
    const { dictionary } = useLocale();

    return (
        <section className="relative overflow-hidden rounded-[2rem] border border-gray-100/80 dark:border-gray-800 bg-gradient-to-br from-blue-50/60 via-white/70 to-cyan-50/60 dark:from-blue-950/15 dark:via-gray-950/40 dark:to-cyan-950/15 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="relative">
                <h3 className="font-mono font-bold text-2xl pb-6">{dictionary.about.devicesAndApps}</h3>
                <div className="space-y-6">
                    {Object.entries(devicesAndApps).map(([category, items]) => (
                        <div key={category}>
                            <h4 className="mb-3 inline-flex rounded-full bg-white/70 dark:bg-gray-900/60 px-3 py-1 text-sm font-semibold shadow-sm border border-gray-100 dark:border-gray-800">
                                {category}
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {items.map((item) => (
                                    <div key={item.id} className="rounded-2xl border border-white/60 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 p-3 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                                        {item.link ? (
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 no-underline hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium"
                                            >
                                                {item.icon && <span className="text-lg">{item.icon}</span>}
                                                <span className="truncate">{item.name}</span>
                                            </a>
                                        ) : (
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                {item.icon && <span className="text-lg">{item.icon}</span>}
                                                <span className="truncate">{item.name}</span>
                                            </div>
                                        )}
                                        {item.description && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
