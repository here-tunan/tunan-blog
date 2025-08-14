import { ViewCounter } from "@/app/components/ViewCounter";

type HeaderProps = {
  date: string
  title: string
  tags: string[]
  path: string
}

const Header = (props: HeaderProps) => {

  const options = { year: "numeric", month: "long", day: "numeric" } as Intl.DateTimeFormatOptions;
  const date = new Date(props.date).toLocaleDateString(undefined, options);
  const tags = props.tags;

  return (
    <div className="blog-header">
      <h1 className="font-bold font-mono text-4xl mb-4">{props.title}</h1>

      {/* Meta-information line */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
        {/* Date */}
        <p className="font-serif">{date}</p>

        {/* Views */}
        <div className="flex items-center gap-1 font-serif">
          <span>👀</span>
          <ViewCounter path={props.path} className="font-medium" />
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <div key={tag}
                   className="px-3 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full">
                #{tag}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
