import Header from "@/app/components/blog/header";
import Content from "@/app/components/blog/content";
import TableOfContents from "@/app/components/markdown/toc";
import {Comments} from "@/app/components/blog/comment";
import { notFound } from 'next/navigation';
import { getSafeLocale } from "@/app/i18n/config";
import { withLocale } from "@/app/i18n/routes";
import { getArticle } from "@/lib/articles";

export default async function Page({params}: { params: { locale: string, slug: string } }) {
  const locale = getSafeLocale(params.locale);
  const article = await getArticle({ slug: params.slug, locale });

  if (!article) {
    notFound(); // Triggers the 404 page
  }

  const content = article.content || ''

  return (
    <div className="container">
      {/*
        阅读列：标题、正文、评论共享一条 720px 居中轴。
        relative 让 TOC 桌面版能相对阅读列绝对定位在右侧。
      */}
      <div className="max-w-[720px] mx-auto relative">
        <Header title={article.title} date={article.gmtCreate} tags={article.tagNames} path={withLocale(locale, `/blog/${params.slug}`)} locale={locale}/>

        {/* mt-12 (48px) 拉开 Header 装饰短线到正文的呼吸空间 */}
        <div className="blog-content mt-12">
          <Content content={content} locale={locale}/>
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