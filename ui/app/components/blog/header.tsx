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
      {/* 标题:文楷 400,靠字号而非字重建立层级(globals h1 规则给 WenKai 与负字距) */}
      <h1 className="text-3xl font-normal leading-snug text-foreground md:text-4xl">
        {props.title}
      </h1>

      {/* Meta 一行:日期 · 浏览量 · #tag */}
      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-muted-foreground">
        <time className="font-mono">{date}</time>

        <span aria-hidden="true" className="text-border">·</span>

        <span className="inline-flex items-center gap-1">
          <ViewCounter path={props.path} className="font-medium tabular-nums" />
          <span>views</span>
        </span>

        {tags && tags.length > 0 && (
          <>
            <span aria-hidden="true" className="text-border">·</span>
            <ul className="flex flex-wrap items-center gap-1.5">
              {tags.map((tag) => (
                <li key={tag}>
                  <span className="inline-block rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
                    #{tag}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* 装饰短线,为正文创造呼吸空间;不用满屏 hr,避免和内容里的 hr 冲突 */}
      <div className="mt-8 h-px w-12 bg-border" />
    </header>
  );
}

export default Header;
