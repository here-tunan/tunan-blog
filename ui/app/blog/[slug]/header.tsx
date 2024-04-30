type HeaderProps = {
  date: string
  title: string
}

const Header = (props: HeaderProps) => {

  // There will be a error without 'as Intl.DateTimeFormatOptions' or 'as const'
  const options = { year: "numeric", month: "long", day: "numeric" } as Intl.DateTimeFormatOptions
  const date = new Date(props.date).toLocaleDateString(undefined, options)

  return (
    <div className="blog-header">
      <h1 className="font-bold font-mono text-4xl">{props.title}</h1>
      <div>
        <p className="font-serif text-sm">{date}</p>
      </div>
    </div>
  );
}

export default Header;