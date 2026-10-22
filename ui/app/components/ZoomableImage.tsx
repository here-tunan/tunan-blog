'use client'

import React, { useEffect, useState } from 'react';

interface ZoomableImageProps {
    src?: string;
    alt?: string;
    title?: string;
}

// 文章图片:alt 渲染为图注,点击弹出全屏原图(Esc/点击关闭)
export default function ZoomableImage({ src, alt, title }: ZoomableImageProps) {
    const [open, setOpen] = useState(false);
    // 截图工具默认文件名(image-2025…/IMG_1234/x.png)不算图注
    const looksLikeFilename =
        !!alt &&
        (/^(img|image|screenshot|screen[_ -]?shot|截图|微信图片|photo)[\s\-_.]?\d*[-_.]?\d*(\.\w+)?$/i.test(alt.trim()) ||
            /\.(png|jpe?g|gif|webp|avif)$/i.test(alt.trim()));
    const caption = alt && alt.trim() && !looksLikeFilename ? alt.trim() : '';

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!src) return null;

    return (
        <figure className="my-6">
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={caption || '查看大图'}
                className="block w-full cursor-zoom-in"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={src}
                    alt={alt || ''}
                    title={title}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto h-auto max-w-full rounded-lg outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
                />
            </button>
            {caption && (
                <figcaption className="mt-2.5 text-center text-[13px] leading-5 text-muted-foreground">
                    {caption}
                </figcaption>
            )}

            {open && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={caption || '图片查看'}
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 cursor-zoom-out animate-in fade-in duration-150"
                    onClick={() => setOpen(false)}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={src}
                        alt={alt || ''}
                        className="max-h-[94vh] max-w-[96vw] rounded-md object-contain"
                    />
                    {caption && (
                        <p className="absolute bottom-5 left-0 right-0 text-center text-sm text-white/80">
                            {caption}
                        </p>
                    )}
                </div>
            )}
        </figure>
    );
}
