import { BlogItem } from "./BlogItem";

type Blog = {
  slug: string,
  title: string,
  gmtCreate: string,
}

interface BlogListProps {
  blogs: Blog[];
}

export default function BlogList({blogs}: BlogListProps) {
  return (
    <ul className="divide-y divide-double divide-emerald-700">
      {blogs.map((item, i) => (
        <BlogItem link={'/blog/' + item.slug} name={item.title} gmtCreate={item.gmtCreate} key={i}></BlogItem>
      ))}
    </ul>
  );
}