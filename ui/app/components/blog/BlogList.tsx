import { Locale } from "@/app/i18n/config";
import { withLocale } from "@/app/i18n/routes";
import { BlogItem } from "./BlogItem";

type Blog = {
  slug: string,
  title: string,
  gmtCreate: string,
  tagNames: string[],
}

interface BlogListProps {
  blogs: Blog[];
  locale: Locale;
}

export default function BlogList({blogs, locale}: BlogListProps) {
  return (
    <ul className="divide-y divide-double divide-emerald-700">
      {blogs.map((item, i) => (
        <BlogItem link={withLocale(locale, `/blog/${item.slug}`)} name={item.title} gmtCreate={item.gmtCreate} tagNames={item.tagNames} locale={locale} key={i}></BlogItem>
      ))}
    </ul>
  );
}