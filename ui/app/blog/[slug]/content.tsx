import '../../markdown.css'

import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'

type ContentProps = {
  content: string
  // slug: string
}

const Content = async (props: ContentProps) => {
  // const fileContents = fs.readFileSync('public/content/demo.md', 'utf8');
  const markdown = props.content

  return (
    <Markdown className="markdown-body"
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight, rehypeSlug]}
    >
      {markdown}
    </Markdown>

  )
}

export default Content