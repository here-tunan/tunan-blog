import React from "react";
import HistoryTimeline from "@/app/components/history/HistoryTimeline";
import { API_URL } from "@/lib/config";

async function getAllHistoryEvents() {
  try {
    const response = await fetch(`${API_URL}/article/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 4, // Type 4 for blog history
        pageSize: 999, // Get all history events
        pageIndex: 1,
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
    console.error("Error fetching history events:", error);
  }
  return [];
}

export default async function History() {
  const historyEvents = await getAllHistoryEvents();

  return (
    <main>
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold font-mono mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Blog History Timeline
            </h1>
            <p className="text-muted-foreground">
              Journey through the evolution and milestones of this blog
            </p>
          </header>
          
          <HistoryTimeline events={historyEvents} />
        </div>
      </div>
    </main>
  );
}