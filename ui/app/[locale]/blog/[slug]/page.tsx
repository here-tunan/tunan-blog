import { cache } from 'react';
import type { Metadata } from 'next';
import Header from "@/app/components/blog/header";
import Content from "@/app/components/blog/content";
import TableOfContents from "@/app/components/markdown/toc";
import {Comments} from "@/app/components/blog/comment";
import SeriesNav from "@/app/components/blog/SeriesNav";
import RelatedPosts from "@/app/components/blog/RelatedPosts";
import { notFound } from 'next/navigation';
import { getSafeLocale, Locale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";
import { formatDate } from "@/app/i18n/format";
import { withLocale } from "@/app/i18n/routes";
import { getArticle, getArticles, ARTICLE_TYPES } from "@/lib/articles";

// 分享摘要:去代码块/图片/链接标记后取开头 100 字
function excerpt(md: string, len = 100): string {
  const text = (md || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > len ? text.slice(0, len) + '…' : text;
}

// generateMetadata 与页面体共用同一次请求
const getArticleCached = cache((slug: string, locale: Locale) => getArticle({ slug, locale }));
const listBlogs = cache((locale: Locale) =>
  getArticles({ locale, type: ARTICLE_TYPES.blog, pageSize: 999, pageIndex: 1 }));

export async function generateMetadata(
  { params }: { params: { locale: string; slug: string } },
): Promise<Metadata> {
  const locale = getSafeLocale(params.locale);
  const article = await getArticleCached(params.slug, locale);
  if (!article) return {};
  const description = excerpt(article.content);
  return {
    title: `${article.title} · Tunan`,
    description,
    openGraph: {
      title: article.title,
      description,
      type: 'article',
      publishedTime: article.gmtCreate,
      tags: article.tagNames,
      images: ['/assets/og-card.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
    },
  };
}

export default async function Page({params}: { params: { locale: string, slug: string } }) {
  const locale = getSafeLocale(params.locale);
  const dictionary = getDictionary(locale);
  const article = await getArticleCached(params.slug, locale);

  if (!article) {
    notFound(); // Triggers the 404 page
  }

  const content = article.content || ''
  const blogs = await listBlogs(locale);

  // 系列:slug 以 -数字 结尾的自动归族(mcp-series-01/02 → mcp-series 族)
  const seriesMatch = params.slug.match(/^(.*)-(\d+)$/);
  const series = seriesMatch
    ? blogs
        .flatMap(b => {
          const base = seriesMatch[1];
          if (!b.slug.startsWith(base + '-')) return [];
          const rest = b.slug.slice(base.length + 1);
          if (!/^\d+$/.test(rest)) return [];
          return [{ slug: b.slug, title: b.title, num: Number(rest) }];
        })
        .sort((a, b) => a.num - b.num)
    : [];

  // 相关文章:标签重合度优先,其次新近
  const myTags = new Set(article.tagNames || []);
  const related = blogs
    .filter(b => b.slug !== params.slug)
    .map(b => ({ ...b, shared: (b.tagNames || []).filter(t => myTags.has(t)).length }))
    .filter(b => b.shared > 0)
    .sort((a, b) => b.shared - a.shared || +new Date(b.gmtCreate) - +new Date(a.gmtCreate))
    .slice(0, 3);

  return (
    <div className="container">
      {/*
        阅读列：标题、正文、评论共享一条 720px 轴。
        不居中(mx-auto),左缘与全站容器/导航对齐——右侧空隙交给 TOC,
        非对称但刻意的编辑部排版;行宽 720px 不变,中文阅读节奏不受影响。
        relative 让 TOC 桌面版能相对阅读列绝对定位在右侧。
      */}
      <div className="max-w-[720px] relative">
        <Header title={article.title} date={article.gmtCreate} tags={article.tagNames} path={withLocale(locale, `/blog/${params.slug}`)} locale={locale}/>

        {series.length > 1 && (
          <SeriesNav
            label={dictionary.article.series}
            items={series.map(s => ({
              href: s.slug === params.slug ? null : withLocale(locale, `/blog/${s.slug}`),
              title: s.title,
            }))}
          />
        )}

        {/* mt-12 (48px) 拉开 Header 装饰短线到正文的呼吸空间 */}
        <div className="blog-content mt-12">
          <Content content={content} locale={locale}/>

          {related.length > 0 && (
            <RelatedPosts
              label={dictionary.article.related}
              items={related.map(r => ({
                href: withLocale(locale, `/blog/${r.slug}`),
                title: r.title,
                date: formatDate(r.gmtCreate, locale, { year: 'numeric', month: 'long' }),
              }))}
            />
          )}

          <Comments />
        </div>

        {/*
          TOC 自适应布局：
          - 桌面 (>=xl 1280px)：内嵌右侧，贴阅读列 32px
          - 小屏：右下角悬浮按钮 → 抽屉展开
          组件内部自己处理，父组件不需要关心
        */}
        <TableOfContents content={content}/>
      </div>
    </div>
  )
}
