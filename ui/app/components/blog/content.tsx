import '../../markdown.css'

import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeRaw from 'rehype-raw'


type ContentProps = {
  content: string
  locale?: string
  // slug: string
}

const Content = async (props: ContentProps) => {
  // const fileContents = fs.readFileSync('public/content/demo.md', 'utf8');
  const markdown = props.content

  const autolinkHeadingsOptions = {
    behavior: 'append',
    properties: {
      className: ['heading_anchor_svg'],
    },
  };

  // lang 属性用于让 CSS 的 hyphens: auto 选择正确的断词词典
  const lang = props.locale || 'en'

  return (
    <div lang={lang}>
      <Markdown className="markdown-body"
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeSlug, [rehypeAutolinkHeadings, autolinkHeadingsOptions], rehypeRaw]}
      >
        {markdown}
      </Markdown>
    </div>
  )
}

export default Content