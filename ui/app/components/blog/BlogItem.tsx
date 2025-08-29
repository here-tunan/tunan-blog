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
    <li className="border-b border-gray-100 dark:border-gray-800 last:border-0">
      <a className="group py-3 px-2 -mx-2 flex place-content-between rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200" href={link}>
        <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium font-mono text-sm sm:text-base transition-colors duration-200">{name}</span>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-1">
            {tagNames.map((tag) => (
              <span key={tag}
                    className="blog-tag font-light text-xs py-1 px-2 rounded-full inline-flex items-center font-mono opacity-80 group-hover:opacity-100 transition-opacity">
                {tag}
              </span>
            ))}
          </div>
          <p className="font-serif text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{date}</p>
        </div>
      </a>
    </li>
  );
}