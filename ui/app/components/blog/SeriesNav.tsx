import Link from "next/link";

interface SeriesItem {
    href: string | null; // null = 当前篇
    title: string;
}

interface SeriesNavProps {
    label: string;
    items: SeriesItem[];
}

// 系列小目录:slug 以 -数字 结尾的自动归族(如 mcp-series-01/02)。
// 列出全部篇目,当前篇靛蓝标记且不可点,其余可跳转。
export default function SeriesNav({ label, items }: SeriesNavProps) {
    const currentIndex = items.findIndex(item => item.href === null);

    return (
        <nav aria-label={label} className="mt-6 rounded-xl border border-border bg-accent/40 px-4 py-3">
            <p className="flex items-center gap-2 text-[13px] text-accent-foreground">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
                {label}
                {currentIndex >= 0 && ` · ${currentIndex + 1}/${items.length}`}
            </p>
            <ol className="mt-2 space-y-1">
                {items.map((item, i) => (
                    <li key={i}>
                        {item.href === null ? (
                            <span
                                aria-current="page"
                                className="flex items-center gap-2 text-sm font-medium text-primary"
                            >
                                <span className="font-mono text-xs">{String(i + 1).padStart(2, '0')}</span>
                                <span className="min-w-0 truncate">{item.title}</span>
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                <span className="font-mono text-xs">{String(i + 1).padStart(2, '0')}</span>
                                <span className="min-w-0 truncate">{item.title}</span>
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
