import Link from "next/link";

interface RelatedItem {
    href: string;
    title: string;
    date: string;
}

// 文末相关文章:按标签重合度取前三篇,样式与评论区分隔一致(发丝线 + uppercase 小标)
export default function RelatedPosts({ label, items }: { label: string; items: RelatedItem[] }) {
    return (
        <section className="mt-16 mb-6 border-t border-border pt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {label}
            </p>
            <ul>
                {items.map((item) => (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            className="group -mx-2 flex place-content-between rounded-lg px-2 py-3 transition-colors hover:bg-foreground/[0.04]"
                        >
                            <span className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary sm:text-base">
                                {item.title}
                            </span>
                            <span className="whitespace-nowrap font-mono text-sm text-muted-foreground">
                                {item.date}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
