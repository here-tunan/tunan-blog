interface TranslationItemProps {
  link: string;
  name: string;
  gmtCreate: string;
  tagNames: string[];
}

export function TranslationItem({link, name, gmtCreate, tagNames}: TranslationItemProps) {
  const options = {year: "numeric", month: "long"} as Intl.DateTimeFormatOptions
  const date = new Date(gmtCreate).toLocaleDateString(undefined, options)

  return (
    <li className="border-b border-gray-100 dark:border-gray-800 last:border-0">
      <a className="group py-3 px-2 -mx-2 flex place-content-between rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-200" href={link}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Translation indicator */}
          <div className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600 dark:text-purple-400">
              <path d="m5 8 6 6"/>
              <path d="m4 14 6-6 2-3"/>
              <path d="M2 5h12"/>
              <path d="M7 2h1"/>
              <path d="m22 22-5-10-5 10"/>
              <path d="M14 18h6"/>
            </svg>
          </div>
          <span className="group-hover:text-purple-600 dark:group-hover:text-purple-400 font-medium font-mono text-sm sm:text-base transition-colors duration-200 truncate">{name}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden sm:flex gap-1">
            {tagNames.map((tag) => (
              <span key={tag}
                    className="text-xs py-1 px-2 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 font-mono opacity-80 group-hover:opacity-100 transition-opacity">
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