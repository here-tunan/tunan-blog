import Header from "@/app/components/blog/header";
import Content from "@/app/components/blog/content";
import TableOfContents from "@/app/components/markdown/toc";
import {Comments} from "@/app/components/blog/comment";
import { API_URL } from "@/lib/config";
import { notFound } from 'next/navigation';

async function getArticle(slug: string) {
  try {
    const response = await fetch(`${API_URL}/article?slug=${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      return null; // Or handle errors more specifically
    }

    const data = await response.json();
    if (data && data.success) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch article:", error);
    return null;
  }
}

export default async function Page({params}: { params: { slug: string } }) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound(); // Triggers the 404 page
  }

  return (
    <div className="container">
      <div className="">
        <div>
          <Header title={article.title} date={article.gmtCreate} tags={article.tagNames} path={`/blog/${params.slug}`}/>
        </div>

        <div className="blog-content flex flex-row">
          <div className="w-3/4">
            <Content content={article.content}/>
            <Comments />
          </div>

          <div className="w-1/4 pl-4">
            <div className="sticky top-20 pl-3">
              <TableOfContents content={article.content}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}