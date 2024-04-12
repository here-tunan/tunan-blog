interface ProjectItemProps {
  title: string,
  description: string,
  link: string,
}


export function ProjectItem({title, description}: ProjectItemProps) {
  return (
    <div className="p-5 border border-button-base rounded-lg">
      <a href={`/projects/${title}`} className="hover:underline">
        <h1 className="font-bold">{title}</h1>
      </a>
      <p className="font-light ">{description}</p>
    </div>
  )
}