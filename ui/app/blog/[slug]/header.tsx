type HeaderProps = {
  date: string
  title: string
  tags: string[]
}

const Header = (props: HeaderProps) => {

  // There will be a error without 'as Intl.DateTimeFormatOptions' or 'as const'
  const options = { year: "numeric", month: "long", day: "numeric" } as Intl.DateTimeFormatOptions
  const date = new Date(props.date).toLocaleDateString(undefined, options)
  const tags = props.tags

  return (
    <div className="blog-header">
      <h1 className="font-bold font-mono text-4xl">{props.title}</h1>
      <div className="mt-2">
        <p className="font-serif text-sm">{date}</p>
      </div>

      <div className="flex gap-2 mt-3 flex-wrap">
        {tags.map((tag) => (
          <button key={tag}
                  className="blog-tag hover:bg-gray-300 font-medium text-sm py-1 px-3 rounded inline-flex">
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Header;