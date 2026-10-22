'use client';

import React, { useMemo, useState } from 'react';
import { useLocale } from '@/app/i18n/locale-context';
import { Dictionary } from '@/app/i18n/get-dictionary';

interface Book {
    id: number;
    name: string;
    author: string;
    category: string;
    douban_link: string | null;
    my_review: string | null;
    score: number;
    gmt_create: string;
    gmt_modified: string;
    is_deleted: boolean;
}

// 书脊色板:去饱和的纸墨系,按书名哈希取色,同一本书永远同一根脊
const SPINE_COLORS = ['#8a8578', '#5f7a6a', '#9a6b5b', '#566b8a', '#7a6a8a', '#b08d57', '#4f46e5', '#3a3833'];

function hashCode(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = (h << 5) - h + s.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h);
}

const Star = ({ filled }: { filled: boolean }) => (
    <svg width="13" height="13" viewBox="0 0 24 24" className="text-primary" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
);

const ShelfStyles = () => (
    <style jsx>{`
        @keyframes book-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .shelf-book {
            animation: book-in 0.4s ease-out backwards;
        }
        @media (prefers-reduced-motion: reduce) {
            .shelf-book { animation: none; }
        }
    `}</style>
);

export default function Bookshelf({ books }: { books: Book[] }) {
    const { dictionary } = useLocale();
    const [selected, setSelected] = useState<Book | null>(null);

    // 同一本书出现在多个分类时只保留第一次出现
    const grouped = useMemo(() => {
        const seen = new Set<string>();
        const unique = books.filter((b) => {
            if (seen.has(b.name)) return false;
            seen.add(b.name);
            return true;
        });
        return unique.reduce((acc: Record<string, Book[]>, book) => {
            (acc[book.category] ||= []).push(book);
            return acc;
        }, {} as Record<string, Book[]>);
    }, [books]);

    const categories = Object.keys(grouped);

    if (categories.length === 0) {
        return (
            <div className="rounded-xl border border-border bg-background py-12 text-center text-sm text-muted-foreground">
                No books yet
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <ShelfStyles />

            {categories.map((category, ci) => (
                <div key={category}>
                    <h3 className="mb-4 text-[15px] font-medium text-foreground">
                        {category}
                        <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">
                            {grouped[category].length}
                        </span>
                    </h3>

                    {/* 一排搁板 */}
                    <div className="overflow-x-auto pb-1">
                        <div className="flex items-end gap-[6px] px-2">
                            {grouped[category].map((book, bi) => {
                                const h = hashCode(book.name);
                                const height = 128 + (h % 48);
                                const width = 34 + (hashCode(book.name + 'w') % 10);
                                const color = SPINE_COLORS[h % SPINE_COLORS.length];
                                return (
                                    <button
                                        key={book.id}
                                        type="button"
                                        onClick={() => setSelected(book)}
                                        title={book.name}
                                        aria-label={book.name}
                                        className="shelf-book relative shrink-0 cursor-pointer rounded-[3px] shadow-[inset_-2px_0_3px_rgba(0,0,0,0.18),inset_1px_0_1px_rgba(255,255,255,0.12)] transition-transform duration-200 ease-out hover:-translate-y-2 hover:rotate-[-3deg] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-0"
                                        style={{
                                            height,
                                            width,
                                            background: color,
                                            transformOrigin: 'bottom center',
                                            animationDelay: `${(ci * 3 + bi) * 40}ms`,
                                        }}
                                    >
                                        {/* 书脊凹槽 */}
                                        <span aria-hidden="true" className="absolute inset-y-1.5 left-[5px] w-px bg-white/15" />
                                        {/* 竖排书名 */}
                                        <span className="absolute inset-0 flex items-start justify-center overflow-hidden px-0.5 pt-2">
                                            <span
                                                className="max-h-[calc(100%-12px)] overflow-hidden text-[11px] leading-[1.15] tracking-[0.12em] text-[#faf9f5]"
                                                style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
                                            >
                                                {book.name}
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        {/* 搁板 */}
                        <div className="mx-1 h-[3px] rounded-full bg-foreground/75" />
                        <div className="mx-3 h-[2px] rounded-full bg-foreground/10" />
                    </div>
                </div>
            ))}

            {/* 详情卡 */}
            {selected && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="w-full max-w-xs rounded-xl border border-border bg-background p-6 text-center shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="font-display text-xl leading-snug text-foreground">{selected.name}</h3>
                        <p className="mt-1.5 text-sm text-muted-foreground">{selected.author}</p>
                        <div className="mt-3 flex justify-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} filled={i < selected.score}/>
                            ))}
                        </div>
                        <div className="mt-5 flex flex-col space-y-2.5">
                            {selected.douban_link && (
                                <a
                                    href={selected.douban_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                                >
                                    {dictionary.about.doubanBooks}
                                </a>
                            )}
                            {selected.my_review && (
                                <a
                                    href={selected.my_review}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full rounded-lg border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-accent"
                                >
                                    {dictionary.about.myReview}
                                </a>
                            )}
                            {!selected.douban_link && !selected.my_review && (
                                <p className="text-xs text-muted-foreground">{dictionary.about.reviewAvailable}</p>
                            )}
                        </div>
                        <button
                            onClick={() => setSelected(null)}
                            className="mt-5 w-full rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
                        >
                            {dictionary.about.cancel}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
