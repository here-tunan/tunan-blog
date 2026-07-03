import { ViewCounter } from "@/app/components/ViewCounter";
import { Locale } from "@/app/i18n/config";
import { formatDate } from "@/app/i18n/format";

type HeaderProps = {
  date: string
  title: string
  tags: string[]
  path: string
  locale: Locale
}

const Header = (props: HeaderProps) => {
  const options = { year: "numeric", month: "long", day: "numeric" } as Intl.DateTimeFormatOptions;
  const date = formatDate(props.date, props.locale, options);
  const tags = props.tags;

  return (
    <header className="blog-header">
      {/*
        标题：现代无衬线（继承 Inter），字重降到 semibold，tracking 收紧一点，
        大屏用 4xl，小屏 3xl 避免撑爆 720px 列宽
      */}
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight text-slate-900 dark:text-slate-100">
        {props.title}
      </h1>

      {/*
        Meta 一行 Substack 风：日期 · 浏览量 · #tag
        使用 · 中点分隔；tag 保留极简药丸（灰底灰字）+ hover 变主色
      */}
      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
        <time>{date}</time>

        <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>

        <span className="inline-flex items-center gap-1">
          <ViewCounter path={props.path} className="font-medium tabular-nums" />
          <span>views</span>
        </span>

        {tags && tags.length > 0 && (
          <>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
            <ul className="flex flex-wrap items-center gap-1.5">
              {tags.map((tag) => (
                <li key={tag}>
                  <span className="inline-block rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">
                    #{tag}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* 装饰短线，为正文创造清晰的呼吸空间；不用满屏 hr，避免和内容里的 hr 冲突 */}
      <div className="mt-8 h-px w-12 bg-slate-200 dark:bg-slate-700" />
    </header>
  );
}

export default Header;