import { BlogItem } from "./BlogItem";

type Blog = {
  slug: string,
  title: string
}

interface BlogListProps {
  blogs: Blog[];
}

export default function BlogList({blogs}: BlogListProps) {
  return (
    <ul className="divide-y divide-double divide-emerald-500">
      {blogs.map((item, i) => (
        <BlogItem link={'/blog/' + item.slug} name={item.title} key={i}></BlogItem>
      ))}
    </ul>
  );
}