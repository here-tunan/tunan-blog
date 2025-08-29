import React from "react";
import Link from "next/link";
import { API_URL } from "@/lib/config";

interface Weekly {
  id: number;
  title: string;
  slug: string;
  gmtCreate: string;
  viewNumber: number;
}

async function getRecentWeeklies() {
  try {
    const response = await fetch(`${API_URL}/article/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 2, // Type 2 for weeklies
        pageSize: 3, // Get only 3 recent weeklies
        pageIndex: 1,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.success) {
      return data.data;
    }
  } catch (error) {
    console.error("Error fetching recent weeklies:", error);
  }
  return [];
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return 'Invalid Date';
  }
}

export default async function WeeklySection() {
  const weeklies = await getRecentWeeklies();

  if (weeklies.length === 0) {
    return null;
  }

  return (
    <section className="section mb-10">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-5 bg-blue-500 rounded-full"></div>
          <h3 className="font-mono font-semibold text-lg">Recent Weekly</h3>
          <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded">
            NEW
          </span>
        </div>
        <Link 
          href="/weekly" 
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1 group hover:gap-2"
        >
          <span>View all</span>
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {weeklies.map((weekly: Weekly) => {
          // Extract week number from title (supports formats like "周报#21-xxx" or "Report#32-xxx")
          const weekNumberMatch = weekly.title.match(/#(\d+)/);
          const weekNumber = weekNumberMatch ? weekNumberMatch[1] : '?';
          
          return (
            <Link
              key={weekly.id}
              href={`/blog/${weekly.slug}`}
              className="group relative block p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 border border-blue-100 dark:border-gray-700 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Week number badge */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                #{weekNumber}
              </div>
            
            <div className="flex flex-col h-full">
              <h3 className="font-semibold text-base mb-3 text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                {weekly.title}
              </h3>
              
              <div className="mt-auto flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(weekly.gmtCreate)}
                </span>
                <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {weekly.viewNumber}
                </span>
              </div>
            </div>
          </Link>
          );
        })}
      </div>
    </section>
  );
}