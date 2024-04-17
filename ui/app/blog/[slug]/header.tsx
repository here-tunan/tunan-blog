type HeaderProps = {
  date: string
  title: string
}

const Header = (props: HeaderProps) => {
  return (
    <div className="blog-header">
      <h1>{props.title}</h1>
      <div className="flex">
        <p>
          Published on: {props.date}
        </p>
      </div>
    </div>
  );
}

export default Header;