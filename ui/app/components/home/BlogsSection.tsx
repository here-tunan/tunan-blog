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
    <section className="section mt-2">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-5 bg-green-500 rounded-full"></div>
          <h3 className="font-mono font-semibold text-lg">Latest Blogs</h3>
        </div>
        <a 
          href="/blog" 
          className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors flex items-center gap-1 group hover:gap-2"
        >
          <span>View all</span>
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </header>

      {blogs.length > 0 && <BlogList blogs={blogs} />}
    </section>
  )
}