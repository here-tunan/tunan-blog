import React from "react";

export default function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
    return (
        <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-border pb-3">
            <h2 className="font-display text-2xl text-foreground">{title}</h2>
            {action ?? (sub && (
                <span className="hidden text-[13px] text-muted-foreground sm:inline">{sub}</span>
            ))}
        </div>
    );
}
