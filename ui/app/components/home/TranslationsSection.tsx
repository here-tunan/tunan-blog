import React from "react";
import TranslationList from "@/app/components/home/TranslationList";
import { API_URL } from "@/lib/config";

async function getTranslations() {
  try {
    const response = await fetch(`${API_URL}/article/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 3, // Type 3 for translations
        pageSize: 5, // Show fewer translations on homepage
        pageIndex: 1,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      return [];
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

export default async function TranslationsSection() {
  const translations = await getTranslations();

  // Don't render if no translations
  if (translations.length === 0) {
    return null;
  }

  return (
    <section className="section mt-2">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-5 bg-purple-500 rounded-full"></div>
          <h3 className="font-mono font-semibold text-lg">Latest Translations</h3>
          <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
            New
          </span>
        </div>
        <a 
          href="/translations" 
          className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors flex items-center gap-1 group hover:gap-2"
        >
          <span>View all</span>
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </header>

      <TranslationList translations={translations} />
    </section>
  )
}