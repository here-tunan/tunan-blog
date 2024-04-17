import Header from "@/app/blog/[slug]/header";
import Content from "@/app/blog/[slug]/content";

export default function Page({params}: { params: { slug: string } }) {
  const title = params.slug;


  return (
    <div className="container">
      <Header title={title} date="2024"/>

      <Content content="ahhaha" />
    </div>
  )
}