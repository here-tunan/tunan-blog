interface BlogItemProps {
  link: string;
  name: string;
}

export function BlogItem({link, name}: BlogItemProps) {
  return (
    <li className="py-2">
      <a href={link} className="font-medium">
        <span>{name}</span>
      </a>
    </li>
  );
}