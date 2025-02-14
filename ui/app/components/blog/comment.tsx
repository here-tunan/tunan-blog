'use client'

import {Fragment, useEffect, useState} from 'react'
declare global {
  interface Window {
    REMARK42: any;
    remark_config: any;
  }
}

// This function will insert the usual <script> tag of
// Remark42 into the specified DOM location (parentElement)
const insertScript = (id: string, theme: string, parentElement: HTMLElement) => {
  const script = window.document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.id = id
  let url = window.location.origin + window.location.pathname;
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  script.innerHTML = `
    var remark_config = {
    host: 'https://remark42.tunan.fun',
    components: ['embed', 'counter'],
    site_id: 'tunan-remark',
    url: "${url}",
    max_shown_comments: 10,
    theme: "${theme}",
    page_title: 'Moving to Remark42',
    locale: 'en',
    show_email_subscription: false, 
  };
  !function(e,n){for(var o=0;o<e.length;o++){var r=n.createElement("script"),c=".js",d=n.head||n.body;"noModule"in r?(r.type="module",c=".mjs"):r.async=!0,r.defer=!0,r.src=remark_config.host+"/web/"+e[o]+c,d.appendChild(r)}}(remark_config.components||["embed"],document);`;
  parentElement.appendChild(script);
};

/* This function removes the previously added script from the DOM.
Might be necessary when page transitions happen, to make sure a new instance
is created, pointing to the current URL. Although this might actually
not be necessary, please do your own testing. */
const removeScript = (id: string , parentElement: HTMLElement) => {
  const script = window.document.getElementById(id)
  if (script) {
    parentElement.removeChild(script)
  }
};

// This function will be provided to useEffect and will insert the script
// when the component is mounted and remove it when it unmounts
const manageScript = (theme: string) => {
  console.log('theme = ', theme)
  if (!window) {
    return () => {};
  }
  const { document } = window;
  if (document.getElementById('remark42')) {
    insertScript('comments-script', theme, document.body);
  }
  return () => removeScript('comments-script', document.body);
};

/* Another function for another useEffect - this is the most crucial part for
Gatsby compatibility. It will ensure that each page loads its own appropriate
comments, and that comments will be properly loaded */
const recreateRemark42Instance = () => {
  if (!window) {
    return;
  }
  const remark42 = window.REMARK42;
  if (remark42) {
    remark42.destroy();
    remark42.createInstance(window.remark_config);
  }
};

// The location prop is {props.location.pathname} from the parent component.
// I.e. invoke the component like this in the parent: <Comments location={props.location.pathname} />
export function Comments() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    // 获取当前页面的 URL
    const currentUrl = window.location.origin + window.location.pathname;
    setUrl(currentUrl);
  }, []);

  // next-themes 提供的组件会把当前主题保存在 localStorage 中
  const currentTheme = window.localStorage.getItem('theme') || 'light';
  // Insert the two useEffect hooks. Maybe you can combine them into one? Feel free if you want to.
  useEffect(() => manageScript(currentTheme));
  useEffect(recreateRemark42Instance, []);

  return (
    <Fragment>
      <div className="mt-10 mb-5 border-t-2 pt-3">
        <span className="text-2xl pr-1 font-extralight">Comments</span>
        <span className="counter align-super font-bold"><span className="remark42__counter" data-url={url}></span></span>
      </div>
      {/* This div is the target for actual comments insertion */}
      <div id="remark42"/>
    </Fragment>
  );
}