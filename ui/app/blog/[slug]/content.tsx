import '../../markdown.css'

import fs from 'node:fs'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'


type ContentProps = {
  content: string
  // slug: string
}

const Content = async (props: ContentProps) => {
  console.log(props)
  const fileContents = fs.readFileSync('public/content/demo.md', 'utf8');

  return (
    <div className="blog-content">
      <Markdown className="markdown-body"
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
      >
        {fileContents}
      </Markdown>
    </div>
  )
}

export default Content