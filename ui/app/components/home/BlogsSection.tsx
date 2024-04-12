import React from "react";
import BlogList from "@/app/components/blog/BlogList";

export default function BlogsSection() {
  return (
    <section className="section">
      <header className="section-header">
        <h3 className="title">Lasted Blogs</h3>
        <a href="/blog" className="viewall">
          <span>View all</span>
        </a>
      </header>

      <BlogList/>
    </section>
  )
}