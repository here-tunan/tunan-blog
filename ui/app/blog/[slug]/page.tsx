import Header from "@/app/blog/[slug]/header";
import Content from "@/app/blog/[slug]/content";
import service from "@/app/api/request";

export default async function Page({params}: { params: { slug: string } }) {

  let article = {
    title: '',
    content: '',
    gmtCreate: ''
  }

  await service.get('/article', {
    params: {
      slug: params.slug,
    }
  })
    .then(function (response) {
      console.log(response.data);
      let data = response.data;
      if (data.success) {
        article = data.data
      }
      console.log(article.title)
      console.log(article.gmtCreate)
    })
    .catch(function (error) {
      console.log(error);
    });

  return (
    <div className="container">
      <Header title={article.title} date={article.gmtCreate}/>

      <Content content={article.content}/>
    </div>
  )
}