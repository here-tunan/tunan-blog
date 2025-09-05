import React from "react";
import BlogList from "@/app/components/blog/BlogList";
import { API_URL } from "@/lib/config";

async function getTranslations(page: number) {
  try {
    const response = await fetch(`${API_URL}/article/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 3, // Type 3 for translations
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
    console.error("Error fetching translations:", error);
  }
  return [];
}

import Pagination from "@/app/components/Pagination";

export default async function Translations({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Number(searchParams?.page) || 1;
  const translations = await getTranslations(currentPage);

  const hasNextPage = translations.length === 10;

  return (
    <main>
      <div className="container">
        <BlogList blogs={translations}/>
        <Pagination basePath="/translations" currentPage={currentPage} hasNextPage={hasNextPage} />
      </div>
    </main>
  );
}