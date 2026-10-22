'use client'

import React from 'react';

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
    return (
        <div className="space-y-8">
            {Object.entries(devicesAndApps).map(([category, items]) => (
                <div key={category}>
                    <h3 className="mb-3 text-[15px] font-medium text-foreground">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                        {items.map((item) => {
                            const cls = "inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground";
                            const inner = (
                                <>
                                    {item.icon && <span aria-hidden="true" className="text-[15px]">{item.icon}</span>}
                                    <span className="truncate">{item.name}</span>
                                </>
                            );
                            return item.link ? (
                                <a
                                    key={item.id}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={item.description}
                                    className={cls}
                                >
                                    {inner}
                                </a>
                            ) : (
                                <span key={item.id} title={item.description} className={cls}>
                                    {inner}
                                </span>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
