import Header from "@/app/blog/[slug]/header";
import Content from "@/app/blog/[slug]/content";
import service from "@/app/api/request";
import TableOfContents from "@/app/components/markdown/toc";
import {Comments} from "@/app/blog/[slug]/comment";

export default async function Page({params}: { params: { slug: string } }) {

  let article = {
    title: '',
    content: '',
    gmtCreate: '',
    tagNames: []
  }


  await service.get('/article', {
    params: {
      slug: params.slug,
    }
  }).then(function (response) {
    // console.log(response.data);
    let data = response.data;
    if (data.success) {
      article = data.data
    }
    console.log(article.title)
    console.log(article.gmtCreate)
  }).catch(function (error) {
    console.log(error);
  });

  return (
    <div className="container">
      <div className="">
        <div>
          <Header title={article.title} date={article.gmtCreate} tags={article.tagNames}/>
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
