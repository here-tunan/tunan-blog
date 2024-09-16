'use client'

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

// Helper to add scripts to our page
const insertScript = (id: string, parentElement: HTMLElement) => {
  const script = window.document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.id = id
  script.innerHTML = `
    var remark_config = {
    host: 'https://remark42.tunan.fun',
    components: ['embed', 'counter'],
    site_id: 'tunan-remark-fun',
    max_shown_comments: 10,
    theme: 'light',
    page_title: 'Moving to Remark42',
    locale: 'en',
    show_email_subscription: false, 
  };
  !function(e,n){for(var o=0;o<e.length;o++){var r=n.createElement("script"),c=".js",d=n.head||n.body;"noModule"in r?(r.type="module",c=".mjs"):r.async=!0,r.defer=!0,r.src=remark_config.host+"/web/"+e[o]+c,d.appendChild(r)}}(remark_config.components||["embed"],document);
  `
  parentElement.appendChild(script)
  return script
}

// Helper to remove scripts from our page
const removeScript = (id: string , parentElement: HTMLElement) => {
  const script = window.document.getElementById(id)
  if (script) {
    parentElement.removeChild(script)
  }
}

interface CommentsProps {
  commentsId: string | number; // Choose the appropriate type
}

const Comments = ( { commentsId }: CommentsProps) => {
  useEffect(() => {
    // If there's no window there's nothing to do for us
    if (!window) {
      return
    }
    const document = window.document
    // In case our #remark42 container exists we can add our comment script
    if (document.getElementById('remark42')) {
      insertScript('comments-script', document.body)
    }

    // Cleanup when the component unmounts
    return () => removeScript('comments-script', document.body)
  }, [commentsId])

  return (
    <>
      <div className="title">
        <span>Comments</span>
        <span className="counter"><span className="remark42__counter" data-url="{{ .Permalink }}"></span></span>
      </div>
      <div id="remark42"></div>
    </>
  )
}

Comments.propTypes = {
  commentsId: PropTypes.string,
}

export default Comments