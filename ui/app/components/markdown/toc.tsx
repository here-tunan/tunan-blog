import GithubSlugger from 'github-slugger'
import '../../toc.css'

type TocContent = {
  level: number
  id: number
  title: string
  anchor: string
}

interface ArticleProps {
  content: string;
}

const TableOfContents = ({content}: ArticleProps) => {
  // remove the special elements
  const regexReplaceCode = /(```.+?```)/gms
  const regexRemoveLinks = /\[(.*?)\]\(.*?\)/g
  const markdownWithoutLinks = content.replace(regexRemoveLinks, "")
  const markdownWithoutCodeBlocks =  markdownWithoutLinks.replace(regexReplaceCode, "")

  // filter the headers
  const regXHeader = /#{1,6}\s.+/g
  const titles = markdownWithoutCodeBlocks.match(regXHeader)

  const toc:TocContent[] = [];

  let globalID = 0
  const slugger = new GithubSlugger()



  titles?.map((tempTitle, i) => {
    const level = (tempTitle?.match(/#/g) || []).length - 1 || 0
    const title = tempTitle.replace(/#/g, "").trim()
    // const anchor = `#${title.replace(/ /g, "-").toLowerCase()}`
    const anchor = '#' + slugger.slug(title)
    level === 1 ? (globalID += 1) : globalID

    // console.log(level + " " + title + " " + anchor + " " + level)

    toc.push({
      level: level,
      id: globalID,
      title: title,
      anchor: anchor,
    })
  })

  function TOC() {
    return (
      <ul className="table-of-contents">
        {toc.map(({id, level, title, anchor}) => (
          <li className={`level${level}`} key={id}>
            <a href={anchor}>{title}</a>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div>
      <p className="pb-10 font-mono font-bold text-lg">Content</p>
      <div>
        <TOC/>
      </div>
    </div>
  )
}

export default TableOfContents