import React from "react";
import BlogList from "@/app/components/blog/BlogList";
import { API_URL } from "@/lib/config";

async function getBlogs() {
  try {
    // We use fetch directly here to control the caching behavior
    const response = await fetch(`${API_URL}/article/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 1,
        pageSize: 10,
        pageIndex: 1,
      }),
      // This is the key part: it tells Next.js not to cache the result.
      cache: 'no-store',
    });

    if (!response.ok) {
      // Log the error for debugging on the server
      console.error(`API request failed with status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    if (data && data.success) {
      return data.data;
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }
  return [];
}

export default async function BlogsSection() {
  const blogs = await getBlogs();

  return (
    <section className="section">
      <header className="section-header">
        <h3 className="title">Latest Blogs</h3>
        <a href="/blog" className="viewall">
          <span>View all</span>
        </a>
      </header>

      {blogs.length > 0 && <BlogList blogs={blogs} />}
    </section>
  )
}