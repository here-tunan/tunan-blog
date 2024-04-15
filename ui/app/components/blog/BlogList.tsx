import { BlogItem } from "./BlogItem";

const blogs = [
  {link: "first", name: "请叫我大美女" },
  {link: "second", name: "请叫我大帅哥" },
  {link: "sasd", name: "haobabbababbabababbabab" },
  {link: "ok", name: "我希望我能变得更好" },
  {link: "not", name: "还不错，我正在学习React" },
]

export default function BlogList() {
  return (
    <ul className="divide-y divide-double divide-emerald-500">
      {blogs.map((item, i) => (
        <BlogItem link={'/blog/' + item.link} name={item.name} key={i}></BlogItem>
      ))}
    </ul>
  );
}