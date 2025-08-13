import React from "react";
import BlogList from "@/app/components/blog/BlogList";
import { API_URL } from "@/lib/config";

async function getBlogs(page: number) {
  try {
    const response = await fetch(`${API_URL}/article/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 1, // Type 1 for blogs
        pageSize: 10, // Let's say 10 per page
        pageIndex: page,
      }),
      cache: 'no-store', // Fetch fresh data on each request
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
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

import Pagination from "@/app/components/Pagination";

// ... (getBlogs function is here)

export default async function Blog({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Number(searchParams?.page) || 1;
  const blogs = await getBlogs(currentPage);

  const hasNextPage = blogs.length === 10;

  return (
    <main>
      <div className="container">
        <BlogList blogs={blogs}/>
        <Pagination basePath="/blog" currentPage={currentPage} hasNextPage={hasNextPage} />
      </div>
    </main>
  );
}