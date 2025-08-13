import React from "react";
import BlogList from "@/app/components/blog/BlogList";
import { API_URL } from "@/lib/config";

async function getWeeklies(page: number) {
  try {
    const response = await fetch(`${API_URL}/article/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 2, // Type 2 for weeklies
        pageSize: 10, // 10 per page
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
    console.error("Error fetching weeklies:", error);
  }
  return [];
}

import Pagination from "@/app/components/Pagination";

// ... (getWeeklies function is here)

// 周报显示
export default async function Weekly({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Number(searchParams?.page) || 1;
  const weeklies = await getWeeklies(currentPage);

  const hasNextPage = weeklies.length === 10;

  return (
    <main>
      <div className="container">
        <BlogList blogs={weeklies}/>
        <Pagination basePath="/weekly" currentPage={currentPage} hasNextPage={hasNextPage} />
      </div>
    </main>
  );
}