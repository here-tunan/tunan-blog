'use client'
import React, {useEffect, useState} from "react";
import BlogList from "@/app/components/blog/BlogList";
import service from "@/app/api/request";


export default function BlogsSection() {

  const [blogs, setBlogs] = useState([]);

  // Make a request for data to an API
  useEffect(() => {
    service.post('/article/list', {
      type: 1,
      pageSize: 10,
      pageIndex: 1,
    })
    .then(function (response) {
      console.log(response.data);
      let data = response.data;
      if (data.success) {
        setBlogs(data.data);
      }
      console.log(data.data)
    })
    .catch(function (error) {
      console.log(error);
    });
  }, []);

  return (
    <section className="section">
      <header className="section-header">
        <h3 className="title">Lasted Blogs</h3>
        <a href="/blog" className="viewall">
          <span>View all</span>
        </a>
      </header>

      <BlogList blogs={blogs}/>
    </section>
  )
}