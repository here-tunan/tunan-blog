import React from "react";
import HistoryHorizontalTimeline from "@/app/components/history/HistoryHorizontalTimeline";
import { API_URL } from "@/lib/config";

async function getHistoryEvents() {
  try {
    const response = await fetch(`${API_URL}/article/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 4, // Type 4 for blog history
        pageSize: 10, // Show only recent 10 events for homepage
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
    console.error("Error fetching history events:", error);
  }
  return [];
}

export default async function HistorySection() {
  const historyEvents = await getHistoryEvents();

  // Don't render if no history events
  if (historyEvents.length === 0) {
    return null;
  }

  return (
    <section className="section mt-2">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-5 bg-orange-500 rounded-full"></div>
          <h3 className="font-mono font-semibold text-lg">Blog Evolution</h3>
          <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full">
            Timeline
          </span>
        </div>
        <a 
          href="/history" 
          className="text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors flex items-center gap-1 group hover:gap-2"
        >
          <span>View full timeline</span>
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </header>

      <HistoryHorizontalTimeline events={historyEvents} />
    </section>
  )
}