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

  return (
    <div className="container">
      <div className="">
        <div>
          <Header title={article.title} date={article.gmtCreate} tags={article.tagNames} path={withLocale(locale, `/blog/${params.slug}`)} locale={locale}/>
        </div>

        <div className="blog-content flex flex-row">
          <div className="w-3/4">
            <Content content={article.content || ''}/>
            <Comments />
          </div>

          <div className="w-1/4 pl-4">
            <div className="sticky top-20 pl-3">
              <TableOfContents content={article.content || ''}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}