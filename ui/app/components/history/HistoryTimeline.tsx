interface HistoryEvent {
  id: number;
  title: string;
  content: string;
  slug: string;
  gmtCreate: string;
  tagNames: string[];
}

interface HistoryTimelineProps {
  events: HistoryEvent[];
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (error) {
    return 'Invalid Date';
  }
}

import { getEventIcon } from './utils';

export default function HistoryTimeline({ events }: HistoryTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📜</div>
        <p className="text-muted-foreground">No history events found</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-red-500 to-purple-500"></div>
      
      {/* Timeline start marker */}
      <div className="relative flex items-center mb-8">
        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-xl">🎯</span>
        </div>
        <div className="ml-6">
          <p className="text-muted-foreground italic">Journey continues...</p>
        </div>
      </div>
      
      <div className="space-y-8">
        {events.map((event, index) => (
          <div key={event.id} className="relative flex items-start">
            {/* Timeline node */}
            <div className="flex-shrink-0 w-16 h-16 bg-white dark:bg-gray-900 border-4 border-orange-500 rounded-full flex items-center justify-center shadow-lg z-10">
              <span className="text-xl">{getEventIcon(event.title, event.id)}</span>
            </div>
            
            {/* Event content */}
            <div className="ml-6 flex-1 min-w-0">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-750 border border-orange-100 dark:border-gray-700 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                {/* Date badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 mb-3">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(event.gmtCreate)}
                </div>
                
                {/* Event title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  <a 
                    href={`/blog/${event.slug}`} 
                    className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    {event.title}
                  </a>
                </h3>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}