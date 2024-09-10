interface BlogItemProps {
  link: string;
  name: string;
  gmtCreate: string;
  tagNames: string[];
}

export function BlogItem({link, name, gmtCreate, tagNames}: BlogItemProps) {
  // There will be a error without 'as Intl.DateTimeFormatOptions' or 'as const'
  const options = {year: "numeric", month: "long"} as Intl.DateTimeFormatOptions
  const date = new Date(gmtCreate).toLocaleDateString(undefined, options)

  return (
    <li>
      <a className="group py-2 flex place-content-between" href={link}>
        <span className="group-hover:underline underline-offset-4 font-medium font-mono text-lg">{name}</span>
        <div className="flex flex-col items-end">
          <div className="flex gap-1 px-1">
            {tagNames.map((tag) => (
              <span key={tag}
                    className="blog-tag font-light text-xs py-1 px-2 rounded inline-flex items-center font-mono">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p className="font-serif text-1xl ml-auto">{date}</p>
      </a>
    </li>
  );
}