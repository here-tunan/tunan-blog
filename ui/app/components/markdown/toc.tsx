'use client'

import { useEffect, useState } from 'react'
import GithubSlugger from 'github-slugger'
import '../../toc.css'

export type TocContent = {
  level: number
  id: number
  title: string
  anchor: string
}

/**
 * 从 markdown 里解析出目录条目。
 * 会先剥掉代码块和链接，避免 code fence 里的 `#` 或 URL 里的 `#` 被误认为标题。
 */
export function parseToc(content: string): TocContent[] {
  if (!content) return []

  const regexReplaceCode = /(```.+?```)/gms
  const regexRemoveLinks = /\[(.*?)\]\(.*?\)/g
  const cleaned = content
    .replace(regexRemoveLinks, "")
    .replace(regexReplaceCode, "")

  const regXHeader = /#{1,6}\s.+/g
  const titles = cleaned.match(regXHeader)
  if (!titles) return []

  const slugger = new GithubSlugger()
  return titles.map((tempTitle, i) => {
    const level = (tempTitle?.match(/#/g) || []).length - 1 || 0
    const title = tempTitle.replace(/#/g, "").trim()
    const anchor = '#' + slugger.slug(title)
    return { level, id: i, title, anchor }
  })
}

interface ArticleProps {
  content: string;
}

const TocList = ({toc, onNavigate}: { toc: TocContent[]; onNavigate?: () => void }) => (
  <nav className="toc">
    <p className="toc-label">ON THIS PAGE</p>
    <ul className="table-of-contents">
      {toc.map(({id, level, title, anchor}) => (
        <li className={`level${level}`} key={id}>
          <a href={anchor} onClick={onNavigate}>{title}</a>
        </li>
      ))}
    </ul>
  </nav>
)

const TableOfContents = ({content}: ArticleProps) => {
  const [open, setOpen] = useState(false)
  const toc = parseToc(content)

  // ESC 关闭抽屉
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    // 抽屉打开时禁掉页面滚动
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  if (toc.length === 0) return null

  return (
    <>
      {/*
        桌面 (>=xl)：内嵌侧栏，绝对定位挂在阅读列右侧
        left-[calc(100%+32px)] = 阅读列右边缘再向外 32px
        inset-y-0 让侧栏与阅读列等高，内部 sticky 让 TOC 滚动时跟随
      */}
      <aside
        aria-label="table of contents"
        className="hidden xl:block absolute inset-y-0 left-[calc(100%+32px)] w-52"
      >
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <TocList toc={toc}/>
        </div>
      </aside>

      {/*
        小屏 (<xl)：右下角悬浮按钮 → 点击展开右侧抽屉
        z-40 让按钮压过普通内容，但低于抽屉的 z-[60]
      */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open table of contents"
        aria-expanded={open}
        className="xl:hidden fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"/>
          <line x1="8" y1="12" x2="21" y2="12"/>
          <line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/>
          <line x1="3" y1="12" x2="3.01" y2="12"/>
          <line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      </button>

      {/*
        小屏抽屉：遮罩 + 右滑面板
        z-[60] 压过 navbar 的 z-50，确保模态优先
      */}
      {open && (
        <div
          className="xl:hidden fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Table of contents"
            className="absolute right-0 top-0 bottom-0 w-72 max-w-[85vw] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-2xl overflow-y-auto p-6 animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <TocList toc={toc} onNavigate={() => setOpen(false)}/>
          </div>
        </div>
      )}
    </>
  )
}

export default TableOfContents