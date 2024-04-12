import {ProjectItem} from "@/app/components/project/ProjectItem";

const projectList = [
  {title: "Hope Is the Key", description: "这是我的第一个项目", link: "/123", img: ""},
  {title: "项目二", description: "这个项目的描述将特别asadsasdasdadasdasdadasda的长深爱的啊是的爱上大是的啊是的啊是的爱上大是大是的啊是的阿斯顿啊是的爱上的啊s 这个项目的描述将特别的长深爱的啊是的爱上大是的啊是的啊是的爱上大是大是的啊是的阿斯顿啊是的爱上的啊sda", link: "asd", img: ""},
  {title: "项目三", description: "", link: "", img: ""},
  {title: "我的标题很长我的标题很长我的标题很长我的标题很长我的标题很长我的标题很长我的标题很长我的标题很长我的标题很长", description: "", link: "", img: ""},
]


export default function ProjectGrid() {
  return (
    <div className={`grid ${ projectList.length > 4 ? 'grid-cols-3' : 'grid-cols-2'} gap-3 `}>
      {projectList.map((project, index) => (
        <ProjectItem title={project.title} description={project.description} link={project.link} key={index}/>
      ))}
    </div>
  )
}