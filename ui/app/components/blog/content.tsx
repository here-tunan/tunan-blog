import '../../markdown.css'

import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

type ContentProps = {
  content: string
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

  return (
    <Markdown className="markdown-body"
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeSlug, [rehypeAutolinkHeadings, autolinkHeadingsOptions]]}
    >
      {markdown}
    </Markdown>

  )
}

export default Content